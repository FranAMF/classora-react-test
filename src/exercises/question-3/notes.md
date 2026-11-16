# Pregunta 3 · Actualización optimista y permisos

Usamos TanStack Query para gestionar las peticiones y compartir los datos del servidor mediante su caché. `Question3Example` conecta el listado y sus acciones con un mismo `QueryClientProvider`.

## 1. Actualización optimista

Al confirmar una fecha, `onMutate` cancela los GET pendientes, guarda los datos anteriores y actualiza la caché con la nueva `dueDate`. Si el ticket estaba en `REPORTED`, pasa a `IN_PROGRESS`. La interfaz refleja el cambio antes de enviar el PATCH mediante `mutationFn`.

Si falla, `onError` restaura los datos anteriores y se muestra un aviso fuera de las filas. `onSettled` sincroniza los listados con el servidor, tanto si el PATCH funciona como si falla.

El botón se deshabilita mientras guarda. Además, un bloqueo compartido evita iniciar dos actualizaciones simultáneas que puedan interferir al restaurar los datos.

## 2. Listados en caché y filtro activo

Cada combinación consultada de filtros y paginación se guarda bajo su clave `["tickets", params]`. Un mismo ticket puede aparecer en varios resultados: recorremos y actualizamos todos los que lo contienen.

Si estamos viendo solo `REPORTED` y el ticket pasa a `IN_PROGRESS`, deja de cumplir el filtro y se retira inmediatamente, restando uno al total. Si falla el PATCH, se restaura también esa fila.

La página puede quedar temporalmente incompleta y otras páginas conservar totales antiguos. Al finalizar, invalidamos todos los listados: los activos hacen otro GET para recuperar la paginación y el orden correctos; los inactivos quedan marcados como desactualizados. Si el GET falla, la sincronización queda pendiente.

## 3. Permisos

Consultamos `GET /api/v1/me` y mostramos la acción solo si la consulta termina correctamente y contiene `tickets.update`.

Ocultar el botón no basta: el backend debe comprobar el permiso en cada PATCH. La interfaz distingue el error 403, por falta de permiso, del 409, por un ticket en `DONE`.

## 4. Cómo probaría los casos sin backend

Simularía `fetch` con Vitest y un `QueryClient` aislado por prueba, sin reintentos:

- **200:** mantener el PATCH pendiente para comprobar el cambio inmediato y después confirmar la sincronización con el servidor.
- **403:** comprobar la restauración de los datos y el aviso de falta de permiso.
- **409:** comprobar la restauración y el aviso de ticket en `DONE`.

Usaría varios listados en caché, incluido uno filtrado por `REPORTED`, y simularía `/me` con y sin permiso. Estas pruebas se describen como permite el enunciado; no se presentan como implementadas ni ejecutadas.
