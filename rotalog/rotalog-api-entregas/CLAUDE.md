# RotaLog API Entregas

## Responsabilidade

Microsserviço de gestão de entregas, rotas e rastreamento. Mantenha a lógica de negócio nos services e o acesso a dados nos models do Sequelize.

## Stack

- Node.js 18
- Express 4.x
- Sequelize 6
- PostgreSQL, schema `entregas`

## Estrutura

- `src/routes/`: rotas e handlers HTTP.
- `src/services/`: regras de negócio e integrações com outros serviços.
- `src/models/`: models e associações do Sequelize.
- `src/middleware/`: autenticação e tratamento de erros.
- `src/config/`: conexão, migrations e seeds.
- `src/index.js`: inicialização da aplicação.

## Desenvolvimento

O PostgreSQL deve estar rodando pelo `rotalog-workspace` antes de iniciar a API.

```bash
npm install
npm start
```

A API usa a porta `3000`. Para desenvolvimento, use `npm run dev`.

## Banco de Dados

- Migrations e seeds locais ficam em `src/config/`.
- O banco compartilhado também é inicializado pelos scripts de `rotalog-workspace/tools/scripts/`.
- Na inicialização, a aplicação testa a conexão e executa `sequelize.sync({ alter: false })`; avalie o impacto no schema antes de alterar models.
- Preserve o schema `entregas` e coordene mudanças de contrato com as APIs consumidoras.

## Testes e Requisições

O script `npm test` ainda não possui testes implementados. Use `requests.http` para testes manuais e não trate esse script como uma validação automatizada completa.
