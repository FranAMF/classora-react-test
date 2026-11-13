# Classora — Prueba técnica React Senior

Base con Vite, React 18, TypeScript estricto, React Router 6 y TanStack Query 5.
Tests preparados con Vitest, Testing Library y jsdom.

## Inicio

```sh
npm ci
npm run dev
```

## Comprobaciones

```sh
npm run build
npm run lint
npm run test
```

`npm run test:watch` ejecuta los tests en modo interactivo.
`npm run build` comprueba TypeScript y genera la compilación de producción;
`npm run lint` ejecuta el linter y `npm run test` ejecuta los tests una vez.

También están disponibles `npm run typecheck` para comprobar TypeScript y
`npm run preview` para previsualizar la compilación.

## Pendiente

- Pregunta 1: documentar los problemas por gravedad y su impacto en
  `src/exercises/question-1/review.md` y entregar la versión corregida en
  `src/exercises/question-1/TicketsPage.tsx`.
