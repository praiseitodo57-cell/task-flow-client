import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      localStorage.clear();

      // ONLY redirect if NOT on accept-invite page
      const isInvitePage =
        window.location.pathname.includes("accept-invite");

      if (!isInvitePage) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;