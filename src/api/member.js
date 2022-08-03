import request from '@/utils/request'

/**
 * @name: 我的收藏 接口
 * @param {*} page
 * @param {*} pageSize
 * @param {*} collectType - 1为商品 2为专题 3为品牌
 * @return {*}
 */
export const findCollect = (page = 1, pageSize = 4, collectType = 1) => {
  return request('/member/collect', 'get', {
    page: page,
    pageSize: pageSize,
    collectType: collectType
  })
}

/**
 * @name: 我的足迹接口
 * @param {*} page
 * @param {*} pageSize
 * @return {*}
 */
export const findBrowerHistory = (page = 1, pageSize = 4) => {
  return request('/member/browseHistory', 'get', {
    page: page,
    pageSize: pageSize
  })
}
