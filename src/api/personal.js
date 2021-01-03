import request from '@/utils/request'

// 后台管理员个人信息接口
export function profile() {
  return request({
    url: 'http://127.0.0.1:7001/admin/information',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    }
  })
}
// 后台管理员个人信息修改接口
export function modification(data) {
  return request({
    url: 'http://127.0.0.1:7001/admin/information',
    method: 'PUT',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      realname: data.realname
    }
  })
}
