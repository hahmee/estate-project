import axios from "axios";

const apiRequest = axios.create({
  // baseURL: "http://ec2-13-124-226-52.ap-northeast-2.compute.amazonaws.com:8800/api", //8800
  // baseURL: "http://localhost:8800/api",
  baseURL: '/api', // nginx에서 /api/로 프록시 설정
  withCredentials: true,
});

export default apiRequest;