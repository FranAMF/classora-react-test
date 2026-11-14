import type { Ticket } from "../../../shared/types";

export interface TicketListParams {
  offset: number;
  limit: number;
  q: string;
  state: Ticket["state"] | "ALL";
  severity: Ticket["severity"] | "ALL";
  sort: "TARGET_DATE" | "LAST_MODIFIED";
  direction: "ASC" | "DESC";
}

export type Filters = Omit<TicketListParams, "offset" | "limit">;
