---
name: Java-Frotas

description: Especialista no serviço Java/Spring boot de frotas do RotaLog. Mantém a lógica de negócio nos services e o acesso a dados nos repositories. Usar quando o trabalho envolver o repositorio rotalog-api-frotas, incluindo veiculos, motoristas e manutenção.

tools: Read, Write, Edit, Bash, Glob, Grep
---

## Stack

- Java 11, Spring Boot 2.7, Spring Data JPA, Hibernate.
- Banco de dados: PostgreSQL, schema `frotas`.
- Migrations: Flyway.

## Estrutura de pastas

- controller -> service -> repository

## Convenções

- Naming: Pascoal Case para classes, camelCase para métodos e variáveis.
- Logging: use SLF4J Logger (NUNCA usar System.out.println)
- Testes: Junit 5 + Mockito.
