# Doc-Gestor RH - Sistema de Gestão de Documentos e RH

Este pacote contém o sistema completo de Gestão de RH, com Frontend (Next.js) e Backend (Flask/SQLite).

## Status do Projeto (Pronto para Apresentação Urgente)

Todos os problemas críticos de roteamento e build do Next.js foram resolvidos. O sistema está funcional, com a distinção de acesso entre Administrador e Usuário Comum, e as funcionalidades principais implementadas (mesmo que com dados simulados no frontend para garantir botões funcionais).

**Backend:** Flask (Python) com SQLite (para evitar problemas de Docker/PostgreSQL).
**Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS.

---

## 1. Instruções de Inicialização (Para Apresentação)

Siga os passos abaixo para iniciar o Frontend e o Backend em seu ambiente local.

### 1.1. Inicializar o Backend (API)

1.  Acesse a pasta do backend:
    ```bash
    cd doc-gestor-rh/backend
    ```
2.  Instale as dependências Python:
    ```bash
    pip install -r requirements.txt
    ```
    *(O arquivo `requirements.txt` será gerado automaticamente no empacotamento. Se não existir, use `pip install flask flask-sqlalchemy flask-cors python-dotenv gunicorn pyjwt`)*
3.  Inicie o servidor da API (ele usará a porta **5001** e o banco de dados **SQLite**):
    ```bash
    gunicorn -w 4 -b 0.0.0.0:5001 app:app
    ```
    *A API estará rodando em `http://localhost:5001`.*

### 1.2. Inicializar o Frontend (Next.js)

1.  Acesse a pasta do frontend:
    ```bash
    cd doc-gestor-rh/frontend
    ```
2.  Instale as dependências Node.js:
    ```bash
    pnpm install
    ```
3.  Inicie o servidor do Frontend:
    ```bash
    pnpm run dev
    ```
    *O Frontend estará rodando em `http://localhost:3000`.*

---

## 2. Acesso ao Sistema

O sistema foi configurado com um **Login Simplificado** para agilizar a apresentação.

1.  Abra o navegador em `http://localhost:3000/login`.
2.  Clique em um dos botões para entrar:
    *   **"Entrar como Administrador"**: Acesso completo, Sidebar com todas as opções, aprovação de férias, gestão de funcionários.
    *   **"Entrar como Usuário Comum"**: Acesso restrito ao Dashboard pessoal, "Meus Documentos" e "Solicitar Férias".

---

## 3. Funcionalidades Implementadas

| Funcionalidade | Status | Detalhes |
| :--- | :--- | :--- |
| **Roteamento e Build** | ✅ Resolvido | Problemas de 404 e erro `useAuth` corrigidos. |
| **Login e Autenticação** | ✅ Simplificado | Login simulado no frontend para agilidade. Distinção Admin/Usuário por botões. |
| **Gestão de Funcionários** | ✅ Funcional | Listagem e formulário "Adicionar Novo" funcionando (grava no SQLite). |
| **Gestão de Férias (Admin)** | ✅ Completo | Abas de "Solicitações" (aprovar/rejeitar) e **"Calendário"** (visão de férias). |
| **Gestão de Férias (Usuário)** | ✅ Completo | Página **"Solicitar Férias"** com validações CLT (3 períodos, abono pecuniário). |
| **Gestão de Documentos** | ✅ Funcional | Página "Meus Documentos" com upload (simulado) e campo "Tipo de Documento". |
| **Layout e UX** | ✅ Completo | Sidebar restaurada, botões com ícones e distinção visual Admin/Usuário. |
| **Contratos e Relatórios** | ✅ Criado | Páginas criadas com interface profissional (dados simulados). |

