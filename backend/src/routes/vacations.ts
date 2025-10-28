import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import axios from 'axios';

const router = express.Router();
const prisma = new PrismaClient();

// Schema de validação para solicitação de férias
const vacationRequestSchema = z.object({
  employeeId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  type: z.enum(['Total', 'Parcial']),
  isAbonoPecuniario: z.boolean().optional(),
  abonoDays: z.number().optional(),
});

// Schema de validação para aprovação/rejeição
const vacationApprovalSchema = z.object({
  status: z.enum(['Aprovada', 'Rejeitada']),
  approvedBy: z.string(),
  rejectedReason: z.string().optional(),
});

interface Holiday {
  date: string;
  name: string;
  type: string;
}

async function getNationalHolidays(year: number): Promise<Date[]> {
  try {
    const response = await axios.get<Holiday[]>(`https://brasilapi.com.br/api/feriados/v1/${year}`);
    return response.data.map(holiday => new Date(holiday.date));
  } catch (error) {
    console.error('Erro ao buscar feriados nacionais:', error);
    return [];
  }
}

// Função para calcular dias úteis entre duas datas
function calculateBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Não é domingo (0) nem sábado (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

// Função para calcular dias corridos entre duas datas
function calculateCalendarDays(startDate: Date, endDate: Date): number {
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
}

// Função para determinar os dias de férias com base nas faltas injustificadas
function getVacationDaysByAbsences(unjustifiedAbsences: number): number {
  if (unjustifiedAbsences <= 5) {
    return 30;
  } else if (unjustifiedAbsences <= 14) {
    return 24;
  } else if (unjustifiedAbsences <= 23) {
    return 18;
  } else if (unjustifiedAbsences <= 32) {
    return 12;
  } else {
    return 0; // Perda do direito às férias
  }
}

// Função para validar regras de férias
async function validateVacationRequest(employeeId: number, startDate: Date, endDate: Date, type: string, isAbonoPecuniario: boolean | undefined, abonoDays: number | undefined) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: { vacations: true }
  });

  if (!employee) {
    throw new Error('Funcionário não encontrado');
  }

  const daysRequested = calculateCalendarDays(startDate, endDate);
  const allowedVacationDays = getVacationDaysByAbsences(employee.unjustifiedAbsences);

  if (allowedVacationDays === 0) {
    throw new Error('Funcionário perdeu o direito às férias devido ao excesso de faltas injustificadas.');
  }

  // Validar se o número de dias solicitados não excede o permitido
  if (daysRequested > allowedVacationDays) {
    throw new Error(`Número de dias de férias solicitado (${daysRequested}) excede o permitido (${allowedVacationDays}).`);
  }

  // Validar se não inicia em feriado ou fim de semana
  const startDayOfWeek = startDate.getDay();
  const holidays = await getNationalHolidays(startDate.getFullYear());
  const isHoliday = holidays.some(holiday => holiday.toDateString() === startDate.toDateString());

  if (startDayOfWeek === 0 || startDayOfWeek === 6 || isHoliday) {
    throw new Error('Férias não podem iniciar em fim de semana ou feriado');
  }

  // Validar abono pecuniário
  if (isAbonoPecuniario) {
    if (!abonoDays || abonoDays <= 0) {
      throw new Error('Para abono pecuniário, o número de dias vendidos deve ser informado e ser maior que zero.');
    }
    if (abonoDays > (allowedVacationDays / 3)) { // 1/3 das férias permitidas
      throw new Error(`Não é possível vender mais de 1/3 das férias (${Math.floor(allowedVacationDays / 3)} dias).`);
    }
    if (daysRequested + abonoDays !== allowedVacationDays) {
      throw new Error(`A soma dos dias de férias e dias de abono pecuniário deve ser igual aos dias de férias permitidos (${allowedVacationDays}).`);
    }

    // Validar prazo para abono pecuniário (até 15 dias antes do término do período aquisitivo)
    const acquisitivePeriodEnd = new Date(employee.currentAcquisitivePeriodStart);
    acquisitivePeriodEnd.setFullYear(acquisitivePeriodEnd.getFullYear() + 1);
    acquisitivePeriodEnd.setDate(acquisitivePeriodEnd.getDate() - 1);

    const deadlineForAbono = new Date(acquisitivePeriodEnd);
    deadlineForAbono.setDate(deadlineForAbono.getDate() - 15);

    if (new Date() > deadlineForAbono) {
      throw new Error('A solicitação de abono pecuniário deve ser feita até 15 dias antes do término do período aquisitivo.');
    }
  }

  // Validar fracionamento
  if (type === 'Parcial') {
    if (daysRequested < 5) {
      throw new Error('Período parcial de férias deve ter no mínimo 5 dias corridos');
    }
    
    // Verificar se já tem um período de 14 dias ou mais
    const approvedVacations = employee.vacations.filter(v => v.status === 'Aprovada');
    const hasMainPeriod = approvedVacations.some(v => v.days >= 14);
    
    if (!hasMainPeriod && daysRequested < 14) {
      throw new Error('O primeiro período de férias deve ter no mínimo 14 dias corridos');
    }
  }

  // Validar se não há sobreposição de datas
  const overlappingVacations = employee.vacations.filter(vacation => {
    if (vacation.status === 'Rejeitada' || vacation.status === 'Cancelada') {
      return false;
    }
    
    const vacationStart = new Date(vacation.startDate);
    const vacationEnd = new Date(vacation.endDate);
    
    return (startDate <= vacationEnd && endDate >= vacationStart);
  });

  if (overlappingVacations.length > 0) {
    throw new Error('Já existe uma solicitação de férias para este período');
  }

  // Validar período aquisitivo
  const currentDate = new Date();
  const hireDate = new Date(employee.hireDate);
  const monthsWorked = (currentDate.getFullYear() - hireDate.getFullYear()) * 12 +
                      (currentDate.getMonth() - hireDate.getMonth());

  if (monthsWorked < 12) {
    throw new Error('Funcionário ainda não completou o período aquisitivo de 12 meses');
  }

  // Validar se não há duas férias vencidas
  const acquisitivePeriods = [];
  let periodStart = new Date(hireDate);
  
  while (periodStart < currentDate) {
    const periodEnd = new Date(periodStart);
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    periodEnd.setDate(periodEnd.getDate() - 1);
    
    const concessiveEnd = new Date(periodEnd);
    concessiveEnd.setFullYear(concessiveEnd.getFullYear() + 1);
    
    acquisitivePeriods.push({
      acquisitivePeriodStart: periodStart,
      acquisitivePeriodEnd: periodEnd,
      concessiveEnd: concessiveEnd
    });
    
    periodStart = new Date(periodEnd);
    periodStart.setDate(periodStart.getDate() + 1);
  }

  // Verificar férias vencidas
  let expiredPeriods = 0;
  for (const period of acquisitivePeriods) {
    if (period.concessiveEnd < currentDate) {
      const hasVacationForPeriod = employee.vacations.some(vacation => {
        const vacationStart = new Date(vacation.startDate);
        return vacation.status === 'Aprovada' && 
               vacationStart >= period.acquisitivePeriodStart && 
               vacationStart <= period.concessiveEnd;
      });
      
      if (!hasVacationForPeriod) {
        expiredPeriods++;
      }
    }
  }

  if (expiredPeriods >= 2) {
    throw new Error('Funcionário já possui duas férias vencidas. Não é possível solicitar novas férias.');
  }

  return true;
}

