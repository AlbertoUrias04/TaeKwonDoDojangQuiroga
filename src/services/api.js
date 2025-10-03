import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5230",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Solo redirigir si NO estamos en la página de login
            if (!window.location.pathname.includes("/login")) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;