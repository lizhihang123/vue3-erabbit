// 提取的目的是为了后续这个规则可以复用
export default {
  // 用户名 非空
  // 字母开头 6-20位字符
  account (value) {
    if (!value) {
      return '请输入用户名'
    }
    if (!/^[a-zA-Z]\w{5,15}$/.test(value)) {
      return '用户名是字母开头 6-20位字符'
    }
    return true
  },
  // 密码 非空
  // 6-20位字符
  password (value) {
    if (!value) {
      return '请输入密码'
    }
    if (!/^\w{6,20}$/.test(value)) {
      return '密码是 6-20位字符'
    }
    return true
  },
  // 手机号
  mobile (value) {
    if (!value) {
      return '请输入手机号'
    }
    if (!/^1[3-9]\d{9}$/.test(value)) {
      return '手机号格式错误'
    }
    return true
  },
  // 验证码
  code (value) {
    if (!value) {
      return '请输入验证码'
    }
    if (!/^\d{6}$/.test(value)) {
      return '验证码格式不对'
    }
    return true
  },
  // 同意协议
  isAgree (value) {
    if (!value) {
      return '请勾选同意用户协议'
    }
    return true
  }
}
