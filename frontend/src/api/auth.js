import axiosInstance from "./axios.js";

export const loginRequest = (user) => axiosInstance.post(`/login`, user);

export const verifyTokenRequest = () => axiosInstance.get(`/verify`);
