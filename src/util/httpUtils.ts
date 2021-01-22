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

export async function submitData<T>(url: string, body: T, abortSignal?: AbortSignal): Promise<T> {
    try {
        const response: Response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            signal: abortSignal,
        });
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

export async function deleteData<T>(url: string, abortSignal?: AbortSignal): Promise<T> {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: abortSignal,
        });
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
