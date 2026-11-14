// @ts-nocheck

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Filters, TicketListParams } from "./types";
import { DEFAULTS, FILTER_KEYS } from "./constans";
import { readParams, writeParams } from "./functions";

export function useTicketListParams(): {
  params: TicketListParams;
  setFilters: (patch: Partial<Filters>) => void;
  setPage: (offset: number) => void;
  reset: () => void;
} {
  const [searchParams, setSearchParams] = useSearchParams();
  // La lectura siempre es síncrona y validada, incluso antes del efecto.
  const params = readParams(searchParams);
  const search = searchParams.toString();
  const normalized = writeParams(searchParams, params).toString();

  useEffect(() => {
    //Limpiamos url de parámetros inválidos, si no es igual a la url normalizada, la reemplazamos
    if (search !== normalized) setSearchParams(normalized, { replace: true });
  }, [search, normalized, setSearchParams]);

  function setFilters(filter: Partial<Filters>): void {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      for (const key of FILTER_KEYS) {
        if (Object.hasOwn(filter, key))
          next.set(key, filter[key] ?? DEFAULTS[key]);
      }
      next.delete("offset");
      return writeParams(next, readParams(next));
    });
  }

  function setPage(offset: number): void {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("offset", String(offset));
      return writeParams(next, readParams(next));
    });
  }

  function reset(): void {
    setSearchParams((current) => writeParams(current, DEFAULTS));
  }

  return { params, setFilters, setPage, reset };
}
