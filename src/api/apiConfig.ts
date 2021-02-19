export const Login = {
  yxAdminLogin: '/we-shop-mgmt/yxstore/admin/auth/yxAdminLogin/v100', // 邻药优选总后台登录（李丰）
  adminLogout: '/we-shop-mgmt/yxstore/admin/auth/adminLogout/v100', // 邻药优选总后台退出登录,无需任何参数（cookie自带），永远返回成功（李丰）
  getYxUserInfo: '/we-shop-mgmt/yxstore/admin/auth/getYxUserInfo/v100' // 获取邻药优选店铺用户信息（李丰）
}

export const Common = {
  getStoreList: '/we-shop-mgmt/yxstore/store/getStoreList/v100' // 获取店铺下拉列表
}

export const Product = {
  getProductList: '/we-shop-mgmt/yxstore/product/getProductList/v100', // 获取好药优选后台商品信息列表(田鑫)
  exportYxdrugInfoForExcel: '/we-shop-mgmt/yxstore/product/exportYxdrugInfoForExcel/v110', // 导出优选药品信息（田鑫）
  createYxProduct: '/we-shop-mgmt/yxstore/product/createYxProduct/v100', // 新建好药优选后台商品信息(田鑫)
  getYxProduct: '/we-shop-mgmt/yxstore/product/getYxProduct/v100', // 获取好药优选后台商品信息(田鑫)
  updateYxProduct: '/we-shop-mgmt/yxstore/product/updateYxProduct/v100', // 更新好药优选后台商品信息(田鑫)
  batchImportDrugForExcel: '/we-shop-mgmt/yxstore/product/batchImportDrugForExcel/v110'// 邻药优选批量导入商品 excel(田鑫)
}
export const Activity = {
  exportStoresDetail: '/we-shop-mgmt/yxstore/comboPlan/exportTemplatePlanStoreInfo/v125' // 导出店铺活动明细
}
export const StoreActivity = {
  activityDetail:'/we-shop-mgmt/yxstore/comboPlan/getPlanDetail/v100',// 店铺活动列表
  getPlanProduct:'/we-shop-mgmt/yxstore/comboPlan/getPlanProductInfo/v100',
  getProducts:'/we-shop-mgmt/yxstore/comboPlan/getPlanProduct/v100',
  deletProduct:'/we-shop-mgmt/yxstore/comboPlan/deletePlanProduct/v100',
  getStorePlan:'/we-shop-mgmt/yxstore/comboPlan/getStorePlan/v125',
  getStores:'/we-shop-mgmt/yxstore/store/getStoreList/v100',
  addStores:'/we-shop-mgmt/yxstore/comboPlan/addTemplateStoreId/v125',
  deletStore:'/we-shop-mgmt/yxstore/comboPlan/deleteTemplateStoreId/v125',
  saveStoreAct:'/we-shop-mgmt/yxstore/comboPlan/saveTemplateComboPlan/v125',
  addStoreAct:'/we-shop-mgmt/yxstore/comboPlan/postStorePlan/v125',
  endActivity:'/we-shop-mgmt/yxstore/comboPlan/finishPlan/v100',
  getQiNiuPicToken:'/we-shop-mgmt/wechatStore/getQiNiuPicToken',
  exportStoresDetail: '/we-shop-mgmt/yxstore/comboPlan/exportTemplatePlanStoreInfo/v125' // 导出店铺活动明细
}
export const Order = {
  getYxOrderListForBackstage: '/we-shop-mgmt/yxstore/order/getYxOrderListForBackstage/v100', // 获取后台优选订单列表
  downloadYxOrderExcel: '/we-shop-mgmt/yxstore/order/downloadYxOrderExcel/v100', // 导出优选订单
  orderRefund: '/we-shop-mgmt/yxstore/order/orderRefund/v100' // 订单退款
}
export const Shop = {
  addYxStore: '/we-shop-mgmt/yxstore/store/addYxStore/v110', // 新增店铺
  addYxStoreBatch: '/we-shop-mgmt/yxstore/store/addYxStoreBatch/v110', // 批量增加店铺
  deleteYxStoreInfo: '/we-shop-mgmt/yxstore/store/deleteYxStoreInfo/v110', // 删除店铺
  updateYxStoreStatus: '/we-shop-mgmt/yxstore/store/updateYxStoreStatus/v110', // 更新店铺状态
  exportYxStoreExcel: '/we-shop-mgmt/yxstore/store/exportYxStoreExcel/v110', // 批量导出店铺
  getYxStoreById: '/we-shop-mgmt/yxstore/store/getYxStoreById/v110', // 获取店铺信息
  getYxStoreIdAndName: '/we-shop-mgmt/yxstore/store/getYxStoreIdAndName/v110', // 获取店铺Id和名称的列表关系
  getYxStoreList: '/we-shop-mgmt/yxstore/store/getYxStoreList/v110', // 获取店铺列表
  saveYxStoreInfo: '/we-shop-mgmt/yxstore/store/saveYxStoreInfo/v110', // 保存店铺信息
  getChildrenAreas: '/we-shop-mgmt/yxstore/store/getChildrenAreas/v110', // 获取指定地区的下属的area列表
  getParentsAreas: '/we-shop-mgmt/yxstore/store/getParentsAreas/v110', // 通过下级地址,获取父地址
  getChatList: '/we-shop-mgmt/yxstore/chat/getChatList/v120', // 获取群列表
  exportChatList: '/we-shop-mgmt/yxstore/chat/exportChatList/v120', // 导出群列表
  getYxStoreChat: '/we-shop-mgmt/yxstore/chat/getYxStoreChat/v120', // 查找优选店铺下绑定的群的群信息
  bindGroup: '/we-shop-mgmt/yxstore/chat/bind/v120', // 绑定群
  unbindGroup: '/we-shop-mgmt/yxstore/chat/unbind/v120', // 解绑群
  searchChat: '/we-shop-mgmt/yxstore/chat/searchChat/v120', // 可添加群信息
  getUserInfoList: '/we-shop-mgmt/yxstore/userManagement/getUserInfoList/v130', // 查找用户信息
  modifyYxStoreRelation: '/we-shop-mgmt/yxstore/userManagement/modifyYxStoreRelation/v130', // 修改用户店铺关联关系
  searchYxStore: '/we-shop-mgmt/yxstore/userManagement/searchYxStore/v130', // 查找优选店铺信息
  downloadUserInfoList: '/we-shop-mgmt/yxstore/userManagement/downloadUserInfoList/v130'// 下载用户管理信息（王志坚）
}

