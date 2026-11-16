export class ApiError extends Error {
    status: number;
    retryAfterMs?: number;
    constructor(message: string, status: number, retryAfterMs?: number) {
        super(message);
        this.status = status;
        this.retryAfterMs = retryAfterMs;
    }
}

const parseRetryAfter = (value: string | null): number | undefined => {
    if (!value) return undefined;
    const seconds = Number(value);
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
    const date = Date.parse(value);                       // HTTP-date form
    return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
};

export async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const res = await fetch(input, init);
    const text = await res.text();

    let data: unknown = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            if (res.ok) throw new ApiError('Invalid JSON response', res.status);
        }
    }

    if (!res.ok) {
        const body = data as { message?: string; error?: string } | null;
        const message = body?.message ?? body?.error
            ?? (res.status === 429 ? 'Too many requests, please try again later.' : `Request failed (${res.status})`);
        throw new ApiError(message, res.status, parseRetryAfter(res.headers.get('Retry-After')));
    }
    return data as T;
}