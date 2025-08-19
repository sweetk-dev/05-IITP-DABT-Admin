export type OpenApiKeyStatus = 'pending' | 'active' | 'expired';

export interface OpenApiKeyLike {
  activeYn?: string;
  endDt?: string | Date | null | undefined;
}

// Rule:
// - activeYn === 'N' => 'pending' (approval pending)
// - activeYn === 'Y' => 'expired' if endDt < now, otherwise 'active'
export function getOpenApiKeyStatus(key: OpenApiKeyLike, now: Date = new Date()): OpenApiKeyStatus {
  if (!key || key.activeYn !== 'Y') {
    return 'pending';
  }
  const end = key.endDt ? new Date(key.endDt) : null;
  if (end && end < now) {
    return 'expired';
  }
  return 'active';
}


