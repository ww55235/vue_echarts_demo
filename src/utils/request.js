import axios from "axios";
const server = axios.create({
  //公共的路径
  baseURL: process.env.VUE_APP_BASEURL,
  //请求超时
  timeout: 5000
});

server.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

server.interceptors.response.use(
  res => {
    if (res.data.code === 200) {
      return JSON.parse(res.data.data);
    } else {
    }
  },
  err => {
    return Promise.reject(err);
  }
);

export default server;
