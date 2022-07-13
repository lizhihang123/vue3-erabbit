<script>
// import { getCurrentInstance } from 'vue'
export default {
  name: 'XtxSteps',
  props: {
    active: {
      type: Number,
      default: 1
    }
  },
  render() {
    // const { ctx } = getCurrentInstance()
    // console.log(ctx)
    // 这里使用this 或者使用 ctx都可以
    // console.log(this) // 是一个proxy对象 和 ctx[原生对象]
    const items = this.$slots.default()
    // console.log(items)
    const dynamicItems = []
    items.forEach(item => {
      // 插槽组件名是XtxStepsItem 就push进入dynamicItems
      if (item.type.name === 'XtxStepsItem') {
        dynamicItems.push(item)
      } else {
        item.children.forEach(c => {
          dynamicItems.push(c)
        })
      }
    })
    // JSX写法
    const itemsJsx = dynamicItems.map((item, i) => {
    // 小兔鲜的激活步骤
      return <div class="xtx-steps-item" class={{ active: i < this.active }}>
        <div class="step"><span>{i + 1} </span></div>
        <div class="title">{ item.props.title }</div>
        <div class="desc">{ item.props.desc }</div>
      </div>
    })
    return <div class="xtx-steps">{itemsJsx}</div>
  }
}
</script>

<style scoped lang="less">
.xtx-steps {
  display: flex;
  text-align: center;
  &-item {
    flex: 1;
    &:first-child {
      .step {
        &::before {
          display: none;
        }
      }
    }
    &:last-child {
      .step {
        &::after {
          display: none;
        }
      }
    }
    &.active {
      .step {
        > span {
          border-color: @xtxColor;
          background: @xtxColor;
          color: #fff
        }
        &::before,&::after {
          background: @xtxColor;
        }
      }
      .title {
        color: @xtxColor;
      }
    }
    .step {
      position: relative;
      > span {
        width: 48px;
        height: 48px;
        font-size: 28px;
        border: 2px solid #e4e4e4;
        background: #fff;
        border-radius: 50%;
        line-height: 44px;
        color: #ccc;
        display: inline-block;
        position: relative;
        z-index: 1;
      }
      &::after,&::before{
        content: "";
        position: absolute;
        top: 23px;
        width: 50%;
        height: 2px;
        background: #e4e4e4;
      }
      &::before {
         left: 0;
      }
      &::after {
         right: 0;
       }
    }
    .title {
      color: #999;
      padding-top: 12px;
    }
    .desc {
      font-size: 12px;
      color: #999;
      padding-top: 6px;
    }
  }
}
</style>
