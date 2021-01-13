export async function fetchData<T>(url: string, requestInit?: RequestInit): Promise<T> {
    try {
        const response: Response = await fetch(url, requestInit);
        const { status } = response;
        if (status > 299) {
            throw new Error(`Bad status code (${status})`);
        }
        try {
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Parsing JSON\n${error}`);
        }
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export function submitData<P>(url: string, body: P, abortSignal?: AbortSignal): Promise<Response> {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: abortSignal,
    });
}
