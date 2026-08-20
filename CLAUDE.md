# CLAUDE.md

Guia para o Claude Code trabalhar no monorepo **code-connect**.

## Visao geral

Monorepo **pnpm workspaces** com dois apps independentes:

- **`apps/web`** — `@code-connect/web` (Vite + React + TypeScript)
  - Scaffold: `react-ts`
  - Entrada: `apps/web/src/`
  - Dev: porta `5173`
  - Lint: `.oxlintrc.json` (oxlint)
- **`apps/api`** — `@code-connect/api` (NestJS + TypeScript)
  - Scaffold: `@nestjs/cli`
  - Entrada: `apps/api/src/`
  - Dev: porta `3000`
  - Lint: `eslint.config.mjs`, formatter: `.prettierrc`

Os apps **compartilham `node_modules` hoisted** na raiz (configurado via `.npmrc`); nao ha `node_modules` dentro de cada `apps/*`.

## Stack & ferramentas

- **Package manager:** `pnpm@11.20.0` (fixado em `package.json#packageManager`)
- **Linker:** `hoisted` (`.npmrc`) — necessario p/ Vite/Nest encontrarem deps
- **Lockfile:** `pnpm-lock.yaml` (commitado, garante instalacoes consistentes)
- **pnpm 11 allowlist:** `pnpm-workspace.yaml` libera `unrs-resolver` no postinstall

## Comandos (sempre a partir da raiz)

| Comando            | O que faz                                                          |
| ------------------ | ------------------------------------------------------------------ |
| `pnpm install`     | Instala deps dos 2 apps (hoisted na raiz)                          |
| `pnpm dev`         | Sobe web e api em paralelo                                         |
| `pnpm dev:web`     | Sobe so o Vite (5173)                                              |
| `pnpm dev:api`     | Sobe so o NestJS com `--watch` (3000)                              |
| `pnpm build`       | Build dos dois apps                                                |
| `pnpm build:web`   | Build so do web → `apps/web/dist/`                                 |
| `pnpm build:api`   | Build so da api → `apps/api/dist/main.js`                          |
| `pnpm start:api`   | Roda API em prod (requer `build:api` previo)                       |
| `pnpm lint`        | Roda lint do web e da api em sequencia                             |
| `pnpm lint:web`    | So `oxlint` em `apps/web`                                          |
| `pnpm lint:api`    | `eslint --fix` em `apps/api` (ESLint + Prettier)                   |
| `pnpm test`        | Roda testes Jest da api (web ainda sem suite)                      |
| `pnpm lint-staged` | Roda `lint-staged` manualmente (mesmo config do hook `pre-commit`) |

Adicionar pacote em um app especifico:

```bash
# dependencia normal
pnpm --filter @code-connect/web add <pacote>
pnpm --filter @code-connect/api add <pacote>

# devDependency (use -D)
pnpm --filter @code-connect/web add -D <pacote>
pnpm --filter @code-connect/api add -D <pacote>

# remover
pnpm --filter @code-connect/web remove <pacote>

# comando puntual dentro de um app
pnpm --filter @code-connect/api exec <comando>
```

Outros comandos uteis do dia-a-dia:

```bash
# atualizar lockfile (dentro dos limites dos ranges do package.json)
pnpm update

# auditoria de deps
pnpm audit

# rodar um unico teste da api por nome
pnpm --filter @code-connect/api test -- users.service

# shell/lista de workspaces reconhecidos
pnpm -r list
pnpm why <pacote>
```

## Estrutura

```
code-connect/
├── package.json                # scripts do workspace
├── pnpm-workspace.yaml         # packages: ["apps/*"]
├── pnpm-lock.yaml
├── .npmrc                      # node-linker=hoisted, strict-peer-dependencies=false
├── .gitignore
├── CLAUDE.md                   # este arquivo
├── README.md
└── apps/
    ├── web/                    # @code-connect/web
    │   ├── package.json
    │   ├── index.html
    │   ├── vite.config.ts
    │   ├── tsconfig*.json
    │   ├── src/
    │   └── public/
    └── api/                    # @code-connect/api
        ├── package.json
        ├── nest-cli.json
        ├── tsconfig*.json
        ├── src/
        └── test/
```

