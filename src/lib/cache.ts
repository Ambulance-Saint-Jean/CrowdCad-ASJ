// lib/cache.ts

const CACHE_TTL = 60 * 60 * 1000; // 5 minutes

export function getCached<T>(key: string): T | null {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const { data, ts } = JSON.parse(raw);
        if (Date.now() - ts > CACHE_TTL) {
            localStorage.removeItem(key);
            return null;
        }
        return data as T;
    } catch {
        return null;
    }
}

export function setCache<T>(key: string, data: T): void {
    try {
        localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
    } catch { }
}