# Rotalog

## Visão Geral

Sistema de gestão de frotas e entregas, composto por três APIs, um frontend Nx e um repositório de infraestrutura local. Os projetos são independentes e compartilham o PostgreSQL provisionado por `rotalog-workspace`.

## Regras Gerais

- Preserve os limites entre os repositórios; alterações cross-repository devem ser coordenadas pelo contrato da API ou pelos scripts de banco.
- Consulte o README e o `CLAUDE.md` do projeto antes de alterar código.
- Não altere migrations ou seeds existentes para corrigir dados locais sem avaliar o impacto nos demais serviços.
- Use os comandos e versões definidos no projeto; não introduza novas dependências sem necessidade.

## Repositórios

### rotalog-api-frotas (Java 11 / Spring Boot 2.7.18)

- Responsabilidade: pedidos, roteamentos e tracking.
- Banco: PostgreSQL.
- Migrations: Flyway.
- Estrutura: `controller -> service -> repository`.
- Entidades JPA em `model`.

### rotalog-api-entregas (Node.js / Express)

- Responsabilidade: entregas, rotas e rastreamento.
- Banco: PostgreSQL, schema `entregas`.
- Persistência: Sequelize.
- Estrutura: `routes -> services -> models`.
- Entrada: `src/index.js`; porta padrão: `3000`.

### rotalog-api-notificacoes (.NET 6)

- Responsabilidade: notificações transacionais por email e SMS e histórico de envios.
- Banco: PostgreSQL, schema `notificacoes`.
- Persistência: Entity Framework Core; handlers com MediatR.
- Entrada: `Program.cs`; porta padrão: `5000`.

### rotalog-frontend (Nx)

- Responsabilidade: painel administrativo e rastreamento.
- Projetos: `painel-admin` e `rastreamento`.
- Siga as instruções Nx em `rotalog-frontend/CLAUDE.md`.

### rotalog-workspace (Infraestrutura local)

- Responsabilidade: Docker Compose, schemas, migrations e seeds compartilhados.
- Banco: PostgreSQL 14.
- Scripts SQL em `tools/scripts/`.
- As APIs e frontends são iniciados separadamente.