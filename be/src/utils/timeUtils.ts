

export function toIsoString(value?: Date | string | number): string | undefined {
    if (!value) return undefined;
    const d = value instanceof Date ? value : new Date(value);
    return d.toISOString();
}