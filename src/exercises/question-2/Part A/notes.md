# Pregunta 2 · Parte A: contrato OpenAPI

El archivo `openapi-rest.yml` define el contrato de la API en OpenAPI 3.0.3.

## Operaciones

- **GET tickets:** consultar el listado con filtros y paginación.
- **PATCH ticket:** fijar la fecha compromiso, respetando los permisos y las reglas de estado.
- **GET me:** consultar los permisos del usuario.

## Organización

Las operaciones están en `paths`. Los parámetros, esquemas y respuestas reutilizables están en `components`, enlazados mediante `$ref`.

## Decisiones propias

- Se han elegido los límites que el enunciado no concreta.
- La ordenación admite `TARGET_DATE` y `LAST_MODIFIED`.
- El PATCH exige una fecha no nula.
- Los errores adicionales quedan como propuestas comentadas en las operaciones.

## Campos obligatorios y nulos

`required` exige que el campo aparezca; `nullable` permite que su valor sea `null`.

## ¿Cómo evitar que TypeScript y el contrato se desincronicen?

Usaría OpenAPI como fuente de verdad y generaría los tipos TypeScript desde el contrato, comprobando en integración continua que estén actualizados.

Si ya existiera una integración compleja, utilizaría adapters tipados para transformar los datos al modelo del frontend y adaptar el código gradualmente. Valoraría un BFF si necesitáramos combinar varias APIs o preparar respuestas específicas para el frontend. Estas capas complementan el contrato, pero no sustituyen la generación de tipos.

## Consultar y validar el contrato

Abrir https://editor.swagger.io/ y pegar el contenido de `openapi-rest.yml`
para visualizar la documentación y revisar los errores que detecte el editor.
