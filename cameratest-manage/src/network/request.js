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

export function getRequest(url, parms) {
  lanjie()
  return instance.get(url, parms)
}

export function postRequest(url, data) {
  lanjie()

  return instance.post(url, data)
}

function lanjie(){
  ///请求拦截器
  instance.interceptors.request.use(config => {
    store.commit('getToken')
    config.headers.Authorization = store.state.user.token
    console.log('请求拦截器'+store.state.user.token);
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

