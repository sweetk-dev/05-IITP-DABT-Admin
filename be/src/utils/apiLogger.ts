import { appLogger } from './logger';

export type ApiMapEntry = {
  params?: string;
  query?: string;
  body?: string;
  res: string;
  description?: string;
};

export type ApiMappingTable = Record<string, ApiMapEntry>;

export function logApiCall(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  mappingTable: ApiMappingTable,
  fallbackDescription: string,
  extraMeta?: Record<string, any>
): ApiMapEntry | undefined {
  const key = `${method} ${url}`;
  const mapping = mappingTable[key];
  appLogger.info(`API 호출: ${mapping?.description || fallbackDescription}`, {
    paramsType: mapping?.params,
    queryType: mapping?.query,
    bodyType: mapping?.body,
    responseType: mapping?.res,
    ...extraMeta,
  });
  return mapping;
}


