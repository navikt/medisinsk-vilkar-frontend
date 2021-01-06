export function fetchData<T>(url: string, requestInit?: RequestInit): Promise<T> {
    return fetch(url, requestInit).then((response: Response) => response.json());
}
