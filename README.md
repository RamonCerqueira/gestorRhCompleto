# Doc-Gestor RH - Sistema de Gestão de Documentos

Sistema completo para gestão de documentos de funcionários CLT, desenvolvido com Next.js, Node.js, TypeScript, Prisma e PostgreSQL.

## 📋 Funcionalidades

### Dashboard
- Visão geral dos funcionários e status da documentação
- Cards com estatísticas (Total, OK, Pendente, Alerta)
- Lembretes de documentos vencendo
- Ações rápidas para funcionalidades principais

### Gestão de Funcionários
- Listagem completa de funcionários
- Busca e filtros por status
- Cadastro de novos funcionários
- Visualização detalhada de cada funcionário

### Gestão de Documentos
- Organização por categorias (Admissão, Dia a Dia, Férias, Desligamento)
- Upload de documentos por funcionário
- Controle de vencimento de documentos
- Download e visualização de arquivos
- Documentos específicos para CLT:
  - **Admissão**: Contrato, ASO, Documentos Pessoais, etc.
  - **Dia a Dia**: Holerites, Atestados, Advertências, etc.
  - **Férias**: Aviso de Férias, Recibo de Pagamento
  - **Desligamento**: TRCT, Exame Demissional, Seguro-Desemprego

### Autenticação
- Sistema de login seguro
- Diferentes níveis de acesso (Admin/Usuário)
- Botões de login rápido para testes

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Zod** - Validação de schemas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Multer** - Upload de arquivos
- **bcryptjs** - Hash de senhas

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd doc-gestor-rh
```

### 2. Configuração do Backend
```bash
cd backend
npm install
```

### 3. Configuração do Banco de Dados
```bash
# Copie o arquivo .env.example para .env e configure as variáveis
cp .env.example .env

# Execute as migrações
npx prisma migrate dev

# Popule o banco com dados iniciais
npx prisma db seed
```

### 4. Configuração do Frontend
```bash
cd ../frontend
npm install

# Copie o arquivo .env.local.example para .env.local
cp .env.local.example .env.local
```

### 5. Executar em Desenvolvimento
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

A aplicação estará disponível em:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🐳 Deploy com Docker

### Usando Docker Compose
```bash
# Na raiz do projeto
docker-compose up -d
```

### Build individual
```bash
# Backend
cd backend
docker build -t docgestor-backend .

# Frontend
cd frontend
docker build -t docgestor-frontend .
```

## 👥 Usuários de Teste

O sistema vem com usuários pré-configurados para testes:

### Administrador
- **Email**: admin@docgestor.com
- **Senha**: admin123

### Usuário
- **Email**: user@docgestor.com
- **Senha**: user123

## 📁 Estrutura do Projeto

```
doc-gestor-rh/
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   └── index.ts        # Arquivo principal
│   ├── prisma/             # Schema e migrações
│   └── uploads/            # Arquivos enviados
├── frontend/               # Aplicação Next.js
│   ├── src/
│   │   ├── app/           # Páginas (App Router)
│   │   ├── components/    # Componentes React
│   │   ├── contexts/      # Contextos React
│   │   └── lib/          # Utilitários
└── docker-compose.yml     # Configuração Docker
```

## 🔧 Scripts Disponíveis

### Backend
- `npm run dev` - Execução em desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Execução em produção
- `npm run db:migrate` - Executar migrações
- `npm run db:seed` - Popular banco de dados

### Frontend
- `npm run dev` - Execução em desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Execução em produção

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Funcionários
- `GET /api/employees` - Listar funcionários
- `GET /api/employees/:id` - Buscar funcionário
- `POST /api/employees` - Criar funcionário
- `PUT /api/employees/:id` - Atualizar funcionário
- `DELETE /api/employees/:id` - Deletar funcionário
- `GET /api/employees/stats/dashboard` - Estatísticas

### Documentos
- `GET /api/documents/employee/:id` - Documentos do funcionário
- `POST /api/documents/upload` - Upload de documento
- `GET /api/documents/:id/download` - Download de documento
- `DELETE /api/documents/:id` - Deletar documento

## 🔒 Segurança

- Autenticação JWT
- Hash de senhas com bcrypt
- Validação de dados com Zod
- CORS configurado
- Upload de arquivos com validação de tipo

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop
- Tablet
- Mobile

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas, entre em contato através do email: suporte@docgestor.com

