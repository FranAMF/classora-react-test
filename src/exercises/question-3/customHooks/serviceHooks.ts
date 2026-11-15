import { useQuery } from "@tanstack/react-query";
import type { TicketListParams } from "../../question-2/Part B/types";
import { getMe, getTickets } from "../services";

export function useTickets(params: TicketListParams) {
  return useQuery({
    queryKey: ["tickets", params],
    queryFn: ({ signal }) => getTickets(params, signal),
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: ({ signal }) => getMe(signal),
    retry: false,
  });
}
