<template>
  <ul class="app-header-nav">
    <li class="home">
      <RouterLink to="/">
        首页
      </RouterLink>
    </li>
    <li v-for="item in list" :key="item.id"
      @mouseenter="show(item)"
      @mouseleave="hide(item)">
      <RouterLink
      :to="`/category/${item.id}`"

      @click="hide(item)">
        {{item.name}}
      </RouterLink>
      <div class="layer" :class="{open: item.open}">
        <ul>
          <li
          v-for="sub in item.children"
          :key="sub.id">
            <RouterLink
            :to="`/category/sub/${sub.id}`"
            @click="hide(item)">
              <img
                :src="sub.picture"
                alt=""
              />
              <p>{{sub.name}}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
// 1. 解决问题: 鼠标经过一级类目 鼠标移开一级类目 二级弹框会有显示和隐藏 但是鼠标点击一级 和 二级的类目时，就不会有了
// 2. 不能通过hover来控制 hover => 只有隐藏和显示两种
// 3. 定义show hide 方法进行控制
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  name: 'AppHeaderNav',
  setup() {
    const store = useStore()
    const list = computed(() => {
      // console.log(store.state.category.list)
      return store.state.category.list
    })
    // console.log(list)
    // 显示方法 调用vuex的show
    const show = (item) => {
      store.commit('category/show', item)
    }
    // 隐藏方法 调用vuex的hide
    const hide = (item) => {
      store.commit('category/hide', item)
    }
    return { list, show, hide }
  }
}
</script>

<style scoped lang="less">
.app-header-nav {
  width: 820px;
  display: flex;
  position: relative;
  justify-content: space-around;
  padding-left: 40px;
  li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      // > .layer {
      //   height: 132px;
      //   opacity: 1;
      // }
    }
  }
  .layer {
    // 请注意 这里为什么加.layer.open 是交集选择器 选择.layer里面有open类的元素 这两个类是同级的
    // 如果是.layer .open的话，就是.layer 里面的.open类，但是并不存在
    &.open {
      height: 132px;
      opacity: 1;
    }
    width: 1240px;
    background-color: #fff;
    position: absolute;
    left: -200px;
    top: 56px;
    height: 0;
    overflow: hidden;
    opacity: 0;
    box-shadow: 0 0 5px #ccc;
    transition: all 0.2s 0.1s;
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0 70px;
      align-items: center;
      height: 132px;
      li {
        width: 110px;
        text-align: center;
        img {
          width: 60px;
          height: 60px;
        }
        p {
          padding-top: 10px;
        }
        &:hover {
          p {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>
