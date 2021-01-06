import request from '@/utils/request'
// 总后台科目分类列表信息接口
export function getAppointsList(query) {
  return request({
    url: 'http://127.0.0.1:7001/admin/appoint/list?page=' + query,
    method: 'get',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      page: query
    }
  })
}
export function getAppointsListForType(page, types) {
  return request({
    url: 'http://127.0.0.1:7001/admin/appoint/list?page=' + page + '&types=' + types,
    method: 'get',
    page
  })
}
