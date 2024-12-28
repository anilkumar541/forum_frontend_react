import axios from "axios";

const base_url= import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance
const api = axios.create({
    baseURL: base_url, // Backend API base URL
    timeout: 10000,
});

// Attach access token to every request
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors and token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If access token is expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");
                // Request a new access token using the refresh token
                const { data } = await axios.post(`${base_url}/token/refresh/`, {
                    refresh: refreshToken,
                });

                // Save the new access token
                localStorage.setItem("access_token", data.access);

                // Update the failed request's authorization header and retry
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return api(originalRequest);
            } catch (err) {
                console.error("Refresh token is invalid", err);

                // Clear tokens and redirect to login
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login"; // Optional: Redirect user to login page
            }
        }

        return Promise.reject(error);
    }
);

export default api;
