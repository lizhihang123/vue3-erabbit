import { getNewCartGoods } from '@/api/cart.js'
import Message from '@/components/library/Message'
export default {
  namespaced: true,
  state() {
    return {
      list: [] // 购物车状态
    }
  },
  getters: {
    invalidList (state) {
      // 没有库存或者 isEffective - false 都无效
      return state.list.filter(item => !(item.stock > 0 && item.isEffective))
    },
    // 已经选中的商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 选中商品的总件数
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品的金额
    selectedPrice (state, getters) {
      return getters.selectedList.reduce((p, c) => p + parseInt(c.count * 100) * c.price, 0) / 100
    },
    // 有效商品的列表
    validList(state) {
      // item.stock 有库存 && item.isEffective 是有效商品
      const arr = state.list.filter(item => item.stock > 0 && item.isEffective)
      return arr
    },
    // 有效商品的总数
    validTotal (state, getters) {
      // getters 能够获取同一个模块里面 也就是同一个js文件里面的getters
      // reduce进行累加 依旧计算属性里面的validList里面的 每个商品的 count
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品的总金额
    validPrice (state, getters) {
      const num = getters.validList.reduce((p, c) => {
        return p + parseInt(c.price * 100) * c.count
      }, 0) / 100
      return num
    },
    // 是否全选
    isCheckedAll(state, getters) {
      return getters.validList.length === getters.selectedList.length && getters.selectedList.length !== 0
    }
  },
  mutations: {
    // 删除购物车
    deleteCart (state, skuId) {
      // 根据 skuId 找到在list中的位置
      const index = state.list.findIndex(item => item.skuId === skuId)
      // 直接删除
      state.list.splice(index, 1)
      debugger
    },
    // 添加购物车
    insertCart (state, goods) {
      // 如果点击添加购物车 想要新增产品A 这个产品A的skuId 在已有的列表里面有了
      const sameIndex = state.list.findIndex(item => item.skuId === goods.skuId)
      if (sameIndex > -1) {
        // 数量++ 也就是goods 的数量要增加 原本已经有2件这个产品了 就要增加数量2 新增的数量是 3 就要输入 3 + 2
        goods.count = state.list[sameIndex].count + goods.count
        // 删除vuex里面这个位置的产品
        state.list.splice(sameIndex, 1)
      }
      // 把新增的goods产品放到list的开头【此时这个产品的数量已经更新了】
      // 上面if倘若没走进去，就是直接goods push进去
      state.list.unshift(goods)
      debugger
    },

    // 更新购物车
    updateCart(state, goods) {
      // 根据传递进来的goods里面的skuId值 找到对应的商品 find方法
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      // 遍历传递进来的goods属性
      // updateGoods这个对象 不是所有的属性都要修改 传递进来的属性 -> 后端返回的有变化的属性 才才需要修改
      for (const key in goods) {
        // goods[key] -> 传递进来的 selectStatus 选中状态有 true 或者 false
        // 判断条件如果是 goods[key] 连布尔值也无法判断 因此如下写
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          // 修改商品列表里面信息
          updateGoods[key] = goods[key]
        }
      }
    }
  },
  actions: {
    // 1. 添加购物车
    insertCart(ctx, goods) {
      // 返回一个promise对象
      return new Promise((resolve, reject) => {
        // ctx.rootState 是看文档得知 commit/ctx下面有rootState 属性 该属性能够获取 其它兄弟模块的属性state值
        // 如果不用ctx.rootState.user.token来获取 而是使用 store.state.user -> 这个写法错误 当前本来就是store对象 store.state能获取到啥呢?
        // 如果user下面存在token -> 证明用户登录
        if (ctx.rootState.user.token) {
          // 用户已经登录
        } else {
          // 用户未登录
          // actions -> mutations -> 修改goods
          ctx.commit('insertCart', goods)
          console.log(goods)
          // 必须resolve -> 下回才能够通过.then获取到结果数据
          resolve()
        }
      })
    },

    // 2. 更新购物车
    // 为什么要 更新? 因为购物车里面的商品 可能几天后就没有库存了，商品下架，购物车里面数量也要发生变化
    findCartList (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 表明用户已经登录
          // 如果用户已经登录 信息都是接口从后台获取的 无需做额外的更新处理?
        } else {
          // 用户未登录 是本地存储 需要更新

          // 功能: 接口限制 该接口一次只能传递一个商品的skuId值过去 多个商品 调用多个次接口
          // 需要Promise.all()方法来实现 参数是一个promiseArr数组
          // promiseArr数组的值 每个值是一个promise对象 接口返回
          const promiseArr = ctx.state.list.map(item => {
            return getNewCartGoods(item.skuId)
          })
          // 多个接口调用的结果同时给到 dataArr
          Promise.all(promiseArr).then((dataArr) => {
            // dataArr进行遍历，调用mutations，每个调用还要传递一个skuId进去，到时候根据这个skuId去更新商品的价格和库存信息
            // 返回的data里面没有skuId ctx.state.list里面有skuId,但是这是两个不同的数组
            dataArr.forEach((data, i) => {
              ctx.commit('updateCart', {
                // -> 关键点 - promiseArr数组的promise对象 调用Promise.all()方法，返回的dataArr结果，也是按照顺序来的，因此i的顺序和ctx.state.list的顺序是一致的
                // -> 因此 ctx.state.list[i].skuId能够和data里面的每个商品对应上 每个商品的skuId这样就有了
                skuId: ctx.state.list[i].skuId,
                ...data.result
              })
            })
            // 成功提示
            Message({
              type: 'success',
              text: '更新购物车成功'
            })
            // resolve返回
            resolve()
          }).catch((error) => {
            // 如果报错 就弹出错误
            reject(error)
          })
        }
      })
    },

    // 3. 删除购物车
    deleteCart (ctx, skuId) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已经登录
        } else {
          // 未登录 - 本地存储
          ctx.commit('deleteCart', skuId)
          resolve()
        }
      })
    },

    // 3.1 批量 删除购物车
    batchDeleteCart (ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已经登录
        } else {
          // 获取选中商品列表 遍历 挨个进行删除
          if (isClear && ctx.getters.invalidList.length === 0) {
            Message({
              type: 'error',
              text: '不存在无效商品'
            })
            return
          }
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach((good) => {
            ctx.commit('deleteCart', good.skuId)
          })
          // ctx.getters.selectedList.forEach((good) => {
          //   ctx.commit('deleteCart', good.skuId)
          // })
          resolve()
        }
      })
    },

    // 4. 更新购物车
    updateCart (ctx, goods) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录
        } else {
          // 未登录
          ctx.commit('updateCart', goods)
          resolve()
        }
      })
    },

    // 5. 全选
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录
        } else {
          // 未登录
          // 遍历有效的商品列表 挨个去修改商品的选中状态
          ctx.getters.validList.forEach(good => {
            // skuId是每个商品的skuId selected是调用这个checkAll时传进来的
            ctx.commit('updateCart', { skuId: good.skuId, selected })
          })
          resolve()
        }
      })
    },

    // 6. 修改sku的函数
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录
        } else {
          // 未登录
          // 修改sku时，skuId需要修改 相等于把原来的信息 移出 创建一条新的商品信息
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          // 删除这条商品信息 - oldSkuId
          ctx.commit('deleteCart', oldSkuId)
          // 解构出新的sku的商品信息
          const { skuId, price: nowPrice, inventory: stock, specsdText: attrsText } = newSku
          // 合并新的商品信息
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }

          // 插入这条商品信息即可
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    }
  }
}