// Listar todas as férias
router.get('/', async (req, res) => {
  try {
    const vacations = await prisma.vacation.findMany({
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
            department: true
          }
        }
      },
      orderBy: {
        requestDate: 'desc'
      }
    });

    res.json(vacations);
  } catch (error) {
    console.error('Erro ao buscar férias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar férias de um funcionário específico
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const vacations = await prisma.vacation.findMany({
      where: { employeeId: parseInt(employeeId) },
      orderBy: { requestDate: 'desc' }
    });

    res.json(vacations);
  } catch (error) {
    console.error('Erro ao buscar férias do funcionário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar férias por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const vacation = await prisma.vacation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!vacation) {
      return res.status(404).json({ error: 'Solicitação de férias não encontrada' });
    }

    res.json(vacation);
  } catch (error) {
    console.error('Erro ao buscar férias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Solicitar férias
router.post('/', async (req, res) => {
  try {
    const validatedData = vacationRequestSchema.parse(req.body);
    
    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(validatedData.endDate);
    
    // Validar datas
    if (startDate >= endDate) {
      return res.status(400).json({ error: 'Data de início deve ser anterior à data de fim' });
    }

    const days = calculateCalendarDays(startDate, endDate);
    
    // Validar regras de férias
    await validateVacationRequest(validatedData.employeeId, startDate, endDate, validatedData.type, validatedData.isAbonoPecuniario, validatedData.abonoDays);

    // Calcular período aquisitivo
    const employee = await prisma.employee.findUnique({
      where: { id: validatedData.employeeId }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    const hireDate = new Date(employee.hireDate);
    const currentDate = new Date();
    
    // Calcular o período aquisitivo atual
    let acquisitivePeriodStart = new Date(hireDate);
    while (acquisitivePeriodStart < startDate) {
      const nextPeriod = new Date(acquisitivePeriodStart);
      nextPeriod.setFullYear(nextPeriod.getFullYear() + 1);
      
      if (nextPeriod > startDate) {
        break;
      }
      
      acquisitivePeriodStart = nextPeriod;
    }
    
    const acquisitivePeriodEnd = new Date(acquisitivePeriodStart);
    acquisitivePeriodEnd.setFullYear(acquisitivePeriodEnd.getFullYear() + 1);
    acquisitivePeriodEnd.setDate(acquisitivePeriodEnd.getDate() - 1);

    // Criar solicitação de férias
    const vacation = await prisma.vacation.create({
      data: {
        employeeId: validatedData.employeeId,
        startDate,
        endDate,
        days,
        type: validatedData.type,
        isAbonoPecuniario: validatedData.isAbonoPecuniario || false,
        abonoDays: validatedData.abonoDays || null,
        acquisitivePeriodStart,
        acquisitivePeriodEnd,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
            department: true
          }
        }
      }
    });

    res.status(201).json(vacation);
  } catch (error) {
    console.error('Erro ao solicitar férias:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.issues });
    }
    
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Aprovar ou rejeitar férias
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = vacationApprovalSchema.parse(req.body);

    const vacation = await prisma.vacation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!vacation) {
      return res.status(404).json({ error: 'Solicitação de férias não encontrada' });
    }

    if (vacation.status !== 'Pendente') {
      return res.status(400).json({ error: 'Esta solicitação já foi processada' });
    }

    const updateData: any = {
      status: validatedData.status,
      approvedBy: validatedData.approvedBy,
    };

    if (validatedData.status === 'Aprovada') {
      updateData.approvedAt = new Date();
      
      // Atualizar data da última férias do funcionário
      await prisma.employee.update({
        where: { id: vacation.employeeId },
        data: { lastVacationEndDate: vacation.endDate }
      });
    } else if (validatedData.status === 'Rejeitada') {
      updateData.rejectedReason = validatedData.rejectedReason;
    }

    const updatedVacation = await prisma.vacation.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
            department: true
          }
        }
      }
    });

    res.json(updatedVacation);
  } catch (error) {
    console.error('Erro ao atualizar status das férias:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.issues });
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Cancelar férias (apenas se ainda não aprovadas)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const vacation = await prisma.vacation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!vacation) {
      return res.status(404).json({ error: 'Solicitação de férias não encontrada' });
    }

    if (vacation.status === 'Aprovada') {
      return res.status(400).json({ error: 'Não é possível cancelar férias já aprovadas' });
    }

    await prisma.vacation.update({
      where: { id: parseInt(id) },
      data: { status: 'Cancelada' }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao cancelar férias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter estatísticas de férias
router.get('/stats/dashboard', async (req, res) => {
  try {
    const totalVacations = await prisma.vacation.count();
    const pendingVacations = await prisma.vacation.count({
      where: { status: 'Pendente' }
    });
    const approvedVacations = await prisma.vacation.count({
      where: { status: 'Aprovada' }
    });
    const rejectedVacations = await prisma.vacation.count({
      where: { status: 'Rejeitada' }
    });

    // Férias vencendo nos próximos 30 dias
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingVacations = await prisma.vacation.count({
      where: {
        status: 'Aprovada',
        startDate: {
          gte: new Date(),
          lte: thirtyDaysFromNow
        }
      }
    });

    res.json({
      totalVacations,
      pendingVacations,
      approvedVacations,
      rejectedVacations,
      upcomingVacations
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de férias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter calendário de férias
router.get('/calendar/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const vacations = await prisma.vacation.findMany({
      where: {
        status: 'Aprovada',
        OR: [
          {
            startDate: {
              gte: startDate,
              lte: endDate
            }
          },
          {
            endDate: {
              gte: startDate,
              lte: endDate
            }
          },
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gte: endDate } }
            ]
          }
        ]
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            position: true,
            department: true
          }
        }
      }
    });

    res.json(vacations);
  } catch (error) {
    console.error('Erro ao buscar calendário de férias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;


