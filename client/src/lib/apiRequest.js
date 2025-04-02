import axios from "axios";

const apiRequest = axios.create({
  baseURL: process.env.VITE_API_REQUEST,
  withCredentials: true,
});

export default apiRequest;