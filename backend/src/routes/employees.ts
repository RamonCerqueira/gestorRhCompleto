import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Schema de validação para funcionário
const employeeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  cpf: z.string().min(11),
  position: z.string().min(1),
  department: z.string().min(1),
  hireDate: z.string().optional(),
});

// Listar todos os funcionários
router.get('/', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        documents: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(employees);
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar funcionário por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
      include: {
        documents: {
          orderBy: {
            uploadDate: 'desc',
          },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Erro ao buscar funcionário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo funcionário
router.post('/', async (req, res) => {
  try {
    const data = employeeSchema.parse(req.body);

    const employee = await prisma.employee.create({
      data: {
        ...data,
        hireDate: data.hireDate ? new Date(data.hireDate) : new Date(),
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    res.status(400).json({ error: 'Dados inválidos' });
  }
});

// Atualizar funcionário
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = employeeSchema.partial().parse(req.body);

    const employee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        hireDate: data.hireDate ? new Date(data.hireDate) : undefined,
      },
    });

    res.json(employee);
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    res.status(400).json({ error: 'Dados inválidos' });
  }
});

// Deletar funcionário
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.employee.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar funcionário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter estatísticas do dashboard
router.get('/stats/dashboard', async (req, res) => {
  try {
    const totalEmployees = await prisma.employee.count();
    
    const employeesOK = await prisma.employee.count({
      where: { status: 'OK' },
    });
    
    const employeesPending = await prisma.employee.count({
      where: { status: 'Pendente' },
    });
    
    const employeesAlert = await prisma.employee.count({
      where: { status: 'Alerta' },
    });

    // Documentos vencendo nos próximos 30 dias
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const documentsExpiringSoon = await prisma.document.count({
      where: {
        dueDate: {
          lte: thirtyDaysFromNow,
          gte: new Date(),
        },
      },
    });

    res.json({
      totalEmployees,
      employeesOK,
      employeesPending,
      employeesAlert,
      documentsExpiringSoon,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;

