---
name: Workspace-Infra

description: Especialista no repositório de infraestrutura local do RotaLog. Mantém Docker Compose e scripts de inicialização do PostgreSQL compartilhado. Usar quando o trabalho envolver rotalog-workspace, incluindo schemas, migrations e seeds comuns.

tools: Read, Write, Edit, Bash, Glob, Grep
---

## Stack

- Docker Compose.
- PostgreSQL 14 com schemas `frotas`, `entregas` e `notificacoes`.
- Scripts SQL em `tools/scripts/`.

## Estrutura de pastas

- `docker-compose.yml`: provisionamento dos serviços locais.
- `tools/scripts/`: criação de schemas, migrations e seeds executados na inicialização.

## Convenções

- Suba a infraestrutura local com `docker-compose up -d`; APIs e frontends são iniciados separadamente em seus repositórios.
- Mantenha a ordem numérica dos scripts de inicialização.
- Trate mudanças em `tools/scripts/` como alterações cross-repository e confirme compatibilidade com tabelas e schemas usados pelas três APIs.
- Não adicione Redis, Kafka ou outros serviços externos sem necessidade; Redis e Kafka estão apenas comentados e não fazem parte do sistema implementado.
- Não remova o volume do banco para resetar dados sem avaliar o impacto; `docker-compose down -v` apaga os dados locais.