// 1. 用的是node的path模块
// 2. 为何这里用require导入呢?
//    老的方法导入 const path = require('path')
//    导出就是 modules.export = {}
//    新的方法导入是 import path from 'path'
//    导出就是 export default {}
// 3. path.join方法是什么
//    进行拼接
//    不是join方法时会把./也拼上去 不是我们想要的: fs.readFile(__dirname + './files/2.txt', 'utf8', function (err, dataStr) {
//    join方法拼接值 会忽略一个点的 ./

// 4. __dirname是什么呢?
//    获取的是当前整个大文件夹的目录
// import path from 'path'
// export default {

// 1. 为何要全局混入less文件
//    因为每个组件里面要使用混入的css 都要导入 太麻烦了
// 2. 如何全局混入
//    1. 安装插件 注意是安装vue/cli的插件 因此用vue命令
//       vue add style-resources-loader
//    2. 安装后呢? 自动生成 vue.config.js文件 配置Patterns数组配置项
//    3. 如何配置?
//       用到node的 path模块
//       __dirname能够获取 当前的根路径
const path = require('path')
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixin.less')
      ]
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10000 }))
    config.devServer.disableHostCheck(true)
  },
  configureWebpack: {
    externals: {
      qc: 'QC'
      // 假如要忽略vue-router
      // 'vue-router': 'VueRouter'
    }
  }
}
