export function fetchData<T>(url: string, requestInit?: RequestInit): Promise<T> {
    return fetch(url, requestInit).then((response: Response) => response.json());
}

export function submitData<P>(url: string, method: string, body: P, abortSignal?: AbortSignal): Promise<Response> {
    return fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: abortSignal,
    });
}
