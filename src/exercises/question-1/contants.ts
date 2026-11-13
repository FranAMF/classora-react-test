import type { TicketState } from "../../shared/types";

export const TICKET_STATE_FILTER = {
  ALL: "ALL",
  PENDING_SECURITY: "PENDING_SECURITY",
  REPORTED: "REPORTED",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const satisfies Record<TicketState | "ALL", TicketState | "ALL">;

export const TICKET_STATE_LABELS = {
  ALL: "Todos",
  PENDING_SECURITY: "Pendiente de seguridad",
  REPORTED: "Reportado",
  IN_PROGRESS: "En curso",
  DONE: "Hecho",
} satisfies Record<keyof typeof TICKET_STATE_FILTER, string>;

export const DEFAULT_LIMIT = 20;
