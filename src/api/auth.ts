import request from '@/utils/request'
import md5 from 'md5' 

import Cookies from 'js-cookie'
const TokenKey = 'Token'
import { Login } from './apiConfig'
import { type } from 'os'

type Feature={
  userAccount:string,
  password:string,
  identification:string,
  rememberMe:string
}

export function login({ userAccount, password, identification, rememberMe='on'}:Feature) {
  return request({
    url: Login.yxAdminLogin,
    method: 'post',
    data: {
      userAccount: userAccount,
      password: md5(password),
      identification: identification,
      rememberMe: rememberMe
    }
  })
}

export function getUserInfo() {
  return request({
    url: Login.getYxUserInfo,
    method: 'post'
  })
}

export function logout() {
  return request({
    url: Login.adminLogout,
    method: 'post'
  })
}

export function getToken() {
  return Cookies.get(TokenKey)
}
