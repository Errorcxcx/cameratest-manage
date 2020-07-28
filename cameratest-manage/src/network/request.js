import axios from 'axios'



export function  request(config) {
  const instance = axios.create({
    timeout:3000
  })

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
