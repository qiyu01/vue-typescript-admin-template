import request from '@/utils/request'
import { StoreActivity } from './apiConfig'

export function activityDetail(data:any) {
  return request({
    url: StoreActivity.activityDetail,
    method: 'post',
    data
  })
}
export function getPlanProduct(data:any) {
  return request({
    url: StoreActivity.getPlanProduct,
    method: 'post',
    data
  })
}
export function getProducts(data:any) {
  return request({
    url: StoreActivity.getProducts,
    method: 'post',
    data
  })
}
export function deletProduct(data:any) {
  return request({
    url: StoreActivity.deletProduct,
    method: 'post',
    data
  })
}
export function getStorePlan(data:any) {
  return request({
    url: StoreActivity.getStorePlan,
    method: 'post',
    data
  })
}
export function getStores() {
  return request({
    url: StoreActivity.getStores,
    method: 'post'
  })
}
export function addStores(data:any) {
  return request({
    url: StoreActivity.addStores,
    method: 'post',
    data
  })
}
export function deletStore(data:any) {
  return request({
    url: StoreActivity.deletStore,
    method: 'post',
    data
  })
}
export function saveStoreAct(data:any) {
  return request({
    url: StoreActivity.saveStoreAct,
    method: 'post',
    data
  })
}
export function addStoreAct(data:any) {
  return request({
    url: StoreActivity.addStoreAct,
    method: 'post',
    data
  })
}
export function endActivity(data:any) {
  return request({
    url: StoreActivity.endActivity,
    method: 'post',
    data
  })
}
export function getQiNiuPicToken() {
  return request({
    url: StoreActivity.getQiNiuPicToken,
    method: 'post'
  })
}
