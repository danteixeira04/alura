# CLAUDE.md

Guia operacional para este workspace do Code Connect.

## Visão geral

Este repositório ainda está em um estágio inicial em relação ao objetivo definido em `prompt-projeto.txt`.

Hoje, a estrutura real observada é:

- `apps/web` com Vite + React + TypeScript
- ausência de `apps/api` NestJS
- configuração de monorepo em `pnpm`
- documentação e hooks iniciais já criados

## Estado atual

### Concluído

- workspace raiz com `pnpm`
- app frontend em `apps/web`
- React + TypeScript + Vite
- Tailwind
- organização dos componentes em atomic design
- testes iniciais de UI
- hooks e configuração de qualidade no root

### Ainda pendente

- app NestJS em `apps/api`
- scripts de build/dev para a API no root
- endpoints REST
- autenticação e autorização
- banco de dados e persistência
- testes da API
- execução em paralelo web + api
- alinhação completa da documentação com o estado final

## Requisitos do prompt que ainda não foram atendidos

- [ ] monorepo com dois apps (web + api)
- [ ] backend NestJS
- [ ] conformidade REST na API
- [ ] scripts raiz para web e api
- [ ] conventional commits totalmente validados
- [ ] ambiente de produção e em desenvolvimento estável para os dois apps

## Arquitetura esperada

A estrutura final esperada é:

```text
project-evaluation-and-assessment/
├── apps/
│   ├── web/
│   └── api/
├── package.json
├── pnpm-workspace.yaml
├── .npmrc
├── .gitignore
├── CLAUDE.md
├── README.md
├── prompt-projeto.txt
└── pnpm-lock.yaml
```

## Regra de trabalho

Sempre que uma mudança for feita, a documentação precisa refletir o que foi implementado e o que ainda ficou pendente. O objetivo deste arquivo é evitar que o projeto seja confundido com um estado funcional completo quando a base real ainda é parcial.

## Validação executada

Foi executado e validado o build atual do frontend:

```bash
pnpm --filter @code-connect/web build
```

Resultado: build concluído com sucesso.

## Próxima ação recomendada

1. gerar o app NestJS em `apps/api`
2. configurar o workspace para `@code-connect/api`
3. implementar módulos REST e autenticação
4. validar `pnpm dev`, `pnpm build` e testes
5. revisar e atualizar os arquivos `README.md` e `CLAUDE.md` conforme a evolução real

## Observação final

O projeto está em progresso, mas não está concluído em relação ao prompt. O frontend existe e funciona; o backend e os requisitos de produto da etapa seguinte ainda são os itens principais que faltam.
