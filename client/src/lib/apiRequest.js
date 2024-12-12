import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://3.38.208.101:8800/api",
  withCredentials: true,
});

export default apiRequest;