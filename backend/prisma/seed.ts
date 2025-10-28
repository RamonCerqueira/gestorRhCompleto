import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário administrador padrão
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@docgestor.com' },
    update: {},
    create: {
      email: 'admin@docgestor.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // Criar usuário comum para testes
  const userPassword = await bcrypt.hash('user123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'user@docgestor.com' },
    update: {},
    create: {
      email: 'user@docgestor.com',
      name: 'Usuário Teste',
      password: userPassword,
      role: 'user',
    },
  });

  // Criar funcionários de exemplo
  const employee1 = await prisma.employee.upsert({
    where: { email: 'joao.silva@empresa.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'joao.silva@empresa.com',
      cpf: '12345678901',
      position: 'Desenvolvedor',
      department: 'TI',
      status: 'OK',
    },
  });

  const employee2 = await prisma.employee.upsert({
    where: { email: 'maria.santos@empresa.com' },
    update: {},
    create: {
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      cpf: '98765432109',
      position: 'Analista de RH',
      department: 'Recursos Humanos',
      status: 'Pendente',
    },
  });

  const employee3 = await prisma.employee.upsert({
    where: { email: 'pedro.oliveira@empresa.com' },
    update: {},
    create: {
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@empresa.com',
      cpf: '11122233344',
      position: 'Gerente de Vendas',
      department: 'Vendas',
      status: 'Alerta',
    },
  });

  // Criar documentos de exemplo
  const documents = await Promise.all([
    // Documentos para João Silva
    prisma.document.create({
      data: {
        employeeId: employee1.id,
        docType: 'Contrato de Trabalho',
        category: 'Admissão',
        fileName: 'contrato_joao_silva.pdf',
        filePath: 'uploads/documents/contrato_joao_silva.pdf',
        status: 'Válido',
        dueDate: new Date('2026-01-15'),
      },
    }),
    prisma.document.create({
      data: {
        employeeId: employee1.id,
        docType: 'ASO - Atestado de Saúde Ocupacional',
        category: 'Admissão',
        fileName: 'aso_joao_silva.pdf',
        filePath: 'uploads/documents/aso_joao_silva.pdf',
        status: 'Vencendo',
        dueDate: new Date('2025-10-15'),
      },
    }),
    // Documentos para Maria Santos
    prisma.document.create({
      data: {
        employeeId: employee2.id,
        docType: 'Holerite',
        category: 'Dia a Dia',
        fileName: 'holerite_maria_santos_09_2025.pdf',
        filePath: 'uploads/documents/holerite_maria_santos_09_2025.pdf',
        status: 'Válido',
      },
    }),
    prisma.document.create({
      data: {
        employeeId: employee2.id,
        docType: 'Exame Periódico',
        category: 'Dia a Dia',
        fileName: 'exame_periodico_maria_santos.pdf',
        filePath: 'uploads/documents/exame_periodico_maria_santos.pdf',
        status: 'Vencido',
        dueDate: new Date('2025-08-01'),
      },
    }),
    // Documentos para Pedro Oliveira
    prisma.document.create({
      data: {
        employeeId: employee3.id,
        docType: 'Aviso de Férias',
        category: 'Férias',
        fileName: 'aviso_ferias_pedro_oliveira.pdf',
        filePath: 'uploads/documents/aviso_ferias_pedro_oliveira.pdf',
        status: 'Pendente',
      },
    }),
    prisma.document.create({
      data: {
        employeeId: employee3.id,
        docType: 'Carteira de Trabalho',
        category: 'Admissão',
        fileName: 'ctps_pedro_oliveira.pdf',
        filePath: 'uploads/documents/ctps_pedro_oliveira.pdf',
        status: 'Válido',
      },
    }),
  ]);

  console.log('Seed executado com sucesso!');
  console.log('Usuários criados:', { admin, user });
  console.log('Funcionários criados:', { employee1, employee2, employee3 });
  console.log('Documentos criados:', documents.length, 'documentos');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

