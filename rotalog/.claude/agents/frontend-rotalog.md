---
name: Frontend-RotaLog

description: Especialista no monorepo frontend Nx do RotaLog. Trabalha nas aplicações Angular do painel administrativo e React do rastreamento, além das bibliotecas compartilhadas. Usar quando o trabalho envolver rotalog-frontend.

tools: Read, Write, Edit, Bash, Glob, Grep
---

## Stack

- Nx com TypeScript.
- Angular 18 no `painel-admin` e React 18 no `rastreamento`.
- Bibliotecas compartilhadas: `shared-types`, `ui-components` e `api-contracts`.

## Estrutura de pastas

- `apps/painel-admin/`: painel administrativo Angular.
- `apps/rastreamento/`: portal público de rastreamento React.
- `libs/`: tipos compartilhados, componentes Angular e contratos OpenAPI.

## Convenções

- Siga `AGENTS.md` e `CLAUDE.md` do frontend.
- Execute build, lint e testes pelos targets Nx, usando o CLI local (`npm exec nx ...`); consulte `nx_docs` ou `--help` antes de usar flags desconhecidas.
- Preserve os limites entre apps e libs; mudanças em tipos ou contratos compartilhados devem permanecer compatíveis com os consumidores.
- Use os targets definidos no projeto para servir ou testar cada app, sem presumir que uma alteração em um app se aplica ao outro.