# Mapa de Dívidas Técnicas — RotaLog

**Data da análise:** 2026-09-25  
**Escopo:** `rotalog-api-entregas`, `rotalog-api-frotas`, `rotalog-api-notificacoes`, `rotalog-frontend` e `rotalog-workspace`.

## Resumo executivo

| Prioridade | Projetos | Risco principal |
|---|---|---|
| Crítica | API Entregas, API Notificações, Rastreamento | Autenticação ausente ou ineficaz; escrita/leitura de dados exposta; XSS armazenado possível no mapa. |
| Alta | Frontend, API Frotas | 17 CVEs reportados em quatro dependências npm do frontend; dois CVEs altos no driver JDBC; credenciais versionadas; .NET 6 sem suporte. |
| Alta | Infraestrutura | PostgreSQL 14 próximo do fim de suporte, credenciais administrativas compartilhadas e ausência de healthcheck/backup automatizado. |
| Média | Todos | Contratos divergentes, migrações com donos e mecanismos diferentes, testes/CI insuficientes e tratamento de falhas inconsistente. |

### Escopo e limites

- Revisão estática de código, manifests, configurações, SQL, projetos Nx e infraestrutura dos cinco repositórios.
- A consulta de CVEs foi feita contra advisories conhecidos para dependências **diretas** informadas a partir dos manifests/lockfiles. Não representa uma varredura completa de todas as dependências transitivas nem uma análise de imagem/container.
- Não foram executados builds, testes, DAST ou testes de invasão. A divergência dos testes do painel foi identificada pela leitura do teste e do componente, não por execução.
- O arquivo `.env` da API Entregas está versionado. Seu conteúdo não foi inspecionado nem reproduzido; trate quaisquer credenciais reais nele como expostas e faça rotação.

## 1. API Entregas — Node.js / Express

### Problemas de arquitetura

- **Média:** handlers de [entregas.js](rotalog-api-entregas/src/routes/entregas.js) concentram validação, regras de negócio, persistência e criação de eventos. A criação/atualização da entrega e o registro de rastreamento não compartilham uma transação, podendo deixar estado parcial.
- **Média:** o serviço mistura callbacks e `async/await`; o proxy de Frotas está acoplado às rotas e não tem timeout, cache ou circuit breaker ([frotas.js](rotalog-api-entregas/src/routes/frotas.js), [frotasService.js](rotalog-api-entregas/src/services/frotasService.js)).
- **Média:** cálculo de distância e estimativa de tempo são aproximações fixas, inadequadas para representar rota e duração reais ([entregas.js](rotalog-api-entregas/src/routes/entregas.js)).

### Inconsistências no código

- **Média:** validação é ad hoc e incompleta; há transições de estado inválidas possíveis, como reabrir uma entrega concluída, e atribuição não confirma existência/disponibilidade de veículo e motorista ([entregas.js](rotalog-api-entregas/src/routes/entregas.js)).
- **Média:** a documentação lista rotas que não correspondem às implementadas e descreve estrutura de middleware diferente da real ([README.md](rotalog-api-entregas/README.md)).
- **Alta:** o script `npm test` termina sempre com erro e não executa testes ([package.json](rotalog-api-entregas/package.json)).

### Vulnerabilidades de segurança

- **Crítica:** [auth.js](rotalog-api-entregas/src/middleware/auth.js) ignora autenticação fora de produção; em produção aceita qualquer bearer token não vazio com tamanho mínimo, sem validar assinatura, emissor ou expiração. O usuário é sempre definido como administrador.
- **Crítica:** `/api/rastreamento` não recebe o middleware de autenticação e inclui um `POST` que grava eventos/posições ([index.js](rotalog-api-entregas/src/index.js), [rastreamento.js](rotalog-api-entregas/src/routes/rastreamento.js)). Os endpoints também não têm rate limiting.
- **Alta:** CORS permite qualquer origem ([index.js](rotalog-api-entregas/src/index.js)). O tratamento global pode devolver mensagens internas e registra o corpo da requisição, com risco de exposição de dados pessoais ([errorHandler.js](rotalog-api-entregas/src/middleware/errorHandler.js)).
- **Crítica:** há senha de fallback para o banco no código ([database.js](rotalog-api-entregas/src/config/database.js)) e o `.env` está versionado. Não usar esses valores em produção; rotacionar credenciais reais.

