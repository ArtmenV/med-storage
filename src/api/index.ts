import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import queryString from 'query-string';

import { API_BASE_URL } from 'config';

class Api {
    instance: AxiosInstance;

    constructor(baseUrl: string) {
        this.instance = axios.create({
            baseURL: baseUrl,
            withCredentials: false,
            headers: {
                post: { 'Content-Type': 'application/json' },
                put: { 'Content-Type': 'application/json' },
            },
        });
    }

    get<T, R = AxiosResponse<T>>(path: string, query?: object, config?: AxiosRequestConfig): Promise<R> {
        return this.instance.get(`${path}?${queryString.stringify({
            ...query,
        })}`, config);
    }

    post<T, R = AxiosResponse<T>>(path: string, data: object, config?: AxiosRequestConfig): Promise<R> {
        return this.instance.post(path, data, config);
    }

    patch<T, R = AxiosResponse<T>>(path: string, data: object, config?: AxiosRequestConfig): Promise<R> {
        return this.instance.patch(path, data, config);
    }

    put<T, R = AxiosResponse<T>>(path: string, data: object, config?: AxiosRequestConfig): Promise<R> {
        return this.instance.put(path, data, config);
    }

    delete<T, R = AxiosResponse<T>>(path: string, data: object, config?: AxiosRequestConfig): Promise<R> {
        return this.instance.delete(path, {
            ...config,
            data,
        });
    }
}

export default new Api(API_BASE_URL);
