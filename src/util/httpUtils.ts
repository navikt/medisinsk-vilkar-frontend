import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export async function get<T>(url: string, requestConfig?: AxiosRequestConfig): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axios.get(url, requestConfig);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export async function post<T>(url: string, body: T, requestConfig?: AxiosRequestConfig): Promise<any> {
    try {
        const response: AxiosResponse = await axios.post(url, body, requestConfig);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}
