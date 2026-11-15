import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { setDueDate } from "../services";
import type { SetDueDateRequest, TicketPage } from "../types";

type SetDueDateVariables = SetDueDateRequest & { id: string };

// Es síncrono: también bloquea dos llamadas antes del siguiente render.
const updatingClients = new WeakSet<QueryClient>();

function updatePage(
  page: TicketPage,
  { id, dueDate }: SetDueDateVariables,
  isReportedList: boolean,
): TicketPage {
  const ticket = page.data.find((ticket) => ticket.id === id);
  if (!ticket) return page;

  if (isReportedList && ticket.state === "REPORTED") {
    return {
      ...page,
      data: page.data.filter((ticket) => ticket.id !== id),
      pagination: {
        ...page.pagination,
        totalElements: page.pagination.totalElements - 1,
      },
    };
  }

  return {
    ...page,
    data: page.data.map((ticket) => {
      if (ticket.id !== id) return ticket;

      return {
        ...ticket,
        dueDate,
        state: ticket.state === "REPORTED" ? "IN_PROGRESS" : ticket.state,
      };
    }),
  };
}

export function useSetDueDate() {
  const client = useQueryClient();

  const mutation = useMutation({
    retry: false,
    // 1. Enviar el PATCH.
    mutationFn: ({ id, dueDate }: SetDueDateVariables) =>
      setDueDate(id, { dueDate }),
    // 2. Cancelar consultas, guardar las páginas y aplicar el cambio optimista.
    onMutate: async (variables) => {
      await client.cancelQueries({ queryKey: ["tickets"] });
      const previous = client
        .getQueriesData<TicketPage>({ queryKey: ["tickets"] })
        .filter(([_, page]) =>
          page?.data.some((ticket) => ticket.id === variables.id),
        );

      for (const [key, page] of previous) {
        if (!page) continue;
        const params = key[1];
        const isReportedList =
          typeof params === "object" &&
          params !== null &&
          "state" in params &&
          params.state === "REPORTED";
        client.setQueryData(key, updatePage(page, variables, isReportedList));
      }
      return previous; //previos se pasa a onError para restaurar si falla la mutación
    },
    // 3. Restaurar las páginas anteriores si falla.
    onError: (_error, _variables, previous) => {
      for (const [key, page] of previous ?? []) {
        client.setQueryData(key, page);
      }
    },
    // 4. Sincronizar los listados y después permitir otra confirmación.
    onSettled: async () => {
      try {
        await client.invalidateQueries({ queryKey: ["tickets"] });
      } finally {
        updatingClients.delete(client);
      }
    },
  });

  //Comprobamos que no hay peticiones ejecutandose para el mismo cliente antes de ejecutar la mutación.
  // Esto evita que se solapen las actualizaciones optimistas y que se produzcan errores de sincronización
  // en la caché de React Query.
  function mutate(variables: SetDueDateVariables) {
    if (updatingClients.has(client)) return;

    updatingClients.add(client);

    mutation.mutate(variables);
  }

  return { mutate, isPending: mutation.isPending, error: mutation.error };
}
