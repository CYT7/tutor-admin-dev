import request from '@/utils/request'
// 总后台科目分类列表信息接口
export function getNeedList(query) {
  return request({
    url: 'http://127.0.0.1:7001/admin/need/list?page=' + query,
    method: 'get',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      page: query
    }
  })
}
export function getNeedListForType(page, types) {
  return request({
    url: 'http://127.0.0.1:7001/admin/need/list?page=' + page + '&types=' + types,
    method: 'get',
    page
  })
}
// 总后台科目分类列表信息接口
export function agreeNeed(id) {
  return request({
    url: 'http://127.0.0.1:7001/admin/need/agree',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      id: id
    }
  })
}
// 总后台科目分类列表信息接口
export function disagreeNeed(id) {
  return request({
    url: 'http://127.0.0.1:7001/admin/need/disagree',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      id: id
    }
  })
}
