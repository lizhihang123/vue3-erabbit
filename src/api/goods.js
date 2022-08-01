import request from '@/utils/request.js'

/**
 * @name: 获取相关推荐商品
 * @param {*} id
 * @param {*} limit
 * @return {*}
 */
export const findRelGoods = (id, limit = 16) => {
  return request('/goods/relevant', 'get', { id, limit })
}

/**
 * 获取热榜商品
 * @param {Number} type - 1代表24小时热销榜 2代表周热销榜 3代表总热销榜
 * @param {Number} limit - 获取个数
 */
export const findHotGoods = ({ id, type, limit = 3 }) => {
  return request('/goods/hot', 'get', { id, type, limit })
}

/**
 * @name: 获取商品的评价头部统计信息
 * @return {*}  {String} id - 商品ID
 */

export const findCommentInfoByGoods = (id) => {
  // get字段没有传递
  return request(`/goods/${id}/evaluate`, 'get')
}

/**
 * @name: 获取商品的评价的评论具体信息
 * @param {*} - 商品ID
 * @param {*} - 商品的参数
 */
// export const findCommentList = (id, params) => {
//   return request(`/goods/${id}/evaluate/page`, 'get', params)
// }

export const findCommentList = (id, params) => {
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params)
}

// 如果后端没有开发好接口 我们mock地址 mock的基地址和后端的不一样 直接这里写https开头的地址 即可 axios会默认识别出来
// https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate
// export const findCommentInfoByGoods = (id) => {
//   return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`)
// }

/**
 * @name: 收藏商品
 * @param {*} ids 可以传递多个
 * @param {*} type 1为商品，2为专题，3为品牌
 * @return {*}
 */
export const collectGoods = (collectObjectIds, collectType) => {
  return request('/member/collect', 'post', { collectObjectIds, collectType })
}

/**
 * @name: 取消收藏
 * @param {*} ids 可以传递多个
 * @param {*} type 1为商品，2为专题，3为品牌
 * @return {*}
 */
export const batchCollectGoods = (collectObjectIds, collectType) => {
  return request('/member/collect/batch', 'delete', { collectObjectIds, collectType })
}
