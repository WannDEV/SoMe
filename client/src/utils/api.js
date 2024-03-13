import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:2000/",
  withCredentials: true,
});

// intercept response and check if user is authenticated
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // prevent infinite loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
