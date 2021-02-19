import request from '@/utils/request'
import { Shop } from './apiConfig'

export function getIdNameList() {
  return request({
    url: Shop.getYxStoreIdAndName,
    method: 'post'
  })
}

