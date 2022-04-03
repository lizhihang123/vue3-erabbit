<template>
  <div class='home-category' @mouseleave="categoryId = null">
    <ul class="menu">
      <li
      v-for="item in menuList"
      :key="item.id"
      @mouseenter="categoryId = item.id"
      :class="{active: categoryId === item.id}"
      >
        <RouterLink
        :to="`/category/${item.id}`"
        >
          {{item.name}}
        </RouterLink>
        <template v-if="item.children">
          <RouterLink :to="`/category/sub/${sub.id}`"
          v-for="sub in item.children"
          :key="sub.id"
          >
            {{sub.name}}
          </RouterLink>
        </template>
      </li>
    </ul>

    <!-- 弹层展示 -->
    <div class="layer">
      <h4>{{currCategory && currCategory.brands ? '品牌推荐':'分类推荐'}}
        <small>根据您的购买或浏览记录推荐</small>
      </h4>
      <ul v-if="currCategory && currCategory.goods">
        <li v-for="goods in currCategory.goods" :key="goods.id">
          <RouterLink to="/" >
            <img :src="goods.picture" alt="">
            <div class="info">
              <p class="name ellipsis-2">{{goods.name}}</p>
              <p class="desc ellipsis">{{goods.desc}}</p>
              <p class="price"><i>¥</i>{{goods.price}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>

      <!-- 品牌的结构 -->
      <ul v-if="currCategory && currCategory.brands">
          <li class="brand" v-for="i in 6" :key="i">
            <RouterLink to="/">
              <img src="http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/brand_goods_1.jpg" alt="">
              <div class="info">
                <p class="place"><i class="iconfont icon-dingwei"></i>北京</p>
                <p class="name ellipsis">DW</p>
                <p class="desc ellipsis-2">DW品牌闪购</p>
              </div>
            </RouterLink>
          </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { getBrands } from '@/api/home.js'
export default {
  name: 'HomeCategory',
  setup() {
    // 1. 创建一个品牌数据
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [
        {
          id: 'brand-children',
          name: '品牌推荐'
        }
      ],
      brands: []
    })
    const store = useStore()

    // 2. 从vuex中获取数据
    const menuList = computed(() => {
      const list = store.state.category.list.map(item => {
        return {
          id: item.id,
          name: item.name,
          // 先行一步 防止 没有children数据
          children: item.children && item.children.slice(0, 2),
          goods: item.goods
        }
      })
      list.push(brand)
      return list
    })
    console.log(menuList)

    // 3.左侧弹层的显示
    const categoryId = ref(null)
    // const updateId = (id) => categoryId.value === id
    const currCategory = computed(() => {
      return menuList.value.find(item => item.id === categoryId.value
      )
    })

    // 4. 获取品牌数据
    getBrands().then(data => {
      brand.brands = data.result
    })
    // onMounted是ok的
    // onMounted(async () => {
    //   const data = await getBrands()
    //   brand.brands = data.result
    // })

    // 用async和await是会出错的 导致整个组件都没了
    // const data = await getBrands()
    // brand.brands = data

    return { menuList, categoryId, currCategory }
  }
}
</script>

<style scoped lang='less'>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0,0,0,0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,
      &.active
      {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }

  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255,255,255,0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
              width: 95px;
              height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
</style>
