export function getStringQuery(query: unknown, key: string): string | undefined {
	const v = (query as any)?.[key];
	return typeof v === 'string' && v.length > 0 ? v : undefined;
}

export function getNumberQuery(query: unknown, key: string, defaultValue?: number): number | undefined {
	const v = (query as any)?.[key];
	if (typeof v === 'string') {
		const n = parseInt(v, 10);
		if (!Number.isNaN(n)) return n;
	}
	return defaultValue;
}

export function getBooleanQuery(query: unknown, key: string, defaultValue?: boolean): boolean | undefined {
	const v = (query as any)?.[key];
	if (typeof v === 'string') {
		if (v.toLowerCase() === 'true') return true;
		if (v.toLowerCase() === 'false') return false;
	}
	return defaultValue;
}


