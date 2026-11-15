# Classora · Prueba técnica React Senior

Resolución de los tres ejercicios con React 18 y TypeScript estricto, sobre Vite. Se utilizan React Router 6, TanStack Query 5 y Vitest con Testing Library.

## Ejecutar el proyecto

Esta entrega está orientada a la lectura y revisión del código y de las
notas de cada ejercicio. No incluye una aplicación funcional completa
ni un backend.

Para instalar las dependencias y ejecutar las comprobaciones:

```sh
npm ci
```

## Organización

La estructura está organizada por ejercicios para facilitar su identificación y revisión por el evaluador. No pretende representar la estructura de una aplicación real en producción.

- **Pregunta 1:** revisión de código y propuesta de solución.
- **Pregunta 2:** contrato OpenAPI y hook de filtros sincronizados con la URL.
- **Pregunta 3:** actualización optimista de la fecha compromiso y permisos.

El código está en `src/exercises`, separado por pregunta. Las explicaciones y decisiones específicas se encuentran en las notas de cada ejercicio. El contrato de la API está en `openapi-rest.yml`, en la raíz.

## Comprobaciones

Para ejecutar los tests:

```sh
npm run test
```

Estos comandos comprueban los tipos, ejecutan el linter y los tests, y generan la compilación de producción. Para ejecutar los tests en modo interactivo: `npm run test:watch`.
