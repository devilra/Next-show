import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 vanthaal local storage mattum clear pannunga.
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("nextShow_admin");
    }
    return Promise.reject(error);
  },
);

export default api;
