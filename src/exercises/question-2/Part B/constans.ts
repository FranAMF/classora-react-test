import type { TicketListParams } from "./types";

export const DEFAULTS: Readonly<TicketListParams> = {
  offset: 0,
  limit: 20,
  q: "",
  state: "ALL",
  severity: "ALL",
  sort: "LAST_MODIFIED",
  direction: "DESC",
};

// Límites y enums de components.parameters en openapi-rest.yml.
export const STATES = ["ALL", "REPORTED", "IN_PROGRESS", "PENDING_SECURITY", "DONE"] as const satisfies readonly TicketListParams["state"][];
export const SEVERITIES = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const satisfies readonly TicketListParams["severity"][];
export const SORTS = ["TARGET_DATE", "LAST_MODIFIED"] as const;
export const DIRECTIONS = ["ASC", "DESC"] as const;
export const PARAM_KEYS = Object.keys(DEFAULTS) as (keyof TicketListParams)[];
export const FILTER_KEYS = ["q", "state", "severity", "sort", "direction"] as const;
