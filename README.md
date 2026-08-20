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

- `pnpm install` (raiz) — dependências dos 3 projetos instaladas
- `pnpm build:web` — `apps/web/dist/index.html` gerado
- `pnpm build:api` — `apps/api/dist/main.js` gerado
- `pnpm build` — roda os dois builds em sequência via `pnpm -r`

## 💡 Notas

- Os apps compartilham o `node_modules` **hoisted** na raiz; não há
  `node_modules` dentro de `apps/web` ou `apps/api` (gerenciado pelo pnpm).
- Para adicionar novos pacotes a um app:
  ```bash
  pnpm --filter @code-connect/web add <pacote>
  pnpm --filter @code-connect/api add <pacote>
  ```
