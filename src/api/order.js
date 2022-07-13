import request from '@/utils/request'
/**
 * 获取结算信息
 */
export const findOrderInfo = () => {
  return request('/member/order/pre', 'get')
}

/**
 * @name: 再次生成订单
 * @return {*}
 */

export const repurchaseOrderInfo = (id) => {
  return request(`/member/order/repurchase/${id}`, 'get')
}

/**
 * @name: 添加收货地址信息
 * @param {Object} address - 地址对象
 * @return {*}
 */
export const addAddress = (form) => {
  return request('/member/address', 'post', {
    ...form
  })
}

/**
 * @name: 编辑收货地址信息
 * @param {Object} address - 地址对象
 * @return {*}
 */
export const editAddress = (form) => {
  return request(`/member/address/${form.id}`, 'put', {
    ...form
  })
}

/**
 * @name: 删除收货地址信息
 * @param {Object} address - 地址对象
 * @return {*}
 */
export const deleteAddressApi = (id) => {
  return request(`/member/address/${id}`, 'delete')
}

/**
 * @name: 提交订单
 * @param {Object} order - 订单商品对象
 * @return {*}
 */
export const createOrder = (order) => {
  return request('/member/order', 'post', order)
}

/**
 * @name: 获取订单详情
 * @param {Object} order - 订单商品对象
 * @return {*}
 */
export const findOrder = (id) => {
  return request(`/member/order/${id}`, 'get')
}

/**
 * @name: 获取订单列表API接口
 * orderState 订单状态，
 * 1为待付款、
 * 2为待发货、
 * 3为待收货、
 * 4为待评价、
 * 5为已完成、
 * 6为已取消，
 * 未传该参数或0为全部
 * @return {*}
 */
export const findOrderList = ({ orderState, page = 1, pageSize = 10 }) => {
  return request('/member/order', 'get', { orderState, page, pageSize })
}

/**
 * @name: 取消订单
 * @param {*} obj 包含id 和 cancelReason 取消原因
 * @return {*}
 */
export const cancelOrder = (id, cancelReason) => {
  return request(`/member/order/${id}/cancel`, 'put', { cancelReason })
}

/**
 * @name: 删除订单
 * @param {*} ids 订单id集合
 * @return {*}
 */
export const deleteOrderApi = (ids) => {
  return request('/member/order', 'delete', { ids })
}

/**
 * @name: 确认收货
 * @param {*} ids 订单id
 * @return {*}
 */
export const confirmOrderApi = (id) => {
  return request(`/member/order/${id}/receipt`, 'put')
}

/**
 * @name: 查看物流
 * @param {*} id 订单id
 * @return {*}
 */
export const logisticsOrder = (id) => {
  return request(`/member/order/${id}/logistics`, 'get')
}
