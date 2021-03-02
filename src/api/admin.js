import request from '@/utils/request'
// 管理员信息（分页）
export function pagination(query) {
  return request({
    url: 'http://127.0.0.1:7001/admin/list?page=' + query,
    method: 'get',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      page: query
    }
  })
}

// 总后台管理员删除
export function Delete(data) {
  return request({
    url: 'http://127.0.0.1:7001/admin/delete',
    method: 'DELETE',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      id: data
    }
  })
}

// 总后台管理员创建
export function Create(data) {
  return request({
    url: 'http://127.0.0.1:7001/admin/create',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      name: data.name,
      password: data.password,
      realName: data.realName
    }
  })
}
// 总后台管理员信息修改
export function Modify(data) {
  return request({
    url: 'http://127.0.0.1:7001/admin/modify',
    method: 'PUT',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      id: data.id,
      password: data.password,
      realName: data.realName
    }
  })
}
// 总后台管理员禁用
export function Disable(data) {
  return request({
    url: 'http://127.0.0.1:7001/admin/disable',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      id: data
    }
  })
}
// 总后台管理员恢复
export function Recovery(data) {
  return request({
    url: 'http://127.0.0.1:7001/admin/recovery',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      id: data
    }
  })
}
