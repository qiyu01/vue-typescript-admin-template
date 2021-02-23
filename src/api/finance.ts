import request from '@/utils/request'
import { Finance } from './apiConfig'

export function getTrendChartInfo(data:any) {
  return request({
    url: Finance.getTrendChartInfo,
    method: 'post',
    data
  })
}
export function getFinanceSummaryInfo(data?:any) {
  return request({
    url: Finance.getFinanceSummaryInfo,
    method: 'post',
    data
  })
}
export function getYxStoreFinanceInfo(data?:any) {
  return request({
    url: Finance.getYxStoreFinanceInfo,
    method: 'post',
    data
  })
}
export function getYxStoreBillInfo(data?:any) {
  return request({
    url: Finance.getYxStoreBillInfo,
    method: 'post',
    data
  })
}
export function getYxStoreBillDetailInfo(data?:any) {
  return request({
    url: Finance.getYxStoreBillDetailInfo,
    method: 'post',
    data
  })
}

