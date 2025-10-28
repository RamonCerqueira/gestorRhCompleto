import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/documents';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  },
});

// Schema de validação para documento
const documentSchema = z.object({
  employeeId: z.number(),
  docType: z.string().min(1),
  category: z.string().min(1),
  dueDate: z.string().optional(),
});

// IMPORTANTE: Rotas específicas ANTES das rotas com parâmetros
// Estatísticas de documentos por status
router.get('/stats/by-status', async (req, res) => {
  try {
    const documentStats = await prisma.document.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const formattedStats = documentStats.map(stat => ({
      status: stat.status,
      count: stat._count.id,
    }));

    // Garantir que todos os status estejam presentes
    const allStatuses = ['Válido', 'Vencido', 'Vencendo', 'Pendente'];
    const completeStats = allStatuses.map(status => {
      const found = formattedStats.find(s => s.status === status);
      return {
        status,
        count: found ? found.count : 0,
      };
    });

    res.json(completeStats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas de documentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar documentos de um funcionário
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const documents = await prisma.document.findMany({
      where: { employeeId: parseInt(employeeId) },
      orderBy: {
        uploadDate: 'desc',
      },
    });

    res.json(documents);
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Upload de documento
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { employeeId, docType, category, dueDate } = req.body;

    const document = await prisma.document.create({
      data: {
        employeeId: parseInt(employeeId),
        docType,
        category,
        fileName: req.file.originalname,
        filePath: req.file.path,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Erro ao fazer upload do documento:', error);
    res.status(400).json({ error: 'Dados inválidos' });
  }
});

// Buscar documento por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const document = await prisma.document.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    res.json(document);
  } catch (error) {
    console.error('Erro ao buscar documento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Download de documento
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const document = await prisma.document.findUnique({
      where: { id: parseInt(id) },
    });

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado no servidor' });
    }

    res.download(document.filePath, document.fileName);
  } catch (error) {
    console.error('Erro ao fazer download do documento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar documento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const document = await prisma.document.findUnique({
      where: { id: parseInt(id) },
    });

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    // Deletar arquivo do sistema de arquivos
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Deletar registro do banco
    await prisma.document.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar status do documento
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const document = await prisma.document.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(document);
  } catch (error) {
    console.error('Erro ao atualizar status do documento:', error);
    res.status(400).json({ error: 'Dados inválidos' });
  }
});

export default router;

