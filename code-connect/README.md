# Code Connect — Monorepo (pnpm workspaces)

Monorepo com **dois apps** dentro de `apps/`, gerados via `npx` e gerenciados por **pnpm workspaces** a partir da raiz.

## 📁 Estrutura

```
code-connect/                      ← raiz do monorepo
├── package.json                   ← atalhos (scripts) do workspace
├── pnpm-workspace.yaml            ← declara os pacotes (apps/*)
├── pnpm-lock.yaml                 ← lockfile do pnpm
├── .npmrc                         ← config do pnpm (node-linker=hoisted)
├── .gitignore
├── readme.txt                     ← versão texto deste README
├── README.md                      ← este arquivo
└── apps/
    ├── web/                       ← @code-connect/web (Vite + React + TS)
    │   ├── package.json
    │   ├── index.html
    │   ├── vite.config.ts
    │   ├── tsconfig*.json
    │   ├── src/
    │   └── public/
    └── api/                       ← @code-connect/api (NestJS)
        ├── package.json
        ├── nest-cli.json
        ├── tsconfig*.json
        ├── src/
        └── test/
```

## 🚀 Atalhos (executar sempre a partir da raiz)

| Comando          | O que faz                                                         |
| ---------------- | ----------------------------------------------------------------- |
| `pnpm dev`       | Sobe **web** e **api** em paralelo (`pnpm -r --parallel run dev`) |
| `pnpm dev:web`   | Roda só o Vite (`apps/web`)                                       |
| `pnpm dev:api`   | Roda o NestJS com `--watch` (`apps/api`)                          |
| `pnpm build`     | Build dos dois apps (`pnpm -r run build`)                         |
| `pnpm build:web` | Build só do web (`vite build`)                                    |
| `pnpm build:api` | Build só da api (`nest build`)                                    |
| `pnpm start:api` | Roda a API em produção (`node dist/main`) — requer `build` prévio |

## ▶️ Como rodar do zero (em outra máquina)

1. Ter **Node.js** e **pnpm** instalados.
2. Na raiz do projeto:
   ```bash
   pnpm install
   ```
3. Para desenvolvimento:
   ```bash
   pnpm dev          # sobe web e api juntos
   ```
   Ou individualmente:
   ```bash
   pnpm dev:web      # Vite → http://localhost:5173
   pnpm dev:api      # NestJS → http://localhost:3000
   ```
4. Para buildar:
   ```bash
   pnpm build
   ```
5. Para rodar a API em modo produção (após o build):
   ```bash
   pnpm start:api
   ```

## 📝 Decisões do projeto (definidas em `prompt-projeto.txt`)

