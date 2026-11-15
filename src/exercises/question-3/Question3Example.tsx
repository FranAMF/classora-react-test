import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { TicketListParams } from "../question-2/Part B/types";
import { useSetDueDate } from "./customHooks/useSetDueDate";
import { useTickets } from "./customHooks/serviceHooks";
import { SetDueDateAction, SetDueDateError } from "./SetDueDateAction";

const params: TicketListParams = {
  offset: 0,
  limit: 20,
  q: "",
  state: "REPORTED",
  severity: "ALL",
  sort: "LAST_MODIFIED",
  direction: "DESC",
};

// El provider comparte una cache con el listado y sus acciones.
export function Question3Example() {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <TicketList />
    </QueryClientProvider>
  );
}

function TicketList() {
  const tickets = useTickets(params);
  // Una sola mutación para todas las filas: comparten acción y estado pendiente.
  const { mutate, isPending, error } = useSetDueDate();

  return (
    <section aria-label="Ejemplo de fecha compromiso">
      <h2>Tickets en REPORTED</h2>
      <p>
        Al fijar la fecha, el ticket pasa a IN_PROGRESS y sale de este listado.
      </p>

      {/* El error permanece aunque desaparezca una fila. */}
      <SetDueDateError error={error} />

      {tickets.data && (
        <>
          <p>Total: {tickets.data.pagination.totalElements}</p>
          {tickets.data.data.length === 0 && (
            <p>No hay tickets en esta página.</p>
          )}
          <ul>
            {tickets.data.data.map((ticket) => (
              <li key={ticket.id}>
                <p>
                  {ticket.key} · {ticket.state} · Fecha compromiso:{" "}
                  {ticket.dueDate ?? "Sin fecha"}
                </p>
                <SetDueDateAction
                  ticket={ticket}
                  isPending={isPending}
                  onConfirm={(id, dueDate) => mutate({ id, dueDate })}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
