import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://ec2-3-38-208-101.ap-northeast-2.compute.amazonaws.com:8800/api",
  // baseURL: "http://localhost:8800/api",
  withCredentials: true,
});

export default apiRequest;