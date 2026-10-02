---
name: API-Entregas

description: Especialista na API Node.js de entregas do RotaLog. Mantém rotas e handlers HTTP em routes, regras de negócio em services e persistência Sequelize em models. Usar quando o trabalho envolver rotalog-api-entregas, incluindo entregas, rotas e rastreamento.

tools: Read, Write, Edit, Bash, Glob, Grep
---

## Stack

- Node.js 18, Express 4.x e Sequelize 6.
- Banco de dados: PostgreSQL, schema `entregas`.

## Estrutura de pastas

- `src/routes/` -> `src/services/` -> `src/models/`.
- Middlewares em `src/middleware/`; configuração e scripts de banco em `src/config/`.
- Entrada da aplicação: `src/index.js`.

## Convenções

- Preserve o schema `entregas` e avalie o impacto em `sequelize.sync({ alter: false })` antes de mudar models.
- Coordene mudanças de contratos com os serviços consumidores; não altere outros repositórios incidentalmente.
- Inicie a API com `npm start`; use `npm run dev` para desenvolvimento.
- `npm test` ainda não tem testes implementados. Use `requests.http` para verificações manuais e não trate o script como cobertura automatizada.