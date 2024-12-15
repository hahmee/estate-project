import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://ec2-13-124-226-52.ap-northeast-2.compute.amazonaws.com:8800/api", //8800
  // baseURL: "http://localhost:8800/api",
  withCredentials: true,
});

export default apiRequest;