### Estado de dependências

- **Alta:** o README fixa Node.js 18, cujo suporte terminou em 2025-03-27. O `package.json` não declara `engines` para impedir uso de runtimes sem suporte.
- A consulta de CVEs não encontrou advisories conhecidos nas dependências npm diretas informadas para este serviço. Isso não cobre dependências transitivas nem substitui scanner contínuo.

### Qualidade de infraestrutura

- **Alta:** inicialização usa `sequelize.sync()` em vez de um fluxo versionado de migrations, enquanto há scripts SQL separados no repositório de infraestrutura ([index.js](rotalog-api-entregas/src/index.js), [migration.sql](rotalog-api-entregas/src/config/migration.sql)).
- **Média:** conexão de banco captura erro sem sinalizar falha; health check sempre declara serviço `UP` e dependências `UNKNOWN`. Não há graceful shutdown, retry de inicialização ou métricas ([database.js](rotalog-api-entregas/src/config/database.js), [index.js](rotalog-api-entregas/src/index.js)).

## 2. API Frotas — Java / Spring Boot

### Problemas de arquitetura

- **Média:** serviços misturam regra de negócio, validação e envio de notificações; chamadas HTTP usam `RestTemplate` criado manualmente e URLs fixas ([VeiculoService.java](rotalog-api-frotas/src/main/java/com/rotalog/service/VeiculoService.java), [EntregaClient.java](rotalog-api-frotas/src/main/java/com/rotalog/service/EntregaClient.java), [NotificacaoClient.java](rotalog-api-frotas/src/main/java/com/rotalog/service/NotificacaoClient.java)).
- **Média:** `EntregaClient` converte indisponibilidade/erro remoto em lista ou mapa vazio, mascarando falha como ausência de dados. Não há timeout configurável, retry ou circuit breaker.
- **Média:** atualizações de manutenção e veículo são gravadas separadamente sem transação; falha intermediária pode deixar estados inconsistentes ([ManutencaoService.java](rotalog-api-frotas/src/main/java/com/rotalog/service/ManutencaoService.java)).

### Inconsistências no código

- **Média:** controllers repetem tratamento de exceções e retornam entidades JPA diretamente; requisições não usam `@Valid`, e respostas/erros variam entre endpoints ([VeiculoController.java](rotalog-api-frotas/src/main/java/com/rotalog/controller/VeiculoController.java), [MotoristaController.java](rotalog-api-frotas/src/main/java/com/rotalog/controller/MotoristaController.java)).
- **Média:** estados são strings, a validação de CNH é superficial e falhas de monotonicidade da quilometragem são apenas registradas, não rejeitadas ([Veiculo.java](rotalog-api-frotas/src/main/java/com/rotalog/domain/Veiculo.java), [MotoristaService.java](rotalog-api-frotas/src/main/java/com/rotalog/service/MotoristaService.java), [VeiculoService.java](rotalog-api-frotas/src/main/java/com/rotalog/service/VeiculoService.java)).
- **Média:** não foram encontrados testes-fonte em `src/test`; o POM inclui dependência de testes, mas isso por si só não protege os fluxos críticos.

### Vulnerabilidades de segurança

- **Crítica:** não foi encontrada configuração de autenticação/autorização; os endpoints de escrita dos controllers ficam acessíveis sem identidade/controle de papel.
- **Alta:** CORS permite qualquer origem ([CorsConfig.java](rotalog-api-frotas/src/main/java/com/rotalog/config/CorsConfig.java)).
- **Alta:** credenciais do banco estão em texto claro em [application.properties](rotalog-api-frotas/src/main/resources/application.properties). `show-sql`, DEBUG de web/Hibernate e TRACE de parâmetros podem registrar dados sensíveis.

### Estado de dependências

- **Alta — CVEs:** o driver `org.postgresql:postgresql:42.7.7` foi associado a dois advisories altos: **CVE-2026-42198** e **CVE-2026-54291**. A recomendação retornada para cobrir ambos é atualizar para `42.7.12` ou posterior.
- O POM usa Spring Boot `3.5.0`, Flyway `10.20.1` e Lombok `1.18.38`. A consulta de dependências diretas não encontrou outros CVEs nos artefatos informados; dependências transitivas não foram completamente avaliadas.

### Qualidade de infraestrutura

