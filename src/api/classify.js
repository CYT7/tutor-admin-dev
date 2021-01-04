import request from '@/utils/request'
// 总后台科目分类列表信息接口
export function category(query) {
  return request({
    url: '/admin/v1/category/list?page=' + query,
    method: 'get',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      page: query
    }
  })
}
// 总后台科目分类创建接口
export function add(query) {
  return request({
    url: '/admin/v1/category/add',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      categoryName: query
    }
  })
}
// 总后台科目分类删除接口
export function remove(query) {
  return request({
    url: '/admin/v1/category/remove',
    method: 'DELETE',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      categoryId: query
    }
  })
}