## Decisoes & convencoes

- **Nomes internos** ja ajustados (`@code-connect/web`, `@code-connect/api`)
- A API tem `dev: "nest start --watch"` no `package.json` (o `pnpm dev` percorre
  workspaces procurando o script `dev` — sem isso a API e silenciosamente ignorada).
  O `start:dev` original do Nest foi preservado ao lado do alias.
- Execucao em paralelo: sempre `pnpm -r --parallel run dev`
- `package-lock.json` e `yarn.lock` estao **ignorados** no `.gitignore`
- **Stack travada em versoes recentes:** web usa `vite ^8`, `react ^19.2`,
  `typescript ~6.0`; api usa `nest ^11`, `jest ^30`. Nao pinar major sem
  discutir — sempre confiar no `pnpm-lock.yaml`.
- **Tipo de modulo do web:** `"type": "module"` (ESM). Importacoes usam `.ts`
  nos caminhos de fonte; o build e o Vite resolvem.

## Onde tocar para cada tipo de mudanca

- **Frontend (UI, componentes, rotas):** `apps/web/src/`
- **API (controllers, services, modules):** `apps/api/src/`
- **Testes da API (unit):** `apps/api/src/**/*.spec.ts` (jest, `rootDir: src`)
- **Testes e2e da API:** `apps/api/test/` (`jest --config ./test/jest-e2e.json`)
- **Config global do monorepo:** raiz (`package.json`, `pnpm-workspace.yaml`, `.npmrc`, `.gitignore`)
- **Lint/format por app:** dentro de cada `apps/<app>/` (web → `.oxlintrc.json`; api → `eslint.config.mjs` + `.prettierrc`)

## Convencoes de codigo

### Conventional Commits (ambos os apps)

