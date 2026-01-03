import axios from "axios";

const api = axios.create({
  //baseURL: `http://localhost:5175/api`,
  baseURL: `https://amigowebster.in/nextshow_backend/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 vanthaal local storage mattum clear pannunga.
    // Redirect-ai inge thavirkkavum, ithu thaan loop-ku kaaranam.
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("nextShow_admin");
    }
    return Promise.reject(error);
  }
);

export default api;
