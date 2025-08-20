import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { ROUTES } from "../utils/constants/routeConstants";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
const subscribers: Array<(success: boolean) => void> = [];

function notifySubscribers(success: boolean) {
  subscribers.splice(0).forEach(cb => cb(success));
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: AxiosRequestConfig }) => {
    const originalRequest = error.config!;

    if (originalRequest.url?.includes(ROUTES.REFRESH_TOKEN)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribers.push((success) => {
            if (success) resolve(api(originalRequest));
            else reject(error);
          });
        });
      }

      isRefreshing = true;
      try {
        await api.post(ROUTES.REFRESH_TOKEN, {}, { withCredentials: true });
        notifySubscribers(true);
        return api(originalRequest);
      } catch (refreshErr) {
        notifySubscribers(false);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
