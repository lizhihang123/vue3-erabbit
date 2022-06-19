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

/**
 * @name: QQ登录
 * @params: union 第三方登录的唯一标识
 * @source: 来源 1为pc，2为webapp，3为微信小程序，4为Android，5为ios,6为qq,7为微信
 * @return {*}
 */

export const userQQLogin = (unionId, source = 1) => {
  return request('/login/social', 'post', { unionId, source })
}

/**
 * @name:  获取QQ绑定的时候短信验证码
 * @params:{String} mobile - 手机号
 * @return {*}
 */
export const userQQBindCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}

/**
 * QQ登录-绑定帐号
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'post', { unionId, mobile, code })
}

/**
 * QQ登录-判断用户名是否存在
 * @param {String} account - 帐号
 * @returns Promise
 */
export const userCheckAccount = (account) => {
  return request('/register/check', 'get', { account })
}

/**
 * 获取注册登录验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userPatchLogin = (mobile) => {
  return request('/register/code', 'get', { mobile })
}

/**
 * QQ登录-绑定帐号
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} account - 账号
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @param {String} password - 密码
 * @returns
 */
export const userQQPatchLogin = ({ unionId, account, mobile, code, password }) => {
  return request(`/login/social/${unionId}/complement`, 'post', { account, mobile, code, password })
}
