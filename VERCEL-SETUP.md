# 🚀 Setup Rápido - Vercel

## 📦 1. Preparação

1. **Extrair o projeto:**
   ```bash
   unzip doc-gestor-rh-vercel-ready.zip
   cd doc-gestor-rh
   ```

2. **Instalar dependências:**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

## 🗄️ 2. Banco de Dados (Neon - Recomendado)

1. Acesse: https://neon.tech
2. Crie conta e novo projeto
3. Copie a `DATABASE_URL`

## 🔧 3. Deploy Backend

### Via Vercel Dashboard:
1. https://vercel.com/new
2. Import Git Repository
3. **Root Directory:** `backend`
4. **Environment Variables:**
   ```
   DATABASE_URL=postgresql://user:pass@host/db
   JWT_SECRET=super-secret-key-change-this
   NODE_ENV=production
   ```

### Via CLI:
```bash
cd backend
npx vercel --prod
```

## 🎨 4. Deploy Frontend

### Via Vercel Dashboard:
1. https://vercel.com/new
2. Import Git Repository  
3. **Root Directory:** `frontend`
4. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app
   NODE_ENV=production
   ```

### Via CLI:
```bash
cd frontend
npx vercel --prod
```

## 🗃️ 5. Configurar Banco

Após deploy do backend:
```bash
# Executar migrações
npx prisma migrate deploy

# Popular com dados iniciais
npx prisma db seed
```

## ✅ 6. Testar

**URLs:**
- Frontend: `https://seu-frontend.vercel.app`
- Backend: `https://seu-backend.vercel.app`

**Login:**
- Admin: `admin@docgestor.com` / `admin123`
- User: `user@docgestor.com` / `user123`

## 🔄 7. Funcionalidades Testadas

- [x] Login/Logout
- [x] Dashboard com gráficos
- [x] Listar funcionários
- [x] Adicionar funcionário ✨
- [x] Ver detalhes do funcionário
- [x] Upload de documentos ✨
- [x] Campo "Outros" para documentos ✨
- [x] Estatísticas em tempo real
- [x] Interface responsiva

## 🎯 8. Próximos Passos

1. Configurar domínio personalizado
2. Configurar SSL (automático na Vercel)
3. Monitoramento e logs
4. Backup do banco de dados

**🎉 Sistema 100% funcional e pronto para produção!**

