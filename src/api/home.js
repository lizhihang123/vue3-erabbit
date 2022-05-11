import request from '@/utils/request.js'

/**
 * @name: 获取品牌
 * @param {*} limit 品牌个数
 * @return {*} promise对象
 */
export const findBrands = (limit = 6) => {
  return request('/home/brand', 'get', {
    limit: limit
  })
}

/**
 * @name: 获取品牌信息
 * @param {*}
 * @return {*} promise
 */
export const findBanner = () => {
  return request('/home/banner', 'get')
}

/**
 * @name: 获取新鲜好物信息
 * @param {*}
 * @return {*} promise
 */
export const findNew = (limit) => {
  return request('/home/new', 'get', { limit: limit })
}

/**
 * @name: 获取人气推荐信息
 * @param {*}
 * @return {*} promise
 */
export const findHot = () => {
  return request('home/hot', 'get')
}

/**
 * @name: 获取热门品牌
 * @param {*}
 * @return {*} promise
 */
export const findBrand = () => {
  return request('/home/brand', 'get')
}

/**
 * @name: 获取产品(商品)区块
 * @param {*}
 * @return {*} promise
 */
export const findGoods = () => {
  return request('/home/goods', 'get')
}
/**
 * @name: 获取最新专题
 * @param {*}
 * @return {*} promise
 */
export const findSpecial = () => {
  return request('/home/special', 'get')
}
