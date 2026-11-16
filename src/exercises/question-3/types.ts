import type { Ticket } from "../../shared/types";

export interface TicketPage {
  data: Ticket[];
  pagination: { offset: number; limit: number; totalElements: number };
}

export interface UserPermissions {
  permissions: string[];
}
export interface SetDueDateRequest {
  dueDate: string;
}
