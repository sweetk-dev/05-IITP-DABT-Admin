import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Primitive = string | number | boolean | null | undefined;
type QueryShape = Record<string, Primitive>;

function parseSearch(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  params.forEach((v, k) => { result[k] = v; });
  return result;
}

function buildSearch(next: QueryShape): string {
  const params = new URLSearchParams();
  Object.entries(next).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    params.set(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : '';
}

export function useQuerySync<T extends QueryShape>(state: T): {
  query: Record<string, string>;
  setQuery: (next: Partial<T>, options?: { replace?: boolean }) => void;
} {
  const location = useLocation();
  const navigate = useNavigate();

  const query = useMemo(() => parseSearch(location.search), [location.search]);

  const setQuery = (next: Partial<T>, options?: { replace?: boolean }) => {
    const merged = { ...query, ...Object.fromEntries(Object.entries(next).map(([k, v]) => [k, v ?? ''])) } as QueryShape;
    const s = buildSearch(merged);
    if (options?.replace) navigate(`${location.pathname}${s}`, { replace: true });
    else navigate(`${location.pathname}${s}`);
  };

  // keep initial URL in sync with provided defaults
  useEffect(() => {
    if (!location.search) {
      const s = buildSearch(state);
      if (s) navigate(`${location.pathname}${s}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { query, setQuery };
}


