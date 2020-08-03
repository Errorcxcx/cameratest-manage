import axios from 'axios'
import store from '../store/index'

const instance = axios.create({
  timeout: 3000,
  baseURL: 'http://127.0.0.1:8888/api/private/v1/'
})

export function request(config) {

  lanjie()
  return instance(config)

}

export function getRequest(url, config) {
  lanjie()
  return instance.get(url, config)
}

export function postRequest(url, data) {
  lanjie()

  return instance.post(url, data)
}
export function putRequest(url) {
  lanjie()
  return instance.put(url)
}

function lanjie(){
  ///请求拦截器
  instance.interceptors.request.use(config => {
    store.commit('getToken')
    config.headers.Authorization = store.state.user.token
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
}

