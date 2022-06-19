export default {
  namespaced: true,
  state() {
    return {
      profile: {
        id: '',
        avator: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      },
      name: 'ls',
      redirectUrl: '/'
    }
  },
  mutations: {
    /**
       * @name: 修改用户信息的函数
       * @test: test font
       * @msg:
       * @param {*} stuserMobileLoginMsgate
       * @param {*} payload
       * @return {*}
       */
    setUser(state, payload) {
      state.profile = payload
    },
    setRedirectUrl(state, payload) {
      state.redirectUrl = payload
    }
  }
}
