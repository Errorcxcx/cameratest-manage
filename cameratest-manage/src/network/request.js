import axios from 'axios'


const instance = axios.create({
  timeout:3000,
  baseURL:'http://127.0.0.1:8888/api/private/v1/'
})
export function  request(config) {
  //请求拦截器
  instance.interceptors.request.use(config=>{
    return config;
  },err=>{
    return Promise.reject(err)
  })

  //响应拦截器
  instance.interceptors.response.use(response =>{
    let res = {}
    res.status = response.status
    res.data = response.data
    return res
    },err => {
      return Promise.reject(err)
    }

  )

  return instance(config)

}
export  function getRequest(url,config){
  return instance.get(url,config)
}
export  function postRequest(url,data){
  return instance.post(url,data)
}
