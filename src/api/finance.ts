import request from '@/utils/request'
import { Finance } from './apiConfig'

export function getTrendChartInfo(data:any) {
  return request({
    url: Finance.getTrendChartInfo,
    method: 'post',
    data
  })
}

