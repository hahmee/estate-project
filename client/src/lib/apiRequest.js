import axios from "axios";

const apiRequest = axios.create({
  baseURL: process.env.VITE_API_REQUEST,
  withCredentials: true, //  자동으로 쿠키를 포함
});

export default apiRequest;