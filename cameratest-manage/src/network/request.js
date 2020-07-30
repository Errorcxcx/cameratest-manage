import axios from 'axios'
import store from '../store/index'

const instance = axios.create({
  timeout: 3000,
  baseURL: 'http://127.0.0.1:8888/api/private/v1/'
})

export function request(config) {


  return instance(config)

}

export function getRequest(url, config) {
  return instance.get(url, config)
}

export function postRequest(url, data) {
///请求拦截器
  instance.interceptors.request.use(config => {
    console.log(config);
    config.headers.Authorization = store.commit('getToken')
    return config;
  }, err => {
    return Promise.reject(err)
  })

//响应拦截器
  instance.interceptors.response.use(response => {
    let res = {}
    res.status = response.status
    res.data = response.data
    return res
  }, err => {
    return Promise.reject(err)
  })

  return instance.post(url, data)
}



