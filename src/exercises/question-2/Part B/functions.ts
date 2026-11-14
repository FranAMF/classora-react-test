import type { TicketListParams } from "./types";
import {
  DEFAULTS,
  STATES,
  SEVERITIES,
  SORTS,
  DIRECTIONS,
  PARAM_KEYS,
} from "./constans";

function readInteger(
  value: string | null,
  min: number,
  max: number,
  fallback: number,
): number {
  //Compraobamos si es null y si es un numero entero positivo, si no lo es devolvemos el valor por defecto
  //rechaza ""1.5" y "-1" y "abc"
  if (value === null || !/^\d+$/.test(value)) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    return fallback;
  }

  return parsed;
}

function readEnum<T extends string>(
  value: string | null,
  values: readonly T[],
  fallback: T,
): T {
  return values.find((candidate) => candidate === value) ?? fallback;
}

export function readParams(search: URLSearchParams): TicketListParams {
  const q = search.get("q") ?? DEFAULTS.q;
  return {
    offset: readInteger(search.get("offset"), 0, 2147483647, DEFAULTS.offset),
    limit: readInteger(search.get("limit"), 1, 100, DEFAULTS.limit),
    q: Array.from(q).length <= 200 ? q : DEFAULTS.q,
    state: readEnum(search.get("state"), STATES, DEFAULTS.state),
    severity: readEnum(search.get("severity"), SEVERITIES, DEFAULTS.severity),
    sort: readEnum(search.get("sort"), SORTS, DEFAULTS.sort),
    direction: readEnum(
      search.get("direction"),
      DIRECTIONS,
      DEFAULTS.direction,
    ),
  };
}

export function writeParams(
  search: URLSearchParams,
  params: TicketListParams,
): URLSearchParams {
  const next = new URLSearchParams(search);

  for (const key of PARAM_KEYS) {
    const isDefault = params[key] === DEFAULTS[key];

    if (isDefault) {
      next.delete(key);
    } else {
      next.set(key, String(params[key]));
    }
  }

  return next;
}
