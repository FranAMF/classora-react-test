# Pregunta 2 · Parte B

## Funcionamiento

`useTicketListParams` gestiona los filtros y la paginación desde la URL. Devuelve los valores ya validados en `params` y tres acciones:

- `setFilters`: cambia los filtros indicados y vuelve a la primera página.
- `setPage`: cambia la página conservando los filtros.
- `reset`: restablece los valores por defecto.

La URL es la única fuente de verdad: los filtros se leen directamente de ella, por lo que compartirla o navegar atrás y adelante recupera sus valores. Para actualizarla, se modifica una copia de searchParams y se aplica con setSearchParams.

## Validación y URL limpia

Los valores se comprueban según el contrato OpenAPI. Los números deben ser enteros dentro de sus límites, los filtros deben pertenecer a sus enums y la búsqueda admite hasta 200 caracteres Unicode. Los valores inválidos se sustituyen por su default.

Los defaults se omiten de la URL y se conservan los parámetros ajenos al hook. Se trabaja con copias de `URLSearchParams` para no modificar el original.

## Historial

Las correcciones automáticas usan `replace` para sustituir la URL actual sin añadir pasos al historial. Los cambios del usuario añaden una entrada, permitiendo volver a los filtros o a la página anterior.

## ¿Dónde pondría el debounce y por qué?

Lo aplicaría en el código que consume el hook, antes de realizar la consulta del listado. Tanto la clave de la consulta como los parámetros enviados utilizarían el mismo valor de búsqueda con debounce.

Así evitamos una petición por cada pulsación y el hook sigue reflejando inmediatamente los valores de la URL. El hook no realiza peticiones.
( De hecho lo hice en el ejericio 1 sin saber que aquí lo pedirían más tarde)

Si la interfaz tuviera un botón de búsqueda, podríamos consultar solo al
enviar el formulario, sin necesitar debounce . El texto podría recogerse
con useState, useRef o FormData, según cómo estuviera construido el formulario.

## Tests

Se prueba el hook con `renderHook` dentro de un `MemoryRouter`, que simula la URL y el historial. Las ocho pruebas cubren defaults, lectura, valores inválidos, URL limpia, cambio de filtros, paginación, reset y navegación atrás y adelante.
