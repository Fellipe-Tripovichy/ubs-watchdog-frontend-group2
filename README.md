# UBS Watchdog - Sistema de Compliance Financeiro

> Monitoramento de transações financeiras com detecção automática de atividades suspeitas

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)](https://ubs-watchdog-frontend-group2.vercel.app/)
[![API](https://img.shields.io/badge/API-Online-green)](http://72.62.141.100:6001/swagger/index.html)
[![Backend](https://img.shields.io/badge/.NET-8.0-512BD4)](https://dotnet.microsoft.com/)
[![Frontend](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)

## 📋 Sobre o Projeto

Sistema completo de compliance financeiro desenvolvido para o **Processo Seletivo Trainee UBS 2026**. Permite registro de clientes e transações, aplicação automática de regras de compliance, geração de alertas e relatórios gerenciais.

### Funcionalidades Principais

- ✅ **Gestão de Clientes**: Cadastro, consulta e atualização de KYC/Nível de Risco
- 💰 **Transações**: Registro de depósitos, saques e transferências
- 🚨 **Compliance Automático**: 
  - Limite diário de movimentação
  - Detecção de países de alto risco
  - Fracionamento (structuring)
- 📊 **Alertas**: Workflow completo (Novo → Em Análise → Resolvido)
- 📈 **Relatórios**: Análise completa por cliente com gráficos

---

## 🏗️ Arquitetura

```
Frontend (Next.js + TypeScript + Tailwind)
         ↓ REST API
Backend (.NET 8 - Clean Architecture)
         ↓
PostgreSQL + EF Core
```

### Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | Next.js 15, React, TypeScript, Tailwind CSS, Redux Toolkit |
| **Backend** | .NET 8, Entity Framework Core, Serilog |
| **Banco** | PostgreSQL |
| **Auth** | Firebase Authentication |
| **Deploy** | Vercel (Front) + VPS (Back) |

---

## 🚀 Como Executar

### Backend (.NET)

```bash
cd UBS.Watchdog.API
dotnet restore
dotnet run
```

**Acesso local**: `http://localhost:5017/swagger`

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

**Acesso local**: `http://localhost:3000`

### Docker (Completo)

```bash
docker-compose up -d
```

- **API**: `http://localhost:6001`
- **PostgreSQL**: `localhost:6000`

---

## 🌐 Links do Projeto

| Recurso | Link |
|---------|------|
| **Frontend (Deploy)** | [https://ubs-watchdog-frontend-group2.vercel.app/](https://ubs-watchdog-frontend-group2.vercel.app/) |
| **API (Swagger)** | [http://72.62.141.100:6001/swagger](http://72.62.141.100:6001/swagger/index.html) |
| **Documentação Completa** | [PDF](./Documentacao_UBS_Watchdog_Grupo2.pdf) |
| **Design System** | [Figma](https://www.figma.com/design/5HeLFhSgztquNfUIVNFKJL/UBS-Frontend-2?node-id=0-1) |
| **Kanban** | [Notion](https://www.notion.so/839510d4e20541d887b8858685538c1f?v=de99277270c844e28a944dc75cf36f81) |

---

## 📦 Estrutura do Projeto

### Backend (Clean Architecture)

```
UBS.Watchdog/
├── Domain/              # Entidades, Value Objects, Enums
├── Application/         # Services, DTOs, Regras de Compliance
├── Infrastructure/      # EF Core, Repositories, Migrations
└── API/                 # Controllers, Program.cs
```

### Frontend (Atomic Design)

```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Rotas Next.js
├── store/              # Redux Toolkit
└── services/           # API calls
```

---

## 🔐 Autenticação

**Usuário de Teste**:
- Email: `teste@ubs.com`
- Senha: `123456`

*A autenticação é feita via Firebase Authentication no frontend.*

---

## 📊 Endpoints Principais

### Clientes
- `GET /api/clientes` - Listar todos
- `POST /api/clientes` - Criar cliente
- `PATCH /api/clientes/{id}/kyc` - Atualizar KYC

### Transações
- `POST /api/transacoes` - Registrar transação (+ validação automática)
- `GET /api/transacoes/clientes/{id}` - Histórico do cliente

### Alertas
- `GET /api/alertas/filtrar` - Filtrar alertas
- `PATCH /api/alertas/{id}/resolver` - Resolver alerta

### Relatórios
- `GET /api/relatorios/cliente/{id}` - Relatório completo

*Documentação completa no [Swagger](http://72.62.141.100:6001/swagger/index.html)*

---

## 🧪 Testes

### Backend
```bash
cd UBS.Watchdog.Tests
dotnet test
```

- Testes de integração com XUnit
- Cobertura: 80%+

### Frontend
```bash
npm run test
```

- Testes unitários e de componentes
- Validação obrigatória no PR

---

## 👥 Equipe - Grupo 2

| Nome | Responsabilidade | GitHub |
|------|------------------|--------|
| **Gabriel Candido Santana** | Líder da Equipe | [@GabrielSantana003](https://github.com/GabrielSantana003) |
| **João Rudge** | Líder de Back-end | [@RudgeJoao](https://github.com/RudgeJoao) |
| **Fellipe Tripovichy** | Líder de Front-end | [@Fellipe-Tripovichy](https://github.com/Fellipe-Tripovichy) |
| **Maria Eduarda Facio** | Líder de Documentação | [@dudaribeiro7](https://github.com/dudaribeiro7) |
| **Thales Nogueira** | Líder de QA | [@Thalessns](https://github.com/Thalessns) |

---

## 📄 Licença

Projeto desenvolvido para o **Processo Seletivo Trainee UBS 2026**.

---

<p align="center">
  <sub>Desenvolvido com pelos melhores para os melhores</sub>
</p>
