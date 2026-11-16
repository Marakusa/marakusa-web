export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const res = await fetch(input, init);
    const text = await res.text();

    let data: unknown = null;
    if (text) {
        try { data = JSON.parse(text); } catch { /* not JSON (proxy error page, etc.) */ }
    }

    if (!res.ok) {
        const body = data as { message?: string; error?: string } | null;
        const message = body?.message ?? body?.error
            ?? (res.status === 429 ? 'Too many requests, please try again later.' : `Request failed (${res.status})`);
        throw new ApiError(message, res.status);
    }
    return data as T;
}