# templates/

Layout de página **sem dados de domínio**: define a estrutura onde `pages/`
irá plugar conteúdo. Exemplos: `HomeTemplate`, `AuthTemplate`.

Regras:

- Pode importar de `atoms/`, `molecules/`, `organisms/`.
- Não importar de `pages/`.
- Recebe conteúdo via props (children/slots).
- Cada componente público deve ter `<Nome>.test.tsx` ao lado.
