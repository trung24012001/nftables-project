import Axios, { AxiosRequestConfig } from "axios";

function authRequestInterceptor(config: AxiosRequestConfig) {
  // const _token = localStorage.getItem('user-token')
  // if (_token && _token !== 'undefined' && config.headers) {
  //   const token = JSON.parse(_token)
  //   config.headers.authorization = `Bearer ${token.access_token}`
  // }
  return config;
}

console.log(process.env.REACT_APP_SERVICE_URL);

export const request = Axios.create({
  baseURL: process.env.REACT_APP_SERVICE_URL,
});

request.interceptors.request.use(authRequestInterceptor);
