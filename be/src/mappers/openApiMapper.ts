import type { AdminOpenApiKeyItem, UserOpenApiKeyItem } from '@iitp-dabt/common';
import type { OpenApiAuthKeyAttributes } from '../models/openApiAuthKey';

function toIsoString(value?: Date | string | number): string | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString();
}

export type OpenApiSource = Pick<
  OpenApiAuthKeyAttributes,
  'keyId' | 'userId' | 'authKey' | 'activeYn' | 'startDt' | 'endDt' | 'delYn' | 'keyName' | 'keyDesc' | 'activeAt' | 'latestAccAt' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createdBy' | 'updatedBy' | 'deletedBy'
> & { status?: string };

export function toAdminOpenApiKeyItem(k: OpenApiSource): AdminOpenApiKeyItem {
  return {
    keyId: (k as any).keyId ?? (k as any).apiId,
    userId: k.userId,
    authKey: k.authKey || '',
    activeYn: k.activeYn ?? (k.status ? (k.status === 'ACTIVE' ? 'Y' : 'N') : 'N'),
    startDt: toIsoString(k.startDt),
    endDt: toIsoString(k.endDt),
    delYn: k.delYn ?? 'N',
    keyName: k.keyName,
    keyDesc: k.keyDesc,
    activeAt: toIsoString(k.activeAt) ?? (k.status === 'ACTIVE' ? toIsoString(k.updatedAt) : undefined),
    latestAccAt: toIsoString(k.latestAccAt),
    createdAt: toIsoString(k.createdAt)!,
    updatedAt: toIsoString(k.updatedAt),
    deletedAt: toIsoString(k.deletedAt),
    createdBy: k.createdBy?.toString?.() || '',
    updatedBy: k.updatedBy?.toString?.(),
    deletedBy: k.deletedBy?.toString?.()
  };
}

export function toUserOpenApiKeyItem(k: OpenApiSource): UserOpenApiKeyItem {
  return {
    keyId: k.keyId!,
    authKey: k.authKey,
    activeYn: k.activeYn,
    startDt: toIsoString(k.startDt)?.split('T')[0],
    endDt: toIsoString(k.endDt)?.split('T')[0],
    keyName: k.keyName,
    keyDesc: k.keyDesc,
    activeAt: toIsoString(k.activeAt),
    latestAccAt: toIsoString(k.latestAccAt),
    createdAt: toIsoString(k.createdAt)!,
    updatedAt: toIsoString(k.updatedAt)
  };
}


