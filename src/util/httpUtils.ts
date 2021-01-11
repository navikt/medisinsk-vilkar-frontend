import RequestPayload from '../types/RequestPayload';

export function fetchData<T>(url: string, requestInit?: RequestInit): Promise<T> {
    return fetch(url, requestInit).then((response: Response) => response.json());
}

export function submitData<T>(url: string, method: string, body: RequestPayload, abortSignal?: AbortSignal) {
    return fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: abortSignal,
    });
}
