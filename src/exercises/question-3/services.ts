import type { Ticket } from "../../shared/types";
import type { TicketListParams } from "../question-2/Part B/types";
import { readResponse } from "./functions";
import type { SetDueDateRequest, TicketPage, UserPermissions } from "./types";

export async function getTickets(
  params: TicketListParams,
  signal: AbortSignal,
) {
  const query = new URLSearchParams({
    ...params,
    offset: String(params.offset),
    limit: String(params.limit),
  });
  return readResponse<TicketPage>(
    await fetch(`/api/v1/tickets?${query}`, { signal }),
  );
}

export async function getMe(signal: AbortSignal) {
  return readResponse<UserPermissions>(await fetch("/api/v1/me", { signal }));
}

export async function setDueDate(id: string, body: SetDueDateRequest) {
  return readResponse<Ticket>(
    await fetch(`/api/v1/tickets/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}
