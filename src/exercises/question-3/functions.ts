export async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Conservamos el código HTTP para que la UI elija el mensaje.
    throw new Error(`La petición ha fallado (HTTP ${response.status}).`, {
      cause: response.status,
    });
  }
  return response.json();
}
