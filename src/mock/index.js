import Mock from 'mockjs'
import qs from 'qs'

// mock的配置
Mock.setup({
  // 也可以直接写400 表示400ms
  // 随机延时 500 - 1000ms
  timeout: '500-1000'
})

// 足迹
Mock.mock(/\/member\/browseHistory/, 'get', config => {
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)
  const items = []
  for (let i = 0; i < queryObject.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@name',
      desc: '@ctitle(2, 10)',
      // float(100, 200, 3, 5) // 表示 小数点有 3 - 5 位数； 2 2 表示只有2位数
      price: '@float(100, 200, 3, 5)',
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }
  return {
    msg: '获取足迹成功',
    result: {
      counts: 20,
      pageSize: queryObject.pageSize,
      page: queryObject.page,
      items
    }
  }
})

// 收藏
Mock.mock(/\/member\/collect/, 'get', config => {
  // console.log(config) // 对象 用户传递来的body url method
  // ? 后面都是参数
  // 索引 - 1 取到所有的参数
  // qs.parse转化为对象
  const queryString = config.url.split('?')[1]
  // qs.parse()
  // let url = 'user=wdx&pwd=123&appToken=7d22e38e-5717-11e7-907b-a6006ad3dba0'
  // console.log(qs.parse(url)) // {user:'wdx',pwd:'123',appToken:'7d22e38e-5717-11e7-907b-a6006ad3dba0'}

  // qs.stringify()
  // let obj= {
  //     user:'wdx',
  //     pwd:'123',
  //     appToken:'7d22e38e-5717-11e7-907b-a6006ad3dba0'
  // }
  // console.log(qs.stringify(obj)) // 'user=wdx&pwd=123&appToken=7d22e38e-5717-11e7-907b-a6006ad3dba0'

  const queryObject = qs.parse(queryString)
  const items = []
  for (let i = 0; i < queryObject.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10, 20)',
      desc: '@ctitle(4, 10)',
      price: '@float(100, 200, 2, 2)',
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }
  return {
    msg: '获取收藏的商品成功',
    result: {
      counts: 35,
      pageSize: +queryObject.pageSize,
      page: +queryObject.page,
      items
    }
  }
})

/**
 * @name: 拦截请求
 * 第一个参数：url 正则匹配
 * 第二个参数：请求方式
 * 第三个参数：生成数据的函数
 * @return {*}
 */
// Mock.mock(/\/my\/test/, 'get', () => {
//   const arr = []
//   for (let i = 0; i < 5; i++) {
//     // arr.push(Mock.mock('@id')) // 随机的id
//     // arr.push(Mock.mock('@id', '@ctitle')) // 奇怪的对象
//     // arr.push(Mock.mock({
//     //   id: '@id',
//     //   name: '@cname'
//     // })) // 有id也有name 如果是cname 就是中文名字

//     // 姓名的姓
//     // arr.push(Mock.mock({
//     //   id: '@id',
//     //   name: '@c'
//     // }))
//     // 姓名的名
//     // arr.push(Mock.mock({
//     //   id: '@id',
//     //   name: '@clast '
//     // })) // 有id也有name 如果是cname 就是中文名字

//     // arr.push(Mock.mock({
//     //   id: '@id',
//     //   // url
//     //   name: '@url',
//     //   // 图片
//     //   picture: '@image'
//     // })) // 有id也有name 如果是cname 就是中文名字

//     // ctitle - 随机的字
//     // arr.push(Mock.mock({
//     //   id: '@id',
//     //   name: '@ctitle(2, 4)'
//     // }))
//   }
//   return {
//     msg: '请求测试接口成功',
//     result: arr,
//     code: '1'
//   }
// })

// // 生成随机的数据
// /*
// 单个数据 只能取 0 - 7的值
// */
// Mock.mock('@integer(0, 7)')
// /*
// 对象数据 ctitle(2, 4) 表示 2 - 4个数字
// @id - 表示id值
// */
// Mock.mock()
