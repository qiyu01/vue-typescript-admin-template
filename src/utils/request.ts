import axios from 'axios'
import Qs from 'qs'
import { Message, MessageBox } from 'element-ui'
import { IDefaultParams } from '@/api/types'
import { UserModule } from '@/store/modules/user'
import {getToken} from './cookies'
import _ from 'underscore'
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

export function downloadFileByAjax(params:any) {
  // 直接下载文件 文件需要设置Access-Control-Allow-Origin
  /* params参数
    *url 请求文件的地址
    method:请求的方法 GET POST 默认为GET
    fileName : 输出文件名称
    fileType : 输出文件的类型this:any,
    data : post请求需要传的参数  用于send(),
    callback : 获取本地href后回调
  */
  const defaultParams = {
    method: 'GET'
  }
  params = _.extend(defaultParams, params)
  return new Promise(function(resolve:any, reject:any) {
    let req:any = null
    req = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
    req.open(params.method, params.url)
    if (params.method.toLowerCase() === 'post') {
      req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    }
    req.responseType = 'blob' // 这一句很重要 返回的response是Blob对象,否则是字符串
    req.onreadystatechange = function() {
      if (req.status === 200 && req.readyState === 4) {
        if (params.emptyCallback && req.response.size === 0) { // 如果数据为空，且存在为空时的回调
          params.emptyCallback()
          if (params.completeCallback) {
            params.completeCallback()
          }
          return
        }
        console.log(params.fileType)

        const blob = new Blob([req.response], { type: params.fileType })
        const href = window.URL.createObjectURL(blob)
        if (params.callback) {
          params.callback(href)
          resolve()
        } else {
          const link = document.createElement('a')
          link.href = href
          link.download = params.fileName
          link.click()
          resolve()
        }

        if (params.completeCallback) {
          params.completeCallback()
        }
      } else if (req.readyState === 4) {
        if (params.completeCallback) {
          params.completeCallback()
        }
      }
    }
    if (params.data) {
      req.send(JSON.stringify(params.data))
    } else {
      req.send(null)
    }
  })
}
