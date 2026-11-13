export type TicketState = "REPORTED" | "IN_PROGRESS" | "PENDING_SECURITY" | "DONE";
type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export interface Ticket {
  id: string;
  key: string; // "SEC-1024"
  asset: string; // "payments-api" o "None" si es desconocido
  assignedTeam: string | null;
  assignee: string; // email
  severity: Severity;
  state: TicketState;
  targetDate: string; // date-time RFC 3339, p. ej. "2026-11-30T23:59:59Z"
  dueDate: string | null; // date-time RFC 3339 o null
  lastModified: string; // date-time RFC 3339
}
