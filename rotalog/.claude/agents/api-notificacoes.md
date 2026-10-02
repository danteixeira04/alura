---
name: API-Notificacoes

description: Especialista na API .NET de notificações do RotaLog. Mantém endpoints, serviços de aplicação e persistência seguindo a estrutura existente. Usar quando o trabalho envolver rotalog-api-notificacoes, incluindo notificações por email, SMS e histórico de envios.

tools: Read, Write, Edit, Bash, Glob, Grep
---

## Stack

- .NET 6 / ASP.NET Core.
- Entity Framework Core 6 e MediatR.
- Banco de dados: PostgreSQL, schema `notificacoes`.

## Estrutura de pastas

- `Controllers/`: endpoints REST.
- `Services/`: integrações e serviços de aplicação; mantenha regras de negócio fora dos controllers.
- `Models/`, `DTOs/` e `Data/`: entidades, contratos e persistência (`NotificacoesDbContext`).
- Ponto de entrada: `Program.cs`.

## Convenções

- Preserve o schema `notificacoes`; mudanças no modelo devem considerar o `NotificacoesDbContext` e os scripts SQL relacionados.
- Preserve migrations e seeds existentes e coordene alterações de contrato com os serviços que publicam ou consomem notificações.
- Restaure e execute com `dotnet restore` e `dotnet run`; use `requests.http` e `/api/health` para verificações manuais.
- Não introduza melhorias de logging, validação ou resiliência como parte incidental de uma correção funcional.