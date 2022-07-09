import request from '@/utils/request'
/**
 * 获取结算信息
 */
export const findOrderInfo = () => {
  return request('/member/order/pre', 'get')
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
