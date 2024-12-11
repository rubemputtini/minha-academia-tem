import axios from "axios";
import { API_URL } from "../utils/constants";
import { getToken, clearToken } from "./auth";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearToken();
            console.error('Sessão expirada. Faça login novamente.');
        }
        return Promise.reject(error);
    }
);

export default api;