# pages/

Ponto de entrada por rota. Compõe `templates/` + `organisms/`/`molecules/`
com dados (mock, fetch, store…). Exemplo: `Home`, `Login`, `Profile`.

Regras:

- Pode importar de qualquer camada de `components/`.
- É a **única** camada que conhece dados concretos.
- Cada página deve ter `<Nome>.test.tsx` ao lado (smoke test de render).
