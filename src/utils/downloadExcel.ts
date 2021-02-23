import { getToken } from '@/utils/cookies'
import { downloadFileByAjax } from '@/utils/request'

export const downloadExcel = (url:string, fileName:string, emptyCb:string, completeCb:string) => {
  let downloadUrl = url
  if (downloadUrl.indexOf('?') != -1) {
    downloadUrl = downloadUrl + `&token=${getToken()}`
  } else {
    downloadUrl = downloadUrl + `?token=${getToken()}`
  }
  downloadFileByAjax({
    url: downloadUrl,
    method: 'GET',
    fileName: fileName,
    emptyCallback: emptyCb,
    completeCallback: completeCb
  })
}