- **Alta:** Flyway está desabilitado apesar de existirem migrations no classpath; a evolução do schema fica delegada a scripts executados pelo Compose ([application.properties](rotalog-api-frotas/src/main/resources/application.properties), [V1__Initial_Schema.sql](rotalog-api-frotas/src/main/resources/db/migration/V1__Initial_Schema.sql)).
- **Média:** schema inicial não define índices relevantes, checks nem FK de manutenção para veículo ([V1__Initial_Schema.sql](rotalog-api-frotas/src/main/resources/db/migration/V1__Initial_Schema.sql)).
- **Média:** README orienta `./mvnw`, mas não há Maven Wrapper na raiz do repositório; builds dependem da versão de Maven instalada localmente ([README.md](rotalog-api-frotas/README.md)).

## 3. API Notificações — C# / ASP.NET Core

### Problemas de arquitetura

- **Alta:** `NotificacaoService` concentra CRUD, templates, envio, retry e estatísticas; MediatR é registrado, mas não participa dos fluxos ([NotificacaoService.cs](rotalog-api-notificacoes/Services/NotificacaoService.cs), [Program.cs](rotalog-api-notificacoes/Program.cs)).
- **Alta:** envio de e-mail/SMS é simulado, síncrono e acoplado à criação da notificação. O processamento não usa fila, backoff, dead-letter ou exclusão mútua; chamadas concorrentes podem processar os mesmos pendentes.
- **Média:** listagem e estatísticas carregam todos os registros em memória e não têm paginação ([NotificacaoService.cs](rotalog-api-notificacoes/Services/NotificacaoService.cs)).

### Inconsistências no código

- **Média:** README descreve Clean Architecture e rotas de e-mail/SMS/histórico que não correspondem à estrutura e aos endpoints presentes ([README.md](rotalog-api-notificacoes/README.md), [NotificacoesController.cs](rotalog-api-notificacoes/Controllers/NotificacoesController.cs)).
- **Média:** erros são tratados com `try/catch` repetido nos controllers; algumas respostas incluem `ex.Message` ao cliente ([NotificacoesController.cs](rotalog-api-notificacoes/Controllers/NotificacoesController.cs)).
- **Média:** não foi encontrado projeto de testes no repositório; serviço concreto também dificulta substituição por mock.

### Vulnerabilidades de segurança

- **Crítica:** não há autenticação/autorização configurada. Reenvio e processamento em lote são endpoints públicos, assim como consultas que expõem histórico e destinatários ([Program.cs](rotalog-api-notificacoes/Program.cs), [NotificacoesController.cs](rotalog-api-notificacoes/Controllers/NotificacoesController.cs)).
- **Alta:** CORS permite qualquer origem; exceções são devolvidas com detalhes internos. Logs incluem destinatário e conteúdo de mensagens, que podem conter dados pessoais/sensíveis ([Program.cs](rotalog-api-notificacoes/Program.cs), [NotificacaoService.cs](rotalog-api-notificacoes/Services/NotificacaoService.cs)).
- **Alta:** configuração versionada contém credenciais de banco e campos de senha/chave de provedores em texto claro ([appsettings.json](rotalog-api-notificacoes/appsettings.json)). Os valores aparentam ser demonstrativos; ainda assim, substituir por configuração segura e não reutilizar credenciais reais.

### Estado de dependências

- **Alta:** alvo `net6.0` está fora de suporte desde 2024-11-12. O runtime e o framework não recebem correções de segurança da Microsoft.
- `Microsoft.EntityFrameworkCore` está na linha `6.0.12`, com Npgsql EF Core `6.0.8`; MediatR `11.x`. A consulta de advisories não encontrou CVEs conhecidos nas seis dependências NuGet diretas fornecidas, mas o runtime EOL e transitivas não ficam cobertos por esse resultado.

### Qualidade de infraestrutura

- **Alta:** `EnsureCreated()` é usado no startup em vez de migrations; se o banco falhar, o processo captura a exceção e continua aceitando tráfego ([Program.cs](rotalog-api-notificacoes/Program.cs)).
- **Média:** SQL de criação é mantido no Compose, enquanto o DbContext não declara índices/constraints equivalentes; aumenta o risco de drift entre banco novo e existente ([NotificacoesDbContext.cs](rotalog-api-notificacoes/Data/NotificacoesDbContext.cs), [04-migration-notificacoes.sql](rotalog-workspace/tools/scripts/04-migration-notificacoes.sql)).
- **Média:** ausência de health check real, métricas e configuração de resiliência; endpoints Swagger são habilitados sem condicionar ao ambiente ([Program.cs](rotalog-api-notificacoes/Program.cs)).