- **Padrao:** [Conventional Commits](https://www.conventionalcommits.org/) — `tipo(escopo opcional): descricao`.
- **Tipos permitidos:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`, `style`, `revert`.
- **Validacao automatica:** `commitlint` + `@commitlint/config-conventional`, rodado pelo hook `commit-msg` do Husky. Mensagens fora do padrao **bloqueiam** o commit.
- **Lint no staged:** hook `pre-commit` chama `lint-staged`, que aplica:
  - `apps/web/src/**/*.{ts,tsx}` → `oxlint` no web
  - `apps/api/src/**/*.ts` e `apps/api/test/**/*.ts` → `eslint --fix` (ESLint + Prettier) na api
  - `*.{md,json}` na raiz → `prettier --write`
- **Ativacao em outro clone:** basta `pnpm install` — o script `prepare` da raiz (`"prepare": "husky"`) instala e ativa os hooks.
- **Arquivos chave:** `commitlint.config.cjs`, `.husky/commit-msg`, `.husky/pre-commit`, bloco `lint-staged` em `package.json` raiz.
- **Exemplos validos:**
  - `feat(api): add users module with CRUD endpoints`
  - `fix(web): correct Card hover state on dark mode`
  - `docs: document conventional commits workflow`
  - `chore(root): add husky and commitlint tooling`

### `apps/web` (Vite + React + TS)

- Componentes funcionais; sem class components.
- Estilo de imports segue o que o Vite ja configurou; em duvida, ver arquivos existentes em `apps/web/src/`.
- Build checa tipos: `pnpm --filter @code-connect/web build` = `tsc -b && vite build`. Erros de tipo quebram o build — nao ignorar com `// @ts-ignore` sem justificativa.
- Nao adicionar novo bundler/framework sem alinhamento previo.

### `apps/api` (NestJS)

- Estrutura por **modulos** (`module/controller/service`). Um modulo por dominio.
- DTOs validam entrada (`class-validator` + `class-transformer`) — adicionar quando entrar `ValidationPipe`.
- Testes unit ao lado do fonte: `users.service.spec.ts` ao lado de `users.service.ts`.
- Cobertura coletada em `coverage/` (ja no `.gitignore`).
- ESLint ja tem `eslint-config-prettier` + `eslint-plugin-prettier` — nao duelar prettier vs eslint.

## Git & fluxo de trabalho

- **Convencao de mensagens:** Conventional Commits enforced via Husky + commitlint (ver secao acima). Mensagens fora do padrao sao rejeitadas pelo hook `commit-msg`.
- **Nunca** rodar `git commit`, `git push`, `git reset --hard`, `git clean`,
  `git checkout` para trocar branch, `git stash drop` etc. sem pedir aprovacao.
- Mudancas em working tree: preferir `git status` + `git diff` antes de propor
  qualquer `git add`/`git commit`.
- `pnpm-lock.yaml` **deve** ser commitado sempre que alterado (`.gitignore`
  so ignora `package-lock.json` e `yarn.lock`).
- Ao adicionar dep nova, commitar em **um unico commit** (ou explicitamente
  separado) junto de `pnpm-lock.yaml` — nunca um sem o outro.

## Segredos / env

- `.env`, `.env.*`, `.env.local*` ja estao **ignorados** pelo `.gitignore`.
- `.env.example` **e** commitavel — usar como gabarito semantico.
- Cada app pode ter o proprio `.env` em `apps/web/.env` ou `apps/api/.env`.
  Nao centralizar na raiz a menos que combinado.
- Nunca imprimir, logar ou commitar valores de `.env`. Em logs/diffs,
  preferir `process.env.X` como placeholder.

## Troubleshooting

- **Porta ocupada (5173 web / 3000 api):** `Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess` (Windows) ou `lsof -i :5173` (Unix) → matar o PID.
- **Cache de Vite stale:** limpar `apps/web/node_modules/.vite` (e `.vite-temp`) e reiniciar `pnpm dev:web`.
- **Cache do Nest/TS:** limpar `apps/api/dist` e `*.tsbuildinfo`; reinstalar se persistir (`pnpm install`).
- **`pnpm install` quebrando por peer dep:** checar `.npmrc` (`strict-peer-dependencies=false` ja esta ligado). Se faltar, **nao** adicionar `--force` globalmente — corrigir no `package.json` daquele workspace.
- **`npm warn` sobre `node-linker`/`strict-peer-dependencies`:** vem de usar `npx` (npm). E ruido inofensivo — ignorar.
- **pnpm 11 bloqueando postinstall:** confirmar `pnpm-workspace.yaml` tem `onlyBuiltDependencies: [unrs-resolver]`. Sem isso, o `pnpm install` recusa rodar scripts de build de pacotes.
- **API "nao sobe" no `pnpm dev`:** conferir se `apps/api/package.json` ainda tem o script `dev`. Se faltar, restaurar: `"dev": "nest start --watch"`. O `pnpm -r --parallel run dev` percorre os workspaces procurando `dev` — se nao ha, o app e silenciosamente ignorado.
- **`Module not found` no Vite** apos renomear/mover arquivos: o HMR pode estar em cache; parar e reiniciar `pnpm dev:web`.

## Verificacoes conhecidas (ja realizadas)

- `pnpm install` — deps dos 2 apps instaladas (hoisted em `node_modules/` na raiz)
- `pnpm build:web` — gera `apps/web/dist/index.html` + `apps/web/dist/assets/`
- `pnpm build:api` — gera `apps/api/dist/main.js`
- `pnpm build` — roda os dois builds via `pnpm -r`
- `commitlint` validado localmente: mensagem fora do padrao e rejeitada (exit 1), mensagem conventional passa sem erros

## Notas / pegadinhas

- Ao usar `npx` (que cai no **npm**, nao pnpm), podem aparecer `npm warn`
  inofensivos sobre `node-linker`/`strict-peer-dependencies` — ignorar.
- Pastas `dist/`, `build/`, `.next/`, `.vite/`, `.cache/`, `.nest/`, `dist-ssr`
  sao ignoradas pelo `.gitignore`.
- `.vscode/*` e ignorado, exceto `extensions.json`, `settings.json`, `tasks.json`, `launch.json`.
- **Scripts `dev` x `start:dev` na API:** coexistem. `pnpm dev` (raiz) usa o
  alias `dev`; `pnpm --filter @code-connect/api start:dev` funciona igual.
