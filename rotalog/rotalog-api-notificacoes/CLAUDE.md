# RotaLog API Notificações

## Responsabilidade

Microsserviço de notificações transacionais por email e SMS, incluindo consulta do histórico de envios.

## Stack

- .NET 6 / ASP.NET Core
- Entity Framework Core 6
- MediatR
- PostgreSQL, schema `notificacoes`

## Estrutura

- `Controllers/`: endpoints REST.
- `Models/`: entidades persistidas.
- `DTOs/`: contratos de entrada e saída.
- `Data/`: `DbContext`, migrations e seeds.
- `Services/`: integrações e serviços de aplicação.
- `Program.cs`: composição da aplicação.

Siga a separação existente entre controllers, serviços e persistência. Não coloque regras de negócio complexas nos controllers.

## Desenvolvimento

O PostgreSQL deve estar rodando pelo `rotalog-workspace` antes de iniciar a API.

```bash
dotnet restore
dotnet run
```

A API usa a porta `5000` conforme a documentação do projeto. Use `requests.http` para requisições manuais e `/api/health` para verificar a disponibilidade.

## Banco de Dados

- O schema usado é `notificacoes`.
- Preserve migrations e seeds existentes; mudanças no modelo devem ser refletidas no `NotificacoesDbContext` e nos scripts SQL correspondentes.
- Coordene alterações de contratos com os serviços que publicam ou consomem notificações.

## Qualidade

O projeto ainda possui pontos documentados para evolução, como health checks adicionais, logging estruturado, validação e resiliência. Não introduza essas mudanças incidentalmente em correções de funcionalidade.
