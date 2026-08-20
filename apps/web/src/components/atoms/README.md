# atoms/

Unidades mínimas, **sem estado de negócio**. Exemplos: `Button`, `Input`,
`Label`, `Badge`.

Regras:

- Não importar de `molecules/`, `organisms/`, `templates/`, `pages/`.
- Pode ser puramente visual (props + Tailwind).
- Cada componente público deve ter `<Nome>.test.tsx` ao lado.