## 4. Frontend — Angular Admin + React Rastreamento (Nx)

### Problemas de arquitetura

- **Alta:** o contrato compartilhado e o OpenAPI não representam os payloads reais: nomes, casing, estados e campos diferem dos serviços; falta uma fonte única verificável ([shared-types](rotalog-frontend/libs/shared-types/src/index.ts), [openapi.yaml](rotalog-frontend/libs/api-contracts/src/openapi.yaml)).
- **Média:** Rastreamento mantém componentes de classe, estado local redundante e `any`; polling periódico busca a entrega, mas descarta o payload e não atualiza o painel ([App.tsx](rotalog-frontend/apps/rastreamento/src/App.tsx), [TrackingDashboard.tsx](rotalog-frontend/apps/rastreamento/src/components/TrackingDashboard.tsx)).
- **Média:** o painel e o rastreamento chamam endereços `localhost` diretamente; não há configuração de ambientes nem cliente/API layer comum. O estado de filtros do app não é aplicado pela lista.

### Inconsistências no código

- **Alta:** tipos TypeScript declaram campos que não existem no backend e usam estados minúsculos quando os serviços retornam valores maiúsculos ([shared-types](rotalog-frontend/libs/shared-types/src/index.ts), [openapi.yaml](rotalog-frontend/libs/api-contracts/src/openapi.yaml)).
- **Média:** teste unitário do painel espera um `h1` com “Welcome painel-admin” e `title === 'painel-admin'`, mas o componente define título RotaLog e seu template não contém esse `h1` ([app.component.spec.ts](rotalog-frontend/apps/painel-admin/src/app/app.component.spec.ts), [app.component.html](rotalog-frontend/apps/painel-admin/src/app/app.component.html), [app.component.ts](rotalog-frontend/apps/painel-admin/src/app/app.component.ts)).
- **Média:** o projeto E2E tem `targets` vazio e o único spec é o teste gerado de título; Rastreamento não declara target de teste em seu `project.json` ([painel-admin-e2e/project.json](rotalog-frontend/apps/painel-admin-e2e/project.json), [example.spec.ts](rotalog-frontend/apps/painel-admin-e2e/src/example.spec.ts), [rastreamento/project.json](rotalog-frontend/apps/rastreamento/project.json)).

### Vulnerabilidades de segurança

- **Crítica — XSS:** `MapView` monta HTML concatenando valores do payload (endereços, nome do motorista e descrição do evento) e o entrega a `bindPopup`. Se conteúdo controlável chegar pela API, será interpretado como HTML pelo Leaflet ([MapView.tsx](rotalog-frontend/apps/rastreamento/src/components/MapView.tsx), [entregas.js](rotalog-api-entregas/src/routes/entregas.js)).
- **Alta:** o painel não implementa autenticação/guards e o rastreamento chama a API sem token; isso é incompatível com qualquer proteção real do backend. A API Entregas ainda aceita tokens falsos, aumentando o impacto.
- **Alta:** endpoints locais são codificados no bundle e dificultam separar ambientes, aplicar TLS e restringir origem.

### Estado de dependências

- **Alta — CVEs:** a consulta reportou **17 advisories em quatro dependências diretas** resolvidas pelo lockfile:
  - `@angular/common@18.2.14`: CVE-2025-66035, CVE-2026-50170, CVE-2026-50171, CVE-2026-54266, CVE-2026-54268, CVE-2026-68945 e CVE-2026-88059.
  - `@angular/core@18.2.14`: CVE-2026-22610, CVE-2026-27970, CVE-2026-32635, CVE-2026-54267, CVE-2026-52725, CVE-2026-50557, CVE-2026-69151 e CVE-2026-88057.
  - `nx@19.8.4`: CVE-2026-54753 (servidor de `nx graph` com política CORS permissiva).
  - `@babel/core@7.29.0`: CVE-2026-49356.
- A maioria dos advisories acima foi classificada como **alta** pela consulta; atualizar para versões corrigidas em uma linha suportada e reexecutar o scanner antes de publicar.

### Qualidade de infraestrutura

