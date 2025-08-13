import type { AdminOpenApiKeyItem, UserOpenApiKeyItem } from '@iitp-dabt/common';
import type { OpenApiAuthKey } from '../models/openApiAuthKey';

function toIsoString(value?: Date | string | number): string | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString();
}

export function toAdminOpenApiKeyItem(k: OpenApiAuthKey): AdminOpenApiKeyItem {
  return {
    keyId: (k as any).keyId ?? (k as any).apiId,
    userId: (k as any).userId,
    authKey: (k as any).authKey || '',
    activeYn: (k as any).activeYn ?? ((k as any).status ? ((k as any).status === 'ACTIVE' ? 'Y' : 'N') : 'N'),
    startDt: toIsoString((k as any).startDt),
    endDt: toIsoString((k as any).endDt),
    delYn: (k as any).delYn ?? 'N',
    keyName: (k as any).keyName,
    keyDesc: (k as any).keyDesc,
    activeAt: toIsoString((k as any).activeAt) ?? (((k as any).status === 'ACTIVE') ? toIsoString((k as any).updatedAt) : undefined),
    latestAccAt: toIsoString((k as any).latestAccAt),
    createdAt: toIsoString((k as any).createdAt)!,
    updatedAt: toIsoString((k as any).updatedAt),
    deletedAt: toIsoString((k as any).deletedAt),
    createdBy: ((k as any).createdBy?.toString?.()) || '',
    updatedBy: (k as any).updatedBy?.toString?.(),
    deletedBy: (k as any).deletedBy?.toString?.()
  };
}

export function toUserOpenApiKeyItem(k: OpenApiAuthKey): UserOpenApiKeyItem {
  return {
    keyId: (k as any).keyId,
    authKey: (k as any).authKey,
    activeYn: (k as any).activeYn,
    startDt: toIsoString((k as any).startDt)?.split('T')[0],
    endDt: toIsoString((k as any).endDt)?.split('T')[0],
    keyName: (k as any).keyName,
    keyDesc: (k as any).keyDesc,
    activeAt: toIsoString((k as any).activeAt),
    latestAccAt: toIsoString((k as any).latestAccAt),
    createdAt: toIsoString((k as any).createdAt)!,
    updatedAt: toIsoString((k as any).updatedAt)
  };
}


