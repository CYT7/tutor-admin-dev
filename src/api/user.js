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
// 用户信息接口
export function user(query) {
  return request({
    url: 'http://127.0.0.1:7001/admin/user/list?page=' + query,
    method: 'GET',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      page: query
    }
  })
}
// 老师信息接口
export function teacher(query) {
  return request({
    url: 'http://127.0.0.1:7001/admin/teacher/list?page=' + query,
    method: 'GET',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      page: query
    }
  })
}
// 老师审核通过接口
export function Agree(id) {
  return request({
    url: 'http://127.0.0.1:7001/admin/teacher/agree',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      id: id
    }
  })
}
// 老师审核不通过接口
export function Disagree(id) {
  return request({
    url: 'http://127.0.0.1:7001/admin/teacher/disagree',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      id: id
    }
  })
}
