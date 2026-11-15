import { useState } from "react";
import type { Ticket } from "../../shared/types";
import { usePermissions } from "./customHooks/serviceHooks";

// Se renderiza fuera de las filas para sobrevivir al cambio optimista.
export function SetDueDateError({ error }: { error: Error | null }) {
  if (!error) return null;

  let message = "No se pudo guardar la fecha compromiso. Inténtalo de nuevo.";
  if (error.cause === 403)
    message = "No tienes permiso para cambiar la fecha compromiso.";
  if (error.cause === 409)
    message =
      "El ticket está en DONE y no permite cambiar la fecha compromiso.";
  return <p role="alert">{message}</p>;
}

export function SetDueDateAction({
  ticket,
  isPending,
  onConfirm,
}: {
  ticket: Ticket;
  isPending: boolean;
  onConfirm: (id: string, dueDate: string) => void;
}) {
  const [date, setDate] = useState("");
  const permissions = usePermissions();

  if (
    !permissions.isSuccess ||
    !permissions.data.permissions.includes("tickets.update")
  ) {
    return null;
  }
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (!date || isPending) return;

        onConfirm(ticket.id, new Date(date).toISOString());
      }}
    >
      <label>
        Fecha compromiso de {ticket.key} (hora local)
        <input
          type="datetime-local"
          required
          value={date}
          disabled={isPending}
          onChange={(event) => setDate(event.target.value)}
        />
      </label>{" "}
      <button type="submit" disabled={isPending || !date}>
        Fijar fecha compromiso
      </button>
    </form>
  );
}
