# 🚀 Deploy na Vercel - Doc-Gestor RH

## 📋 Pré-requisitos

1. **Conta na Vercel** - [vercel.com](https://vercel.com)
2. **Banco PostgreSQL** - Recomendado: [Neon](https://neon.tech) ou [Supabase](https://supabase.com)
3. **Repositório Git** - GitHub, GitLab ou Bitbucket

## 🗄️ 1. Configurar Banco de Dados

### Opção A: Neon (Recomendado)
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta e um novo projeto
3. Copie a `DATABASE_URL` fornecida

### Opção B: Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings > Database
4. Copie a Connection String (URI)

## 🔧 2. Deploy do Backend

### 2.1 Preparar o Backend
```bash
cd backend
npm install
npx prisma generate
```

### 2.2 Deploy na Vercel
1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em "New Project"
3. Importe o repositório
4. Configure as variáveis de ambiente:

**Environment Variables:**
```
DATABASE_URL=sua_database_url_aqui
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
NODE_ENV=production
```

### 2.3 Configurações do Projeto
- **Framework Preset:** Other
- **Root Directory:** `backend`
- **Build Command:** `npm run vercel-build`
- **Output Directory:** `dist`

## 🎨 3. Deploy do Frontend

### 3.1 Preparar o Frontend
```bash
cd frontend
npm install
npm run build
```

### 3.2 Deploy na Vercel
1. Crie um novo projeto na Vercel
2. Importe o repositório
3. Configure as variáveis de ambiente:

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app
NODE_ENV=production
```

### 3.3 Configurações do Projeto
- **Framework Preset:** Next.js
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

## 🗃️ 4. Configurar Banco de Dados

### 4.1 Executar Migrações
Após o deploy do backend, execute:

```bash
# Via Vercel CLI (recomendado)
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

### 4.2 Ou via Interface Web
1. Acesse o painel do seu provedor de banco
2. Execute o SQL das migrações manualmente
3. Execute o script de seed

## 🔗 5. URLs Finais

Após o deploy, você terá:
- **Frontend:** `https://seu-frontend.vercel.app`
- **Backend:** `https://seu-backend.vercel.app`

## 🔐 6. Credenciais de Teste

**Administrador:**
- Email: `admin@docgestor.com`
- Senha: `admin123`

**Usuário:**
- Email: `user@docgestor.com`
- Senha: `user123`

## 🛠️ 7. Comandos Úteis

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Deploy manual
vercel --prod

# Ver logs
vercel logs

# Configurar domínio personalizado
vercel domains add seudominio.com
```

## 🔄 8. Atualizações Automáticas

O projeto está configurado para deploy automático:
- **Push na branch main** → Deploy automático
- **Pull Request** → Preview deploy
- **Merge** → Deploy em produção

## 📞 9. Suporte

Em caso de problemas:
1. Verifique os logs na Vercel
2. Confirme as variáveis de ambiente
3. Teste a conexão com o banco
4. Verifique as configurações de CORS

## ✅ 10. Checklist Final

- [ ] Banco de dados configurado
- [ ] Backend deployado na Vercel
- [ ] Frontend deployado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações executadas
- [ ] Seed executado
- [ ] Teste de login funcionando
- [ ] Upload de documentos funcionando
- [ ] Todas as funcionalidades testadas

🎉 **Parabéns! Seu sistema Doc-Gestor RH está no ar!**

