import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import employeeRoutes from './routes/employees';
import documentRoutes from './routes/documents';
import vacationRoutes from './routes/vacations';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = parseInt(process.env.PORT || '5000');

app.use(express.json());
app.use(cors());

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/vacations', vacationRoutes);

app.get('/', (req, res) => {
  res.send('API Doc-Gestor RH está funcionando!');
});

async function main() {
  try {
    await prisma.$connect();
    console.log('Conectado ao banco de dados');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados ou iniciar o servidor:', error);
    process.exit(1);
  }
}

main();


