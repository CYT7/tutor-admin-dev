import request from '@/utils/request'
// 总dashBoard接口
export function index() {
  return request({
    url: 'http://127.0.0.1:7001/admin/index',
    method: 'get',
    header: {
      'Content-Type': 'application/json'
    }
  })
}
