import type { PropsWithChildren } from "react";
import { act, renderHook } from "@testing-library/react";
import {
  MemoryRouter,
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router-dom";
import { describe, expect, it } from "vitest";
import { useTicketListParams } from "./useTicketListParams";

const defaults = {
  offset: 0,
  limit: 20,
  q: "",
  state: "ALL",
  severity: "ALL",
  sort: "LAST_MODIFIED",
  direction: "DESC",
};

function setup(entries = ["/tickets"]) {
  function Wrapper({ children }: PropsWithChildren) {
    return <MemoryRouter initialEntries={entries}>{children}</MemoryRouter>;
  }

  return renderHook(
    () => ({
      ...useTicketListParams(),
      location: useLocation(),
      navigate: useNavigate(),
      navigationType: useNavigationType(),
    }),
    { wrapper: Wrapper },
  );
}

describe("useTicketListParams", () => {
  it("usa los defaults cuando la URL está vacía", () => {
    const { result } = setup();

    expect(result.current.params).toEqual(defaults);
    expect(result.current.location.search).toBe("");
  });

  it("lee los parámetros válidos de la URL", () => {
    const { result } = setup([
      "/tickets?offset=40&limit=50&q=payments&state=IN_PROGRESS&severity=HIGH&sort=TARGET_DATE&direction=ASC",
    ]);

    expect(result.current.params).toEqual({
      offset: 40,
      limit: 50,
      q: "payments",
      state: "IN_PROGRESS",
      severity: "HIGH",
      sort: "TARGET_DATE",
      direction: "ASC",
    });
  });

  it("corrige valores inválidos sin añadir pasos al historial", () => {
    const { result } = setup([
      "/before",
      `/tickets?offset=20abc&limit=101&state=UNKNOWN&severity=URGENT&sort=INVALID&direction=INVALID&q=${"x".repeat(201)}`,
    ]);

    expect(result.current.params).toEqual(defaults);
    expect(result.current.location.search).toBe("");
    expect(result.current.navigationType).toBe("REPLACE");

    act(() => result.current.navigate(-1));
    expect(result.current.location.pathname).toBe("/before");
  });

  it("omite los defaults y conserva parámetros ajenos", () => {
    const { result } = setup([
      "/tickets?offset=0&limit=20&q=&state=ALL&severity=ALL&sort=LAST_MODIFIED&direction=DESC&tab=list",
    ]);

    expect(result.current.params).toEqual(defaults);
    expect(result.current.location.search).toBe("?tab=list");
  });

  it("setFilters cambia el filtro y vuelve a la primera página", () => {
    const { result } = setup(["/tickets?offset=40&q=payments&severity=HIGH"]);

    act(() => result.current.setFilters({ state: "REPORTED" }));

    expect(result.current.params).toEqual({
      ...defaults,
      q: "payments",
      severity: "HIGH",
      state: "REPORTED",
      offset: 0,
    });
  });

  it("setPage cambia la página y conserva los filtros", () => {
    const { result } = setup(["/tickets?limit=50&q=payments&state=DONE"]);

    act(() => result.current.setPage(40));

    expect(result.current.params).toEqual({
      ...defaults,
      limit: 50,
      q: "payments",
      state: "DONE",
      offset: 40,
    });
  });

  it("reset restaura los defaults y conserva parámetros ajenos", () => {
    const { result } = setup([
      "/tickets?offset=40&limit=50&q=payments&state=DONE&tab=list",
    ]);

    act(() => result.current.reset());

    expect(result.current.params).toEqual(defaults);
    expect(result.current.location.search).toBe("?tab=list");
  });

  it("recupera los filtros al navegar atrás y adelante", () => {
    const { result } = setup();

    act(() => result.current.setFilters({ state: "REPORTED" }));
    act(() => result.current.setPage(40));

    act(() => result.current.navigate(-1));
    expect(result.current.params.state).toBe("REPORTED");
    expect(result.current.params.offset).toBe(0);

    act(() => result.current.navigate(1));
    expect(result.current.params.state).toBe("REPORTED");
    expect(result.current.params.offset).toBe(40);
  });
});
