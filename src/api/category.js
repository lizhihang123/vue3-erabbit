import request from '@/utils/request'

/**
 * @name: 获取所有的分类数据
 * @test: test font
 * @msg:
 * @param {*}
 * @return {*}
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

/**
 * @name: 获取单个顶级分类的信息
 * @test: test font
 * @msg:
 * @param {*} 顶级分类的ID
 * @return {*}
 */
export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}

/**
 * @name:
 * @test: 获取过滤分类数据
 * @msg:
 * @param {*}
 * @return {*} promise
 */
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', { id })
}

/**
 * @name:
 * @test: 获取分类下的商品（带筛选条件）
 * @msg:
 * @param {*}
 * @return {*} promise
 */
export const findSubCategoryGoods = (params) => {
  return request('/category/goods/temporary', 'post', params)
}
