export default function normalizeRole(value: unknown): string {

    const rawValue = typeof value === "string" ? value : value && typeof value === "object" ? ((value as { name?: unknown; code?: unknown }).name ?? (value as { name?: unknown; code?: unknown }).code) : "";

    return typeof rawValue === "string" ? rawValue.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ") : "";

};