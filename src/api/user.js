import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://127.0.0.1:7001/admin/login',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      name: data.username,
      password: data.password

    }
  })
}

export function getInfo(token) {
  return request({
    url: 'http://127.0.0.1:7001/admin/information',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
