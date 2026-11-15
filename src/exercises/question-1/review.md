# Revisión de código

En el ejercicio 1 se ha realizado una revisión de código y se han aplicado las correcciones manteniendo el enfoque original. Entre otros cambios, la petición se ha extraído al hook useGetTickets. Aunque podría haberse utilizado TanStack Query, se ha optado por no introducir ese cambio para mantener la refactorización centrada en los problemas detectados.

## Problemas por gravedad, de mayor a menor

### Gravedad crítica

No se identifican problemas críticos demostrables con el código disponible. Los principales fallos afectan a la carga de datos, la coherencia del listado y la navegación.

### Gravedad alta

1. **No se gestionan los errores HTTP ni los fallos de la petición.**

   `fetch` no rechaza automáticamente las respuestas HTTP de error. Se ejecuta `r.json()` sin comprobar `r.ok` y se interpreta cualquier respuesta como un listado válido.

   **Impacto:** un error del servidor puede terminar en una excepción al acceder a `body.pagination` o dejar datos inválidos en el estado. Además, si falla la petición o la lectura del JSON, `loading` permanece en `true` y el usuario no recibe ninguna explicación.

2. **Las peticiones pueden responder fuera de orden.**

   Cada cambio de búsqueda, estado o página dispara una petición, sin cancelar ni descartar la anterior.

   **Impacto:** una respuesta antigua puede sobrescribir los resultados de una búsqueda más reciente. También puede desactivar `loading` mientras otra petición sigue pendiente.

3. **El parámetro `offset` no tiene valor por defecto ni validación.**

   `parseInt(searchParams.get("offset")!)` devuelve `NaN` cuando el parámetro no existe. También acepta valores negativos o interpreta parcialmente entradas como `"20abc"`.

   **Impacto:** una visita normal sin parámetros o una URL manipulada puede generar peticiones inválidas y romper la paginación. El operador `!` solo afecta al tipado; no valida el valor en ejecución.

4. **El endpoint no coincide con el acordado en el enunciado.**

   Se utiliza `/api/v1/teams/{teamId}/tickets`, mientras que la API descrita expone `/api/v1/tickets`.

   **Impacto:** la página depende de una operación que no está definida. Hay que aclarar si el listado debe estar limitado por equipo antes de asumir esa ruta.

5. **Falta `teamId` en las dependencias del efecto y no se valida su existencia.**

   El efecto utiliza `teamId`, pero no vuelve a ejecutarse si cambia únicamente ese parámetro. Además, `teamId!` no impide que se construya una URL con `undefined`.

   **Impacto:** si se conserva la ruta por equipo, navegar entre equipos puede mostrar los datos del anterior o lanzar una petición inválida.

6. **Los parámetros de la petición se concatenan sin codificación.**

   `search` se introduce directamente en la URL.

   **Impacto:** búsquedas con caracteres como `&`, `#` o `+` pueden modificar la interpretación de los parámetros y devolver resultados incorrectos. La query debe construirse con `URLSearchParams`.

### Gravedad media

7. **La búsqueda tiene dos fuentes de verdad y no está sincronizada con la URL.**

   El estado local `search` solo toma `q` durante el primer render. Al escribir, la URL no se actualiza; al navegar atrás o adelante, el estado local tampoco se sincroniza.

   **Impacto:** el listado no se puede compartir fielmente mediante su URL y la navegación puede mostrar una búsqueda distinta de la indicada en ella.

8. **Cambiar los filtros no reinicia la paginación.**

   Ni `changeState` ni los cambios de búsqueda restablecen `offset` a `0`.

   **Impacto:** el usuario puede aplicar un filtro desde una página avanzada y obtener una lista vacía aunque existan resultados en las primeras páginas.

9. **No se validan los valores de `state`.**

   Cualquier cadena no vacía de la URL se envía al backend.

   **Impacto:** una URL con `state=FOO` provoca una petición inválida. También debe definirse cómo representar `ALL`: omitir el filtro o admitirlo expresamente en el contrato.

10. **Se hace una petición por cada pulsación.**

    El efecto depende directamente de `search`, que cambia con cada carácter.

    **Impacto:** aumenta innecesariamente el tráfico, los estados de carga y la posibilidad de respuestas fuera de orden. Falta aplicar debounce a la búsqueda.

11. **Se utiliza el índice como `key` de las filas.**

    `key={i}` identifica la posición, no el ticket.

    **Impacto:** al filtrar, ordenar o cambiar de página, React puede reutilizar una fila para otro ticket y conservar estado interno que no le corresponde. Debe utilizarse una identidad estable como `t.id`.

12. **`onChange` no define una actualización real del ticket.**

    `setTickets([...tickets])` crea otro array con los mismos objetos, sin aplicar ningún cambio explícito.

    **Impacto:** no garantiza que los datos se actualicen correctamente. Si depende de que `TicketRow` modifique el objeto recibido, estaría apoyándose en una mutación de las props y del estado.

13. **Falta tipado de los datos.**

    `useState<any[]>([])` permite acceder a cualquier propiedad sin comprobaciones. Tampoco se define el tipo de la respuesta paginada.

    **Impacto:** errores en nombres de campos o estructuras pasan inadvertidos durante el desarrollo. Tipar la respuesta ayuda, aunque no sustituye una validación en ejecución cuando sea necesaria.

14. **Los controles no tienen un nombre accesible.**

    El `input` y el `select` no cuentan con etiquetas asociadas.

    **Impacto:** los usuarios de lectores de pantalla no pueden identificar claramente la función de cada control. Deben añadirse etiquetas con `label` y su asociación correspondiente.

15. **El selector omite `PENDING_SECURITY`.**

    Es uno de los estados definidos en el modelo, pero no aparece entre las opciones.

    **Impacto:** el usuario no puede seleccionar ese filtro desde la interfaz.

16. **El contador no se actualiza por el simple paso del tiempo.**

    `new Date()` se evalúa cuando React renderiza el componente; no provoca renders nuevos.

    **Impacto:** si la página permanece abierta, un ticket que alcance su vencimiento no aparecerá como caducado hasta que se produzca otro render. Su relevancia depende de la precisión temporal requerida.

### Gravedad baja

17. **Se modifica directamente el objeto `searchParams`.**

    Se llama a `.set()` sobre la instancia obtenida del hook antes de pasarla al setter.

    **Impacto:** aunque la navegación puede funcionar, se modifica un objeto mutable compartido antes de actualizar la URL, lo que dificulta razonar sobre sus valores. Es preferible trabajar sobre una copia.

18. **No hay un mensaje para el listado vacío.**

    Cuando no existen resultados, se muestra una tabla sin filas.

    **Impacto:** el usuario no distingue claramente entre una búsqueda sin coincidencias y una pantalla que todavía no ha cargado.

19. **La tabla no define encabezados.(Mal menor, entendemos que es un ejercicio sencillo)**

    No aparecen `thead` ni celdas `th` que describan las columnas.

    **Impacto:** dificulta comprender la tabla, especialmente mediante tecnologías de asistencia. La estructura exacta debe completarse junto con `TicketRow`.
