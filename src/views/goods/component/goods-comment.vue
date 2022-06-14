<template>
  <div class="goods-comment">
    <!-- 筛选 -->
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p><span>{{commentInfo.salesCount}}</span><span>人购买</span></p>
        <p><span>{{commentInfo.praisePercent}}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
          href="javascript:;"
          :class="{active: currentIndex === index}"
          v-for="(item, index) in commentInfo.tags"
          :key="index"
          @click="changeFilter(index)"
          >{{item.title}}({{item.tagCount}})</a>
        </div>
      </div>
    </div>
    <!-- 排序 -->
    <div class="sort" v-if="commentInfo">
      <span>排序：</span>
      <a
      href="javascript:;"
      :class="{active: reqParams.sortField === 'null'}"
      @click="changeSort('null')
      "
      >默认</a>
      <a
      href="javascript:;"
      :class="{active: reqParams.sortField === 'createTime'}"
      @click="changeSort('createTime')"
      >最新</a>
      <a
      href="javascript:;"
      :class="{active: reqParams.sortField === 'praiseCount'}"
      @click="changeSort('praiseCount')"
      >最热</a>
    </div>
    <!-- 评论的列表 -->
    <div class="list">
      <!-- 评论的内容 -->
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{formatNickname(item.member.nickname)}}</span>
        </div>
        <div class="body">
          <div class="score">
            <i class="iconfont icon-wjx01"></i>
            <i class="iconfont icon-wjx01"></i>
            <i class="iconfont icon-wjx01"></i>
            <i class="iconfont icon-wjx01"></i>
            <i class="iconfont icon-wjx02"></i>
            <span class="attr">{{formatSpecs(item.orderInfo.specs)}}</span>
          </div>
          <!-- 评论的内容 -->
          <div class="text">{{item.content}}</div>

          <!-- 评论的图片 -->
          <!-- 该组件会被遍历 每个评论下面都有可能有 图片 -->
          <goods-comment-image  :pictures="item.pictures"/>
          <!-- 评论的时间 -->
          <div class="time">
            <span>{{item.createTime}}</span>
            <!-- 点赞数目 -->
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页组件 -->
    <xtx-pagination
    v-if="total"
    :total="+total"
    :page-size="reqParams.pageSize"
    :current-page="reqParams.page"
    @current-change="changePager"
     />
  </div>
</template>
<script>
import { inject, ref, reactive, watch } from 'vue'
import { findCommentInfoByGoods, findCommentList } from '@/api/goods'
import GoodsCommentImage from './goods-comment-image'
export default {
  name: 'GoodsComment',
  components: {
    GoodsCommentImage
  },
  setup() {
    const commentInfo = ref(null)
    // 父组件传递来的商品数据
    const goods = inject('goods')
    const total = ref('100')
    // 用于获取评论的信息
    findCommentInfoByGoods(goods.value.id).then(data => {
      // 为什么要unshift两个数据，因为每个商品 前面都是 全部评价和有图这两个标签[筛选用]
      data.result.tags.unshift({
        type: 'img',
        title: '有图',
        tagCount: data.result.hasPictureCount
      })
      // 这个第二个筛选，表示放在最开始 顺序不能乱
      data.result.tags.unshift({
        type: 'all',
        title: '全部评价',
        tagCount: data.result.evaluateCount
      })
      commentInfo.value = data.result
      return commentInfo
    }).catch(error => {
      console.log(error)
    })
    // 用于筛选标签用 表示谁被激活
    const currentIndex = ref(0)
    // 点击修改激活状态 评论头部的筛选
    const changeFilter = (index) => {
      currentIndex.value = index
      const tag = commentInfo.value.tags[index]
      // 1. 如果点的是全部 传递all
      // 2. 如果点的是有图 传递图片
      // 3. 如果点的是其它标签 什么都不传
      // hasPicture 值要么是false 要么是true
      // tag 如果是null就是不传 如果不是 就传递 tag.title
      if (tag.type === 'all') {
        reqParams.tag = null
        reqParams.hasPicture = false
      } else if (tag.type === 'img') {
        reqParams.tag = null
        reqParams.hasPicture = true
      } else {
        reqParams.tag = tag.title
        reqParams.hasPicture = false
      }
      // 分页设置用
      reqParams.page = 1
    }

    // 筛选条件的数据准备
    // 筛选条件准备
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      sortField: null
    })
    // 点击改变 评论排序条件
    const changeSort = (type) => {
      reqParams.sortField = type
      // 为什么要特别改变page 为的是能够重新获取新的评论【切记 这里不能够放到watch里面 为什么？】
      reqParams.page = 1
    }

    // 页面一刷新就获取 商品的评论的信息

    // 商品的评价信息 【默认 最新 最热】
    const commentList = ref([])
    watch(reqParams, () => {
      findCommentList(goods.value.id, reqParams).then(data => {
        commentList.value = data.result.items
        total.value = data.result.counts
      })
    }, {
      immediate: true
    })

    // 改变分页的函数
    const changePager = (np) => {
      reqParams.page = np
    }
    // 定义转换数据的函数
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${p} ${c.name} : ${c.nameValue}`, '').trim()
    }
    const formatNickname = (nickname) => {
      return nickname.substr(0, 1) + '***' + nickname.substr(-1)
    }

    return {
      commentInfo,
      currentIndex,
      changeFilter,
      reqParams,
      changeSort,
      commentList,
      formatSpecs,
      formatNickname,
      changePager,
      total
    }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor,50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,&:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
