import request from '@/utils/request'

/**
 * @name: 根据用户名进行登录
 * @param {*} account 用户名
 * @param {*} password 密码
 * @return {*}
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

/**
 * @name: 根据手机号进行登录
 * @param {*} account 手机号
 * @param {*} password 密码
 * @return {*}
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}

/**
 * 获取短信登录验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'get', { mobile })
}
