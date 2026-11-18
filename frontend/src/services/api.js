
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("passentry_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Let the browser set the multipart boundary for FormData
        if (
            typeof FormData !== "undefined" &&
            config.data instanceof FormData
        ) {
            config.headers.delete?.("Content-Type");
            delete config.headers["Content-Type"];
        }

        return config;
    },

    (error) => Promise.reject(error)
);

export default api;
