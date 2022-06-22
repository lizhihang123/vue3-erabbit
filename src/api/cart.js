// 购物车使用的接口
import request from '@/utils/request'

/**
 * @name: 判断商品是否还有库存
 * @param {*} id
 * @return {*}
 */
export const getNewCartGoods = (id) => {
  return request(`/goods/stock/${id}`, 'get')
}

/**
 * @name: 根据skuId 获取商品属性信息
 * @param {*} skuId
 * @return {*}
 */
export const getSpecsAndSkus = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}
