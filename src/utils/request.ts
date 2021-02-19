import axios from 'axios'
import Qs from 'qs'
import { Message, MessageBox } from 'element-ui'
import { IDefaultParams } from '@/api/types'
import { UserModule } from '@/store/modules/user'
import {getToken} from './cookies'
import router from '@/router/index'
import store from '@/store'

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['X-Access-Token'] = UserModule.token
    }

    if (config.data === undefined) {
      config.data = {}
    }

    const defaultParams:IDefaultParams = {
      platform: 'linyao-select-store-admin',
      version: '1.0.0',
      ua: navigator.userAgent + ' ' + getBrowserVersion()
      // ex: "202006211913" + ((router.currentRoute && router.currentRoute.name) || "")
    }

    config.data = Object.assign(defaultParams, config.data)
    if (config.method === 'post') {
      if (getToken() && !config.data.token) {
        config.data.token = getToken()
      }
    }

    if (config.method === 'get') {
      // get请求 数据字段使用params
      config.params = {
        ...config.data,
        ...config.params
      }
      if (getToken() && !config.data.token) {
        config.params.token = getToken()
        config.data.token = getToken()
      }
      config.paramsSerializer = function(params) {
        return Qs.stringify(params, {
          arrayFormat: 'repeat'
        })
      }
    }

    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    // Some example codes here:
    // code == 20000: success
    // code == 50001: invalid access token
    // code == 50002: already login in other place
    // code == 50003: access token expired
    // code == 50004: invalid user (user not exist)
    // code == 50005: username or password is incorrect
    // You can change this part for your own usage.

    if (!('code' in response.data)) {
      const disposition = decodeURIComponent(response.headers['content-disposition'])
      const fileName = disposition ? disposition.split('filename=')[1] : ''
      return {
        data: response.data,
        fileType: response.headers['content-type'],
        fileName: fileName
      }
    }

    const res = response.data
    if (res.code !== '40001') {
      if (res.code === '40020') {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(async () => {
          await UserModule.LogOut();
          router.push('/login')
          
        })
      } else {
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(res)
    } else {
      return response.data
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

function getBrowserVersion() { // 获取浏览器版本信息
  var userAgent:any = navigator.userAgent // 取得浏览器的userAgent字符串
  var version = ''

  if (userAgent.indexOf('Firefox') > -1) {
    if (userAgent.match(/firefox\/[\d.]+/gi) && userAgent.match(/firefox\/[\d.]+/gi)[0].match(/[\d]+/)) {
      version = userAgent.match(/firefox\/[\d.]+/gi)[0].match(/[\d]+/)[0]
    }
    return 'Firefox ' + version
  } else if (userAgent.indexOf('Edge') > -1) {
    if (userAgent.match(/edge\/[\d.]+/gi) && userAgent.match(/edge\/[\d.]+/gi)[0].match(/[\d]+/)) {
      version = userAgent.match(/edge\/[\d.]+/gi)[0].match(/[\d]+/)[0]
    }
    return 'Edge ' + version
  } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    if (userAgent.indexOf('Opera') > -1) {
      if (userAgent.match(/opera\/[\d.]+/gi) && userAgent.match(/opera\/[\d.]+/gi)[0].match(/[\d]+/)) {
        version = userAgent.match(/opera\/[\d.]+/gi)[0].match(/[\d]+/)[0]
      }
      return 'Opera ' + version
    }
    if (userAgent.indexOf('OPR') > -1) {
      if (userAgent.match(/opr\/[\d.]+/gi) && userAgent.match(/opr\/[\d.]+/gi)[0].match(/[\d]+/)) {
        version = userAgent.match(/opr\/[\d.]+/gi)[0].match(/[\d]+/)[0]
      }
      return 'Opera ' + version
    }
  } else if (userAgent.indexOf('Chrome') > -1) {
    if (userAgent.match(/chrome\/[\d.]+/gi) && userAgent.match(/chrome\/[\d.]+/gi)[0].match(/[\d]+/)) {
      version = userAgent.match(/chrome\/[\d.]+/gi)[0].match(/[\d]+/)[0]
    }
    return 'Chrome ' + version
  } else if (userAgent.indexOf('Safari') > -1) {
    if (userAgent.match(/safari\/[\d.]+/gi) && userAgent.match(/safari\/[\d.]+/gi)[0].match(/[\d]+/)) {
      version = userAgent.match(/safari\/[\d.]+/gi)[0].match(/[\d]+/)[0]
    }
    return 'Safari ' + version
  } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
    if (userAgent.indexOf('MSIE') > -1) {
      if (userAgent.match(/msie [\d.]+/gi) && userAgent.match(/msie [\d.]+/gi)[0].match(/[\d]+/)) {
        version = userAgent.match(/msie [\d.]+/gi)[0].match(/[\d]+/)[0]
      }
      return 'IE ' + version
    }
    if (userAgent.indexOf('Trident') > -1) {
      if (userAgent.match(/trident\/[\d.]+/gi) && userAgent.match(/trident\/[\d.]+/gi)[0].match(/[\d]+/) && userAgent.match(/trident\/[\d.]+/gi)[0].match(/[\d]+/)[0]) {
        var versionTrident = userAgent.match(/trident\/[\d.]+/gi)[0].match(/[\d]+/)[0]
        version = parseInt(versionTrident) + "4"
      }
      return 'IE ' + version
    }
  }
}



export default service
