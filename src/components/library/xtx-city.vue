<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggleDialog" :class="{active: visible}">
      <span  v-if="!fullLocation" class="placeholder">{{placeholder}}</span>
      <span  v-else class="value">{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span class="ellipsis"
        v-for="item in currentList"
        :key="item.code"
        @click="changeItem(item)"
        >
            {{item.name}}
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, ref, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup(props, { emit }) {
    // 打开弹框
    const openDialog = () => {
      open()
    }
    // 关闭弹框
    const closeDialog = () => {
      visible.value = false
    }
    // 切换弹框
    const toggleDialog = () => {
      // 这里一定取反 visible.value是false 那么取反就是true 只有是false时，才会打开它
      if (!visible.value) {
        openDialog()
      } else {
        closeDialog()
      }
    }
    // 点击其它位置隐藏 vueuse方法 onClickOutside 点击外面的时候就会关闭弹框
    const target = ref(null)
    onClickOutside(target, () => {
      closeDialog()
    })

    // 显示和隐藏函数
    const loading = ref(false)
    // 获取城市数据, 显示当前地方列表
    const cityData = ref([])
    // 控制列表显示和隐藏
    const visible = ref(false)
    const open = () => {
      // loading改为true 有请求的小图标
      loading.value = true
      visible.value = true
      // 注意这里就是 data 而不是res.data
      getCityData().then(data => {
        cityData.value = data
        // 数据请求到了 loading改为false
        loading.value = false
      })
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    // 控制列表的关闭
    const close = () => {
      visible.value = false
    }
    // 获取城市数据
    const getCityData = () => {
      // 为什么这里用Promise 因为这里面有异步和同步两种操作
      // 同步 -> 直接从缓存里面取出数据
      // 异步 -> 调用接口 但是接口不是远程服务器 而是oss的接口 因此直接用axios.get
      return new Promise((resolve, reject) => {
        if (window.cityData) {
          // resolve 直接返回数据
          resolve(window.cityData)
        } else {
          const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
          // 调接口 再返回数据
          axios.get(url).then((res) => {
            // 数据存储在window里面，每个页面都可以使用
            window.cityData = res.data
            resolve(window.cityData)
          })
        }
      })
    }
    // 定义计算属性
    const currentList = computed(() => {
      // 省 直接用
      let cityList = cityData.value
      // 市 点了省 -> 就找出市
      if (changeResult.provinceCode) {
        cityList = cityList.find(province => province.code === changeResult.provinceCode).areaList
      }
      // 点了市 -> 就找出县
      if (changeResult.cityCode) {
        cityList = cityList.find(city => city.code === changeResult.cityCode).areaList
      }
      // 区/县
      // console.log(changeResult) // 这句代码只会打印两次
      return cityList
    })
    // 改变
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyName: '',
      countyCode: '',
      fullLocation: ''
    })
    const changeItem = (item) => {
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }

      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }

      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        // 点击完县 -》拼接完整的名字 xxx省xxx市xxx县
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        close()
        emit('change', changeResult)
      }
    }
    return {
      openDialog,
      closeDialog,
      toggleDialog,
      getCityData,
      open,
      close,
      currentList,
      loading,
      visible,
      target,
      changeItem,
      changeResult
    }
  }
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .loading {
        height: 290px;
        width: 100%;
        background: url(../../assets/images/loading.gif) no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
