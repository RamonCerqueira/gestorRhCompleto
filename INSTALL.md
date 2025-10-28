# 📋 Guia de Instalação - Doc-Gestor RH

Este guia fornece instruções detalhadas para instalar e configurar o sistema Doc-Gestor RH.

## 🎯 Opções de Instalação

### Opção 1: Deploy Rápido com Docker (Recomendado)
### Opção 2: Instalação Manual para Desenvolvimento

---

## 🐳 Opção 1: Deploy Rápido com Docker

### Pré-requisitos
- Docker 20.10+
- Docker Compose 2.0+

### Passos

1. **Clone o projeto**
```bash
git clone <url-do-repositorio>
cd doc-gestor-rh
```

2. **Execute o script de deploy**
```bash
./deploy.sh
```

3. **Acesse a aplicação**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Usuários de Teste
- **Admin**: admin@docgestor.com / admin123
- **User**: user@docgestor.com / user123

---

## 🛠️ Opção 2: Instalação Manual

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Configuração do Banco de Dados

#### Instalar PostgreSQL (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Criar banco de dados
```bash
sudo -u postgres psql
CREATE DATABASE docgestor;
CREATE USER docgestor_user WITH PASSWORD 'sua_senha_aqui';
GRANT ALL PRIVILEGES ON DATABASE docgestor TO docgestor_user;
\q
```

### 2. Configuração do Backend

```bash
cd backend
npm install
```

#### Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
DATABASE_URL="postgresql://docgestor_user:sua_senha_aqui@localhost:5432/docgestor?schema=public"
PORT=5000
JWT_SECRET="seu_jwt_secret_super_seguro_aqui"
```

#### Executar migrações e seed
```bash
npx prisma migrate dev
npx prisma db seed
```

### 3. Configuração do Frontend

```bash
cd ../frontend
npm install
```

#### Configurar variáveis de ambiente
```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Executar a Aplicação

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### 5. Acessar a Aplicação
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 🔧 Configurações Avançadas

### Configuração de Produção

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
PORT=5000
JWT_SECRET="jwt_secret_muito_seguro_para_producao"
NODE_ENV=production
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://seu-backend.com/api
```

### Configuração de Upload de Arquivos

O sistema cria automaticamente a pasta `uploads/documents` no backend para armazenar os arquivos enviados.

### Configuração de CORS

Por padrão, o backend aceita requisições de qualquer origem. Para produção, configure o CORS no arquivo `src/index.ts`:

```typescript
app.use(cors({
  origin: ['https://seu-frontend.com'],
  credentials: true
}));
```

---

## 🚀 Deploy em Produção

### Vercel (Frontend)

1. **Conecte seu repositório ao Vercel**
2. **Configure as variáveis de ambiente**:
   - `NEXT_PUBLIC_API_URL`: URL do seu backend

### Digital Ocean / AWS / Heroku (Backend)

1. **Configure as variáveis de ambiente**:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT`

2. **Execute os comandos de build**:
```bash
npm run build
npx prisma migrate deploy
npx prisma db seed
npm start
```

---

## 🔍 Solução de Problemas

### Erro de Conexão com Banco
```
Can't reach database server at localhost:5432
```
**Solução**: Verifique se o PostgreSQL está rodando e as credenciais estão corretas.

### Erro de Prisma Client
```
@prisma/client did not initialize yet
```
**Solução**: Execute `npx prisma generate`

### Erro de CORS
```
Access to fetch blocked by CORS policy
```
**Solução**: Verifique a configuração de CORS no backend e a URL da API no frontend.

### Porta já em uso
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solução**: Mate o processo na porta ou use uma porta diferente:
```bash
# Encontrar processo
lsof -ti:3000
# Matar processo
kill -9 <PID>
```

---

## 📞 Suporte

Se encontrar problemas durante a instalação:

1. Verifique os logs do console
2. Consulte a documentação do README.md
3. Entre em contato: suporte@docgestor.com

---

## ✅ Checklist de Instalação

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL 14+ instalado e rodando
- [ ] Banco de dados criado
- [ ] Dependências do backend instaladas
- [ ] Dependências do frontend instaladas
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações executadas
- [ ] Seed executado
- [ ] Backend rodando na porta 5000
- [ ] Frontend rodando na porta 3000
- [ ] Login funcionando com usuários de teste

