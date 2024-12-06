import axios from "axios";

const DOMAIN = "https://zolachat.io.vn/api/";

export const axiosInstance = axios.create({
  baseURL: DOMAIN,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_Token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("error", error);
    // if (error.response.status === 401) {
    //   console.log("Clearing local storage");
    //   localStorage.clear();
    //   window.location.reload();
    // }
    return Promise.reject(error);
  }
);
