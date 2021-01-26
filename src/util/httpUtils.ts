import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export async function fetchData<T>(url: string, requestConfig?: AxiosRequestConfig): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axios.get(url, requestConfig);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export async function submitData<T>(url: string, body: T, requestConfig?: AxiosRequestConfig): Promise<T> {
    try {
        const response: AxiosResponse = await axios.post(url, body, requestConfig);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export async function deleteData<T>(url: string, requestConfig?: AxiosRequestConfig): Promise<T> {
    try {
        const response = await axios.delete(url, requestConfig);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}
