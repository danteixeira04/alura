# organisms/

Seções de UI mais densas, podem ter estado próprio e composição de
`atoms/` + `molecules/`. Exemplos: `Header`, `UserList`, `PostComposer`.

Regras:

- Pode importar de `atoms/`, `molecules/`.
- Não importar de `templates/` nem `pages/`.
- Cada componente público deve ter `<Nome>.test.tsx` ao lado.