- **Média:** Nx dá builds e lint, mas a configuração de E2E não tem executor/targets; não há evidência de pipeline CI validando build, lint, testes e contratos.
- **Média:** Leaflet é carregado por CDN em runtime apesar de estar disponível no ecossistema npm ([MapView.tsx](rotalog-frontend/apps/rastreamento/src/components/MapView.tsx)); isso adiciona dependência externa e torna CSP/SRI e disponibilidade parte do caminho crítico.

## 5. Workspace — Docker Compose, PostgreSQL e SQL

### Problemas de arquitetura

- **Alta:** os serviços compartilham a mesma instância e credencial administrativa do PostgreSQL. Schemas separados não isolam permissões quando o mesmo usuário recebe `ALL PRIVILEGES` em todos eles ([docker-compose.yml](rotalog-workspace/docker-compose.yml), [init-schemas.sql](rotalog-workspace/tools/scripts/init-schemas.sql)).
- **Média:** o Compose sobe apenas o banco; APIs e frontends precisam de inicialização separada, sem orquestração de dependências ou ambiente de integração reproduzível ([README.md](rotalog-workspace/README.md), [docker-compose.yml](rotalog-workspace/docker-compose.yml)).

### Inconsistências no código

- **Alta:** migrations têm múltiplos donos e mecanismos: scripts de inicialização do Compose, migration SQL na API Entregas, Flyway desabilitado em Frotas e `EnsureCreated` em Notificações. Não há uma única sequência/versionamento de schema.
- **Média:** scripts em `/docker-entrypoint-initdb.d` são executados na criação inicial do volume; alterações posteriores não migram automaticamente bancos existentes. Resetar volume para aplicar mudanças traz risco de perda de dados.
- **Média:** o contrato OpenAPI mantido no frontend contém rotas/fields desatualizados; não existe gate de compatibilidade entre cliente e APIs ([openapi.yaml](rotalog-frontend/libs/api-contracts/src/openapi.yaml)).

### Vulnerabilidades de segurança

- **Crítica:** credenciais do banco estão no Compose em texto claro e o serviço é executado como usuário administrativo. O porto `5432` é publicado no host sem restrição de interface ([docker-compose.yml](rotalog-workspace/docker-compose.yml)).
- **Alta:** o script concede privilégios totais ao mesmo usuário para os três schemas e não cria papéis separados por serviço ([init-schemas.sql](rotalog-workspace/tools/scripts/init-schemas.sql)).

### Estado de dependências

- **Alta, urgente:** imagem `postgres:14` aproxima-se do fim de suporte em **2026-11-12**. Planejar atualização major com ensaio de backup/restore e migração de volume; a política recomenda usar a minor mais recente da major enquanto ainda suportada.
- Não há digest/tag de patch fixo para a imagem; builds podem variar ao longo do tempo dentro da major 14.

### Qualidade de infraestrutura

- **Alta:** não há healthcheck, limites de recursos ou política automatizada de backup/restauração ([docker-compose.yml](rotalog-workspace/docker-compose.yml)).
- **Média:** faltam containers/compose profiles para os serviços, CI/CD, checks de inicialização do banco e documentação automatizada do ambiente.

## Sequência recomendada

1. Fechar os caminhos de acesso: autenticação/autorização nas três APIs, remover bypass/falsa validação de token, proteger rotas de rastreamento e operações de notificação, restringir CORS e retirar/rotacionar credenciais versionadas.
2. Corrigir o XSS no mapa evitando HTML concatenado com dados remotos; adicionar teste de regressão.
3. Atualizar Angular/Nx/Babel e o driver JDBC para releases corrigidas; planejar migração do .NET 6 e PostgreSQL 14 para versões suportadas.
4. Definir contrato API único, cliente configurável por ambiente e política de compatibilidade; sincronizar tipos, OpenAPI e respostas reais.
5. Consolidar migrations, transações e readiness; adicionar testes automatizados por serviço e pipeline que bloqueie merge em falhas.

## Referências de ciclo de suporte

- [.NET e .NET Core Support Policy](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core): .NET 6 encerrou suporte em 2024-11-12.
- [Node.js Releases](https://nodejs.org/en/about/previous-releases): Node.js 18 encerrou suporte em 2025-03-27.
- [PostgreSQL Versioning Policy](https://www.postgresql.org/support/versioning/): PostgreSQL 14 tem fim de suporte em 2026-11-12.