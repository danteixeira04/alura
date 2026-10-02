# RotaLog Workspace

## Responsabilidade

Repositório de infraestrutura local compartilhada do RotaLog. Ele provisiona o PostgreSQL e mantém os scripts de schemas, migrations e seeds usados pelas APIs.

## Serviços

- API Frotas: Java / Spring Boot, porta `8080`.
- API Entregas: Node.js / Express, porta `3000`.
- API Notificações: .NET 6, porta `5000`.
- Painel Admin: Angular via Nx, porta `4200`.
- Rastreamento: React via Nx, porta `3001`.

## Banco de Dados

O Docker Compose provisiona o PostgreSQL 14 com os schemas `frotas`, `entregas` e `notificacoes`. Os scripts SQL ficam em `tools/scripts/` e são executados na inicialização do ambiente.

Não adicione serviços externos ao compose sem necessidade: Redis e Kafka estão comentados porque não foram implementados no sistema atual.

## Desenvolvimento

```bash
docker-compose up -d
```

As APIs e os frontends são iniciados separadamente em seus respectivos repositórios. Para resetar o banco local, remova o volume antes de subir novamente:

```bash
docker-compose down -v
docker-compose up -d
```

## Cuidados

- Trate alterações em `tools/scripts/` como mudanças cross-repository.
- Mantenha a ordem numérica dos scripts de inicialização.
- Confirme compatibilidade com os schemas e os nomes de tabelas usados pelas três APIs antes de alterar SQL.
