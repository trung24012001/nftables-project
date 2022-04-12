import Axios, { AxiosRequestConfig } from "axios";
import { serviceURL } from "./config";

function authRequestInterceptor(config: AxiosRequestConfig) {
  // const _token = localStorage.getItem('user-token')

  // if (_token && _token !== 'undefined' && config.headers) {
  //   const token = JSON.parse(_token)
  //   config.headers.authorization = `Bearer ${token.access_token}`
  // }

  return config;
}

export const request = Axios.create({
  baseURL: serviceURL,
});

request.interceptors.request.use(authRequestInterceptor);
