import { useEffect, useState } from "react";
import type { Ticket } from "../../../shared/types";

interface UseTicketsParams {
  teamId: string | undefined;
  offset: number;
  limit: number;
  state: string;
  search: string;
  debouncedSearch: string;
}

export function useGetTickets({
  teamId,
  offset,
  limit,
  state,
  search,
  debouncedSearch,
}: UseTicketsParams) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTickets([]);
    setTotal(0);
    setLoading(true);
    setError(null);

    // Esperamos a que la búsqueda se estabilice antes de cargar nada.
    if (search !== debouncedSearch) return;

    const controller = new AbortController();
    let active = true; // Lo usamos para evitar la ejecución del then y catch en caso de abortar la peticion

    const query = new URLSearchParams({
      offset: String(offset),
      limit: String(limit),
      state,
      q: debouncedSearch,
    });

    // Se asume que la ruta siempre proporciona teamId.
    //URL no coincide con la establecida para get en documentacon "/teams/"
    fetch(`/api/v1/teams/${teamId!}/tickets?${query}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al cargar los tickets: ${response.status}`);
        }

        return response.json();
      })
      .then((body) => {
        if (controller.signal.aborted) return;
        setTickets(body.data);
        setTotal(body.pagination.totalElements);
      })
      .catch((error) => {
        if (active && !controller.signal.aborted) {
          setTickets([]);
          setTotal(0);
          setError(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar los tickets",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [teamId, offset, limit, state, search, debouncedSearch]);

  return { tickets, total, loading, error, setTickets };
}
