// @ts-nocheck
import { useParams, useSearchParams } from "react-router-dom";
import {
  DEFAULT_LIMIT,
  TICKET_STATE_FILTER,
  TICKET_STATE_LABELS,
} from "./contants";
import { useDebounce } from "./customHooks/useDebounce";
import { useGetTickets } from "./customHooks/useGetTickets";

export function TicketsPage() {
  const { teamId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const parsedOffset = Number(searchParams.get("offset") ?? "0");
  const offset =
    Number.isSafeInteger(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;
  const limit = DEFAULT_LIMIT;
  const state =
    Object.values(TICKET_STATE_FILTER).find(
      (ticketState) => ticketState === searchParams.get("state"),
    ) ?? TICKET_STATE_FILTER.ALL;
  const search = searchParams.get("q") ?? "";

  const debouncedSearch = useDebounce(search, 300);
  const { tickets, total, loading, error, setTickets } = useGetTickets({
    teamId,
    offset,
    limit,
    state,
    search,
    debouncedSearch,
  });

  const changeParam = (
    param: "state" | "q" | "offset",
    value: string | number,
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set(param, String(value));

    if (param !== "offset") {
      params.set("offset", "0");
    }

    setSearchParams(params, { replace: param === "q" });
  };

  // Cuenta los tickets caducados de la página actual.
  // Compara targetDate con la fecha y hora actuales en cada render.
  // El paso del tiempo por sí solo no actualiza el contador.
  // Si se necesitara actualización automática, podría añadirse un temporizador.
  const expired = tickets.filter((t) => new Date(t.targetDate) < new Date());

  return (
    <div>
      <input
        value={search}
        onChange={(e) => changeParam("q", e.target.value)}
      />

      <select
        value={state}
        onChange={(e) => changeParam("state", e.target.value)}
      >
        {Object.values(TICKET_STATE_FILTER).map((ticketState) => (
          <option key={ticketState} value={ticketState}>
            {TICKET_STATE_LABELS[ticketState]}
          </option>
        ))}
      </select>

      {loading && <Spinner />}
      {error && <p role="alert">{error}</p>}
      {/*SOLO Tickets expirados en la busqueda actual*/}
      <p>{expired.length} tickets caducados</p>

      <table>
        <tbody>
          {tickets.map((t, i) => (
            <TicketRow
              key={t.id}
              ticket={t}
              //esto entendemos que es para tener un onChange y no le hacemos caso
              onChange={() => setTickets([...tickets])}
            />
          ))}
        </tbody>
      </table>

      <Pagination
        total={total}
        offset={offset}
        limit={limit}
        onChange={(offset: number) => changeParam("offset", offset)}
      />
    </div>
  );
}
