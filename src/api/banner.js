import request from '@/utils/request'
// 总后台banner获取接口
export function banners() {
  return request({
    url: 'http://127.0.0.1:7001/admin/banner/list',
    method: 'GET',
    header: {
      'Content-Type': 'application/json'
    }
  })
}
// 总后台banner创建接口
export function createbanners(data) {
  return request({
    url: 'http://127.0.0.1:7001/admin/banner/create',
    method: 'POST',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
}
// 总后台banner删除接口
export function delbanners(data) {
  return request({
    url: 'http://127.0.0.1:7001/admin/banner/del',
    method: 'DELETE',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      sequence: data
    }
  })
}
