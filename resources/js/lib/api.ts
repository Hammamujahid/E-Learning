/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance,  AxiosResponse } from 'axios';
import { getToken, clearAuth, redirectToLogin } from './auth';

// ============================
// AXIOS INSTANCE
// ============================
export const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

// ============================
// REQUEST INTERCEPTOR (AUTO TOKEN)
// ============================
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ============================
// RESPONSE INTERCEPTOR (AUTO 401 + FORMAT ERROR)
// ============================
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const status = error.response?.status;

        if (status === 401) {
            clearAuth();
            redirectToLogin();
        }

        // Format error seragam — bisa langsung pakai error.status & error.data di catch
        error.status = status;
        (error as any).data = error.response?.data;

        return Promise.reject(error);
    }
);
