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

/**
 * @name: 合并本地购物车 - 登录后
 * @param {*} cartList 本地购物车数组
 * @return {*}
 */
export const mergeLocalCart = (cartList) => {
  return request('/member/cart/merge', 'post', cartList)
}

/**
 * @name: 获取购物车的数量 - 登录后
 * @return {*}
 */
export const findCartList = () => {
  return request('/member/cart', 'get')
}

/**
 * @name: 加入购物车的数量 - 登录后
 * @return {*}
 */
export const insertCart = (skuId, count) => {
  return request('member/cart', 'post', { skuId, count })
}

/**
 * @name: 删除购物车 - 登录后
 * @return {*}
 */
export const deleteCart = (ids) => {
  return request('member/cart', 'delete', { ids })
}

/**
 * @name: 修改购物车商品的状态和数量 - 登录后
 * @return {*}
 */
export const updateCart = (goods) => {
  return request(`/member/cart/${goods.skuId}`, 'put', goods)
}

/**
 * @name: 全选与反选的接口 - 登录后
 * @param <Boolean> selected - 选中状态
 * @param {Array - <string> } ids 有效商品的sku集合
 * @return {*}
 */
export const checkAllCart = (selected, ids) => {
  return request('/member/cart/selected', 'put', { selected, ids })
}