export const Content = {
  getGroupCodeList: '/we-shop-mgmt/yxstore/content/getGroupCodeList/v100', // 查询群活码列表
  getGroupCodeDetail: '/we-shop-mgmt/yxstore/content/getGroupCodeDetail/v100', // 查看单个群活码
  editGroupCode: '/we-shop-mgmt/yxstore/content/editGroupCode/v100', // 编辑单个群活码
  deleteGroupCode: '/we-shop-mgmt/yxstore/content/deleteGroupCode/v100', // 删除单个群活码
  getManagerList: '/we-shop-mgmt/yxstore/content/getManagerList/v100' // 查询店长
}
export const Finance = {
  getFinanceSummaryInfo: '/we-shop-mgmt/getFinanceSummaryInfo/v120', // 查看总流水，可提现等信息
  getTrendChartInfo: '/we-shop-mgmt/getTrendChartInfo/v120', // 查看财务趋势对比信息
  getYxStoreFinanceInfo: '/we-shop-mgmt/getYxStoreFinanceInfo/v120', // 查看所有店铺财务信息
  exportYxStoreFinanceCheckInfo: '/we-shop-mgmt/exportYxStoreFinanceCheckInfo/v120', // 下载店铺财务信息
  getYxStoreBillInfo: '/we-shop-mgmt/getYxStoreBillInfo/v120', // 查看店铺账单信息
  exportYxStoreBillInfo: '/we-shop-mgmt/exportYxStoreBillInfo/v120', // 下载店铺账单信息
  getYxStoreBillDetailInfo: '/we-shop-mgmt/getYxStoreBillDetailInfo/v120', // 查看店铺账单详细信息
  exportYxStoreBillDetailInfo: '/we-shop-mgmt/exportYxStoreBillDetailInfo/v120'// 查看店铺账单详细信息
}
export const Coupon = {
  createCoupon: '/we-shop-mgmt/yxstore/coupon/createCoupon/v125', // 创建优惠券(李迎梦)
  getCouponByComboId: '/we-shop-mgmt/yxstore/coupon/getCouponByComboId/v125', // 优惠券列表(田鑫)
  getCouponDetail: '/we-shop-mgmt/yxstore/coupon/getCouponDetail/v125', // 查看优惠券信息(李迎梦)
  updateCouponDetailInfo: '/we-shop-mgmt/yxstore/coupon/updateCouponDetailInfo/v125', // 编辑优惠券(李迎梦)
  count: '/we-shop-mgmt/yxstore/userCoupon/count/v125', // 统计优惠券用户使用情况(陈光进)
  getYxUserCouponList: '/we-shop-mgmt/yxstore/userCoupon/getYxUserCouponList/v125', // 获取优惠券用户使用情况(陈光进)
  invalidCoupon: '/we-shop-mgmt/yxstore/userCoupon/invalidCoupon/v125', // 作废优惠券(陈光进)
  exportYxUserCouponList: '/we-shop-mgmt/yxstore/userCoupon/exportYxUserCouponList/v125', // 导出优惠券用户使用情况(陈光进)
  searchUser: '/we-shop-mgmt/yxstore/userCoupon/searchUser/v125', // 查询用户信息(陈光进)
  searchYsbStore: '/we-shop-mgmt/yxstore/userCoupon/searchYxStore/v125', // 查询店铺信息(陈光进)
  getParentCouponType: '/we-shop-mgmt/yxstore/childCouponType/getParentCouponType/v125', // 获取优惠券店铺基本信息(陈光进)
  getYxChildCouponTypeList: '/we-shop-mgmt/yxstore/childCouponType/getYxChildCouponTypeList/v125', // 获取优惠券店铺信息列表(陈光进)
  exportYxChildCouponTypeList: '/we-shop-mgmt/yxstore/childCouponType/exportYxChildCouponTypeList/v125', // 导出优惠券店铺信息列表(陈光进)
  getCouponQrCode: '/we-shop-mgmt/yxstore/childCouponType/getCouponQrCode' // 获取优惠券分享码(陈光进)
}

export default {
  Login,
  Common,
  Product,
  Activity,
  StoreActivity,
  Coupon,
  Shop,
  Content,
  Finance
}