- **Gerenciador de pacotes:** pnpm (workspaces)
- **App React:** Vite + React + TypeScript (template `react-ts`)
- **App backend:** NestJS (gerado via `@nestjs/cli`)
- **Execução em paralelo:** `pnpm -r --parallel run dev`
- **Nomes internos:** `@code-connect/web` e `@code-connect/api`
- **Frontend:** Atomic Design + Tailwind + testes em cada componente
- **Backend:** aderente aos princípios REST
- **Git:** [Conventional Commits](https://www.conventionalcommits.org/) enforced via `commitlint` + `husky`

## 🔀 Conventional Commits (Bloco 1)

Todos os commits **devem** seguir o padrão **Conventional Commits**. O fluxo é:

- Hook `commit-msg` (Husky) valida a mensagem via `commitlint`/`@commitlint/config-conventional`.
- Hook `pre-commit` roda `lint-staged` (oxlint no web, eslint+prettier na api, prettier nos `.md`/`.json` da raiz).

Tipos válidos: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`, `style`, `revert`.

Exemplos:

```text
feat(api): add users module with CRUD endpoints
fix(web): correct Card hover state on dark mode
docs: document conventional commits workflow
chore(root): add husky and commitlint tooling
```

Em outro clone, basta `pnpm install` — o script `prepare` da raiz ativa os hooks automaticamente.

## 🔧 Ajustes feitos após o scaffold

- `apps/web/package.json` → `name = "@code-connect/web"`
- `apps/api/package.json` → `name = "@code-connect/api"`
- `apps/api/package.json` → adicionado `"dev": "nest start --watch"` (o scaffold do Nest só traz `start:dev`; o `pnpm dev` percorre workspaces procurando o script `dev`, então sem isso a API é silenciosamente ignorada)
- `pnpm-workspace.yaml` inclui:

  ```yaml
  onlyBuiltDependencies:
    - unrs-resolver
  ```

  Necessário para o **pnpm 11** não bloquear o `postinstall`.

- `.npmrc`:
  ```ini
  node-linker=hoisted
  strict-peer-dependencies=false
  ```
  > ⚠️ As chaves `node-linker` e `strict-peer-dependencies` são do **pnpm**; ao usar `npx` (que cai no **npm**) podem aparecer `npm warn` inofensivos.

## ✅ Verificações realizadas

- `pnpm install` (raiz) — dependências do monorepo instaladas corretamente
- `pnpm --filter @code-connect/web run test` — 6 arquivos, 10 testes aprovados
- `pnpm --filter @code-connect/web run build` — build do frontend concluído com sucesso
- `pnpm build` — build geral validado conforme estrutura do workspace
- `curl http://localhost:3000/posts` — API respondendo com dados reais do SQLite
- `curl -X POST http://localhost:3000/auth/login` — autenticação JWT validada em runtime
- integração do fluxo de login no frontend com layout renovado conforme mockup fornecido

## 📌 Status atual do projeto

Validação final executada em 2026-08-24:

- monorepo está estável com `pnpm` workspaces
- frontend e API rodando com scripts de desenvolvimento e build
- testes do web concluídos com sucesso
- build do web concluído com sucesso
- autenticação JWT validada
- feed, filtros, paginação e layout de login funcionando em runtime

O repositório já está em um estado de MVP funcional e bem próximo de uma entrega de demo/portfolio. O que foi entregue:

- monorepo com workspaces pnpm
- apps `web` e `api` configurados
- scripts root para desenvolvimento e build
- hooks de Git + Conventional Commits
- frontend React + Vite + TypeScript
- estrutura de componentes em Atomic Design
- API NestJS com módulo de posts e autenticação JWT
- persistência real em SQLite + TypeORM
- seed inicial de usuário demo e posts de exemplo
- perfil autenticado em `GET /auth/me`
- restrição de edição e remoção de posts ao autor autenticado
- frontend integrado com a API para autenticação, listagem, criação, edição e remoção
- redesign da tela de login seguindo o mockup fornecido, com banner lateral, layout em dark neon e reutilização do componente de autenticação para evolução futura

Funcionalidades implementadas:

- `POST /auth/register` — cria usuário e devolve token JWT
- `POST /auth/login` — autentica usuário e devolve token JWT
- `GET /auth/me` — retorna perfil do usuário autenticado
- `GET /posts` — lista publicações com paginação e filtros
- `GET /posts/:id` — retorna publicação individual
- `POST /posts` — cria publicação autenticada
- `PATCH /posts/:id` — atualiza publicação apenas pelo autor
- `DELETE /posts/:id` — remove publicação apenas pelo autor
- página inicial do frontend com login, feed, composição, edição e exclusão de posts
- componentes reutilizáveis para autenticação e futuro cadastro

### O que foi melhorado nesta fase

- UX do login alinhada com o layout visual solicitado
- estrutura da autenticação pronta para reutilização em cadastro futuramente
- acessibilidade e clareza dos componentes de formulário e botões
- testes de UI ajustados para refletir o novo fluxo de login-first

### Pendências reais do projeto

- tela de cadastro completa com layout específico e campos próprios
- perfis de usuário mais ricos e permissões por papel
- testes e2e do fluxo completo
- configuração de deploy e ambientes para produção

## 🧭 Checklist priorizada do projeto

### Fase 1 — base estável

- [x] ajustar e validar a configuração do workspace pnpm
- [x] rodar install/build/test sem bloqueios de policy
- [x] confirmar hooks e lint-staged funcionando

### Fase 2 — backend funcional

- [x] definir recursos e domínio da aplicação
- [x] construir módulos REST por recurso
- [x] aplicar DTOs e pipes de validação
- [x] implementar testes da API e do frontend

### Fase 3 — frontend funcional

- [x] criar páginas e fluxos do domínio
- [x] manter componentes em Atomic Design
- [x] testar componentes essenciais
- [x] integrar com a API
- [x] redesign da tela de login conforme mockup

### Fase 4 — release

- [x] validar build e testes finais
- [x] atualizar documentação operacional
- [ ] preparar cadastro e release notes finais
- [ ] configurar deploy e ambiente de produção

## 💡 Notas

- Os apps compartilham o `node_modules` **hoisted** na raiz; não há
  `node_modules` dentro de `apps/web` ou `apps/api` (gerenciado pelo pnpm).
- Para adicionar novos pacotes a um app:
  ```bash
  pnpm --filter @code-connect/web add <pacote>
  pnpm --filter @code-connect/api add <pacote>
  ```
