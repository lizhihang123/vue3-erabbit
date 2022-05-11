<template>
  <div class="goods-sku">
    <dl v-for="spec in goods.specs" :key="spec.id">
      <dt>{{spec.name}}</dt>
      <!-- spec是口味 value就是草莓味 苹果味 -->
      <dd v-for="(value, index) in spec.values" :key="index" @click="selectSpecs(spec, value)">
        <img :class="{selected: value.selected, disabled: value.disabled}" :src="value.picture" :title="value.name" v-if="value.picture">
        <span :class="{selected: value.selected, disabled: value.disabled}" v-else>{{value.name}}</span>
      </dd>
    </dl>
  </div>
</template>
<script>
import getPowerSet from '@/vender/powerSet.js'
// 根据sku数据得到数据字典对象
const spliter = '★'
const getPathMap = (skus) => {
  const pathMap = {}
  skus.forEach(sku => {
    // 1. 过滤出有库存的sku
    if (sku.inventory) {
      // 2. 得到sku属性的数组 ['曜石黑', 'iPhone11'] ['曜石黑']
      const specs = sku.specs.map(item => item.valueName)
      // 3. 得到sku属性值数组的子级 [ [], ['曜石黑'], ['iPhone11'], ['曜石黑', 'iPhone11']]
      const powerSet = getPowerSet(specs)
      powerSet.forEach(set => {
        // 4. 曜石黑★iPhone11 如果数组有两项 就要这样拼接
        const key = set.join(spliter)
        // 5. { 每一项可能有多个id
        // iPhone11: ['300078204'],
        // iPhone11Pro: ['300078207']
        // iPhone12/Pro通用: (4) ['300246369', '300246370', '300356284', '300356285']
        // }
        if (pathMap[key]) {
          // 如果之前已经有id，就要push 而不是直接覆盖了
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

// 获取当前选中规格的集合
const getSelectedArr = (specs) => {
  // 每次都要声明一个新的数组
  const selectedArr = []
  specs.forEach(spec => {
    // 判断 比如颜色这一个规格里面 是否有选中的值
    // spec -》去颜色里面找有无选中的
    // spec -》又去规格里面找有无选中的
    const selectedVal = spec.values.find(val => val.selected)
    // 如果有选中的值 就按顺序push进入选中数组
    // 如果没有 也要留一个undefined占坑
    selectedArr.push(selectedVal ? selectedVal.name : undefined)
  })
  return selectedArr
}

// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((spec, index) => {
    // selectedArr里面存储了 每一行谁被选中了的值 记录上一次选中
    const selectedArr = getSelectedArr(specs)
    // console.log(selectedArr) // [undefined, undefined] 说明颜色和规格里面都无选中的
    spec.values.forEach((val) => {
      // 已经选中的值不用进行判断 保持原来的值 disabled和上一次一样即可
      // selectedArr里面有值 说明selected是true
      if (val.name === selectedArr[index]) {
        return false
      }
      // 未选中的替换对应的值
      selectedArr[index] = val.name
      // 过滤无效值 如果是undefined就不要 join拼接为字符串
      const arr = selectedArr.filter(value => {
        return value
      })
      const key = arr.join(spliter)
      // 如果找得到值，disabled就是false
      const flag = !pathMap[key]
      // console.log(flag) // 页面第一次进入 都是false 但是点了一个 就是true了
      val.disabled = flag
    })
  })
}

// 初始化选中状态
const initSelectedStatus = (goods, skuId) => {
  const sku = goods.skus.find(sku => sku.id === skuId)
  // 写法一
  if (sku) {
    goods.specs.forEach((item, i) => {
    // item是specs里面的如颜色或者尺码
    // item.values里面比如是颜色的好多项
    // sku.specs是一个，里面第一是颜色，第二是尺码
      const val = item.values.find(val => val.name === sku.specs[i].valueName)
      // val是一个sku，比如颜色的一种
      if (val) {
        val.selected = true
      }
    })
  }
  // // 写法二
  // if (sku) {
  //   // specs里面有两层 比如颜色和尺码
  //   goods.specs.forEach((spec, i) => {
  //     // sku.specs里面的第一层也是颜色 第二层也是尺码 属性是valueName
  //     const value = sku.specs[i].valueName
  //     // spec是颜色或者或者尺码
  //     // spec.values是颜色的好多种或者尺码的好多种
  //     spec.values.forEach(val => {
  //       val.selected = val.name === value
  //     })
  //   })
  // }
}
export default {
  name: 'GoodsSku',
  props: {
    // 商品信息
    goods: {
      type: Object,
      default: () => {}
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    // 规格的字典 判断是否有规格的组合，值是id
    const pathMap = getPathMap(props.goods.skus)
    // 根据传入的skuId 更新规格的选中状态
    initSelectedStatus(props.goods, props.skuId)
    // 组件初始化的时候更新禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    /**
     * @name: 点击商品sku触发
     * @test: test font
     * @param {*} spec 属性类名 - 口味
     * @param {*} value 一种口味
     * @return {*}
     */
    const selectSpecs = (spec, value) => {
      // 如果是禁用状态 不作为
      if (value.disabled) return false
      // 如果当前sku选中，点击，改为未选中
      if (value.selected) {
        value.selected = false
      } else {
        // 排他思想，所有的sku都改为未选中
        spec.values.forEach(value => { value.selected = false })
        // 当前的改为选中
        value.selected = true
      }
      // 当点击的时候 更新禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 触发change事件 传出完整的sku

      // 如何判断是否选中了所有的sku? 通过选中的数组的数据过滤，判断长度是否和props.goods.specs.length相同
      // 获取选中的数组 过滤undefiend
      const selectedArr = getSelectedArr(props.goods.specs).filter(value => value)
      // 如果选中了全部的规格 就触发父组件的change事件 去存储这个里面的价格 旧的价格 还有新的库存信息给到父组件的goods变量
      if (selectedArr.length === props.goods.specs.length) {
        // 找到对应skuIds的值
        const skuIds = pathMap[selectedArr.join(spliter)]
        const sku = props.goods.skus.find(item => item.id === skuIds[0])
        // console.log(sku.specs.reduce((p, n) => `${p} ${n.name}: ${n.valueName}`, ''))
        // 为什么要传递这个数据给父组件 后续购物车要用
        // 新的价格 旧的价格 id值 商品描述值
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // name - 颜色
          // valueName - "27"
          // specsdText: sku.specs.reduce((p, n) => `${p} ${n.name}: ${n.valueName}`, '').replace(' ', '')
          specsdText: sku.specs.reduce((p, n) => `${p} ${n.name}: ${n.valueName}`, '').trim()
        })
      } else {
        emit('change', {})
      }
    }
    return {
      selectSpecs
    }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      // flex: 1;
      color: #666;
      margin-top: 7px;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
