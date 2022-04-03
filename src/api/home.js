import request from '@/utils/request.js'

/**
 * @name: 获取品牌
 * @param {*} limit 品牌个数
 * @return {*} promise对象
 */
export const getBrands = (limit = 6) => {
  return request('/home/brand', 'get', {
    limit: limit
  })
}
