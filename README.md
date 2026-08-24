# Code Connect

## Status atual do projeto

Este workspace ainda está em estado parcial em relação ao que foi definido em `prompt-projeto.txt`.

O que já foi concluído no repositório atual:

- Estrutura de monorepo com `pnpm` e `workspaces`
- App frontend configurado em `apps/web` com Vite + React + TypeScript
- Tailwind integrado
- Estrutura de componentes em atomic design com `atoms`, `molecules`, `templates` e `pages`
- Testes básicos do frontend (`Button`, `Card`, `Home`, `HomeTemplate`)
- Configuração de hooks e documentação inicial em `README.md` e `CLAUDE.md`

O que ainda falta para atender ao prompt:

- Criar o app backend em `apps/api` com NestJS
- Adicionar o script `@code-connect/api` no workspace e os atalhos do root package.json
- Implementar endpoints REST e serviços de domínio
- Adicionar autenticação e autorização
- Persistência com banco real (ex.: SQLite/TypeORM)
- Cobertura de testes da API
- Validar build do backend e subindo `pnpm dev` com web + api em paralelo
- Alinhar documentação final com o estado real do projeto

## Checklist da expectativa do prompt

### Requisitos centrais do prompt

- [x] pnpm workspaces na raiz
- [x] app React com Vite + TypeScript
- [ ] app NestJS em `apps/api`
- [x] uso de `pnpm -r --parallel` para execução em paralelo
- [ ] estrutura com `@code-connect/web` e `@code-connect/api`
- [x] atomic design no frontend
- [ ] REST no backend
- [ ] Conventional Commits configurados e validados
- [ ] testes para componentes e API conforme o projeto evoluir

## Estrutura atual observada

```text
project-evaluation-and-assessment/
├── apps/
│   └── web/
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
├── package.json
├── pnpm-workspace.yaml
├── .npmrc
├── .husky/
├── README.md
├── CLAUDE.md
├── prompt-projeto.txt
└── pnpm-lock.yaml
```

## Validação executada

Foi validado o build do frontend atual com sucesso:

```bash
pnpm --filter @code-connect/web build
```

Resultado: build concluído com sucesso.

## Conclusão

O repositório atual atende parcialmente ao escopo inicial do prompt: a base da aplicação web foi criada e já está funcionando. O ponto que ainda bloqueia a conclusão do projeto conforme o enunciado é a ausência do app `apps/api` e das integrações de backend, autenticação e regras de negócio esperadas.

A próxima etapa correta é:

1. criar o app NestJS em `apps/api`
2. configurar o workspace e scripts raiz
3. implementar os módulos REST e a API de autenticação
4. validar web + api juntos
5. revisar documentação e commits conforme Conventional Commits
