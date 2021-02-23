<template>
  <div class="finance-detail">
    <div class="finance-detail-title">
      {{ storeName }}
    </div>
    <cards :cardlist="cardList" />
    <div class="finance-detail-tab">
      <div class="tab"><el-radio v-model="tab" size="medium" label="1" border @change="tabclick('1')">账单信息</el-radio></div>
      <div class="tab"><el-radio v-model="tab" size="medium" label="2" border @change="tabclick('2')">账单明细</el-radio></div>
    </div>
    <div class="finance-detail-content">
      <el-tabs v-model="activeName">
        <!-- 账单信息 -->
        <el-tab-pane name="first" class="msgtab">
          <el-form class="msg-filter" :model="form" label-width="68px" inline size="normal">
            <el-form-item label="时间">
              <el-date-picker
                v-model="billMsg.time"
                size="medium"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" @click="billMsgSearch">搜索</el-button>
              <!-- <el-button @click="handleExport()">导出</el-button> -->
              <el-button size="medium" :loading="billMsg.isDownloading" @click="downloadMsgExcel">下载</el-button>
            </el-form-item>
          </el-form>
          <msg-list
            v-loading="billMsg.loading"
            :data="billMsg.data"
            :total="billMsg.total"
            :page="billMsg.page"
            :page-size="billMsg.pageSize"
            @sizechange="billMsgSizeChange"
            @pagechange="billMsgPageChange"
          />
        </el-tab-pane>
        <!-- 账单明细 -->
        <el-tab-pane class="detailtab" name="second">
          <el-tabs v-model="detailtabs">
            <el-tab-pane label="待结算" name="first">
              <detail-filter
                :isdowning="detailSettled.isDownloading"
                :form="detailSettled.form"
                @download="downloadDetailExcel"
                @detailSearch="detailSearch"
              />
              <detail-list
                v-loading="detailSettled.loading"
                :data="detailSettled.data"
                :type="detailSettled.type"
                :total="detailSettled.total"
                :page="detailSettled.page"
                :page-size="detailSettled.pageSize"
                @sizechange="settledSizeChange"
                @pagechange="settledPageChange"
              />
            </el-tab-pane>
            <el-tab-pane label="已结算" name="second">
              <detail-filter
                :isdowning="detailUnsettled.isDownloading"
                :form="detailUnsettled.form"
                @download="downloadDetailExcel"
                @detailSearch="detailSearch"
              />
              <detail-list
                v-loading="detailUnsettled.loading"
                :data="detailUnsettled.data"
                :type="detailUnsettled.type"
                :total="detailUnsettled.total"
                :page="detailUnsettled.page"
                :page-size="detailUnsettled.pageSize"
                @sizechange="unSettledSizeChange"
                @pagechange="unSettledPageChange"
              />
            </el-tab-pane>
          </el-tabs>

        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
import moment from 'moment'
import { getFinanceSummaryInfo, getYxStoreBillInfo, getYxStoreBillDetailInfo } from '@/api/finance'
import { downloadFileByAjax } from '@/utils/request'
import { getToken } from '@/utils/auth'
import { Finance } from '@/api/apiConfig'

import Cards from './components/Cards'
import MsgList from './components/MsgList'
import DetailList from './components/detailList'
import DetailFilter from './components/DetailFilter'

export default {
  components: {
    Cards, MsgList, DetailList, DetailFilter
  },
  // 指令focus的定义
  directives: {
    focus: {
      inserted: function(el) {
        el.focus()
      }
    }
  },
  data() {
    return {
      tab: '1',
      detailtabs: 'first',
      activeName: 'first',
      cardList: [
        { name: '总流水', sum: '00.00', tip: '去掉商家补贴后的GMV（用户实付+平台补贴）' },
        { name: '可提现', sum: '00.00', tip: '待结算订单（订单状态已完成）三天后变为已结算订单，先转入每个店铺“不可提现部分”超过部分可提现，“可提现”是可提现部分金额之和' },
        { name: '不可提现', sum: '00.00', tip: '创建店铺时填入每个店铺的不可提现收入，如果该部分不满，订单收入先转入。“不可提现”是实际不可提现收入之和' },
        { name: '平台补贴', sum: '00.00', tip: '已支付的订单平台补贴之和（按商品计算）' },
        { name: '店铺补贴', sum: '00.00', tip: '已支付的订单店铺补贴之和（按商品计算）' },
        { name: '服务费', sum: '00.00', tip: '已支付的每个订单服务费之和（按每单计算）' },
        { name: '已结算', sum: '00.00', tip: '(订单状态已完成)三天后变为已结算订单' },
        { name: '待结算', sum: '00.00', tip: '用户已支付的订单金额，去除掉已结算订单金额后的金额和。15天未核销则自动核销' }
      ],
      form: {
        orderStatus: 0,
        orderType: 0
      },
      storeId: '',
      storeName: '',
      // 账单信息
      billMsg: {
        time: '',
        timeCopy: '',
        data: [],
        page: 1,
        pageSize: 10,
        total: 0,
        loading: false,
        isDownloading: false
      },
      // 未结算
      detailSettled: {
        form: {
          settleType: 0,
          sn: '',
          unionSn: '',
          time: '',
          orderStatus: -1,
          orderType: -1
        },
        formCopy: { // 复制一份form数据以便翻页的时候使用上一次查询的条件（防止用户点击搜索后修改form选项然后再点击翻页）
          settleType: 0,
          sn: '',
          unionSn: '',
          time: '',
          orderStatus: -1,
          orderType: -1
        },
        type: 0,
        time: '',
        data: [],
        page: 1,
        pageSize: 10,
        total: 0,
        loading: false,
        isDownloading: false,
        hasLoadData: false
      },
      // 已结算
      detailUnsettled: {
        form: {
          settleType: 1,
          sn: '',
          unionSn: '',
          time: '',
          orderStatus: -1,
          orderType: -1
        },
        formCopy: {
          settleType: 1,
          sn: '',
          unionSn: '',
          time: '',
          orderStatus: -1,
          orderType: -1
        },
        type: 1,
        time: '',
        data: [],
        page: 1,
        pageSize: 10,
        total: 0,
        loading: false,
        isDownloading: false,
        hasLoadData: false
      }
    }
  },
  watch: {
    // 观察option的变化
    detailtabs: {
      handler(val) {
        if (val === 'second') {
          if (this.detailUnsettled.hasLoadData) return
          this.getBillDetail(null, 1)
        }
      },
      deep: true // 对象内部属性的监听，关键。
    }
  },
  created() {
    // this.initData()
  },
  activated() {
    this.initData()
  },
  mounted() {
  },
  methods: {
    initData() {
      if (this.storeId === Number(this.$route.query.storeId)) return// actived同一个店铺，不需要刷新数据
      // 重置tab状态
      this.tab = '1'
      this.detailtabs = 'first'
      this.activeName = 'first'
      // 重置data状态
      this.detailSettled.hasLoadData = false
      this.detailUnsettled.hasLoadData = false
      this.storeId = Number(this.$route.query.storeId)
      this.storeName = this.$route.query.storeName
      // console.log(this.storeId)

      this.getAllFinance({
        selectYxStoreId: this.storeId
      })
      this.getBillmsg()
    },
    // 下载账单信息
    async downloadMsgExcel() {
      if (this.billMsg.isDownloading) return
      const token = getToken()
      var downloadUrl =
        Finance.exportYxStoreBillInfo +
        '?token=' +
        token +
        '&pageNo=' +
        this.billMsg.page +
        '&pageSize=' +
        this.billMsg.pageSize +
        '&selectYxStoreId=' +
        this.storeId +
        '&version=' +
        'v120'
      if (this.billMsg.time) {
        downloadUrl += ('&beginDateTime=' +
        Math.floor(moment(this.billMsg.time[0]).valueOf() / 1000))
        downloadUrl += ('&endDateTime=' +
        Math.floor(moment(this.billMsg.time[1]).valueOf() / 1000))
      } else {
        downloadUrl += ('&beginDateTime=' +
        Math.floor(moment().subtract(1, 'years').valueOf() / 1000))
        downloadUrl += ('&endDateTime=' +
        Math.floor(moment().valueOf() / 1000))
      }
      const _this = this
      this.billMsg.isDownloading = true
      downloadFileByAjax({
        url: downloadUrl,
        method: 'GET',
        fileName: '店铺账单信息.xls',
        emptyCallback: () => {
          _this.billMsg.isDownloading = false
          alert('暂无记录')
        },
        completeCallback: () => {
          _this.billMsg.isDownloading = false
        }
      })
    },
    // 下载账单明细
    // type 0:下载待结算账单信息 1：下载已结算账单信息
    async downloadDetailExcel(type) {
      var downloadUrl
      if (type === 0) {
        if (this.detailSettled.isDownloading) return
        const token = getToken()
        downloadUrl =
        Finance.exportYxStoreBillDetailInfo +
        '?token=' +
        token +
        '&pageNo=' +
        this.detailSettled.page +
        '&pageSize=' +
        this.detailSettled.pageSize +
        '&selectYxStoreId=' +
        this.storeId +
        '&settleType=' +
        type +
        '&version=' +
        'v120'
        if (this.detailSettled.form.time) {
          downloadUrl += ('&beginDateTime=' +
        Math.floor(moment(this.detailSettled.form.time[0]).valueOf() / 1000))
          downloadUrl += ('&endDateTime=' +
        Math.floor(moment(this.detailSettled.form.time[1]).valueOf() / 1000))
        }
        if (this.detailSettled.form.orderStatus !== -1) {
          downloadUrl += ('&orderStatus=' + this.detailSettled.form.orderStatus)
        }
        if (this.detailSettled.form.orderType) {
          downloadUrl += ('&orderType=' + this.detailSettled.form.orderType)
        }
        if (this.detailSettled.form.sn) {
          downloadUrl += ('&sn=' + this.detailSettled.form.sn)
        }
        if (this.detailSettled.form.unionSn) {
          downloadUrl += ('&sn=' + this.detailSettled.form.unionSn)
        }
        const _this = this
        this.detailSettled.isDownloading = true
        downloadFileByAjax({
          url: downloadUrl,
          method: 'GET',
          fileName: '店铺账单明细(待结算).xls',
          emptyCallback: () => {
            _this.detailSettled.isDownloading = false
            alert('暂无记录')
          },
          completeCallback: () => {
            _this.detailSettled.isDownloading = false
          }
        })
      } else if (type === 1) {
        if (this.detailUnsettled.isDownloading) return
        const token = getToken()
        downloadUrl =
        Finance.exportYxStoreBillDetailInfo +
        '?token=' +
        token +
        '&pageNo=' +
        this.detailUnsettled.page +
        '&pageSize=' +
        this.detailUnsettled.pageSize +
        '&selectYxStoreId=' +
        this.storeId +
        '&settleType=' +
        type +
        '&version=' +
        'v120'
        if (this.detailUnsettled.form.time) {
          downloadUrl += ('&beginDateTime=' +
        Math.floor(moment(this.detailUnsettled.form.time[0]).valueOf() / 1000))
          downloadUrl += ('&endDateTime=' +
        Math.floor(moment(this.detailUnsettled.form.time[1]).valueOf() / 1000))
        }
        if (this.detailUnsettled.form.orderStatus !== -1) {
          downloadUrl += ('&orderStatus=' + this.detailUnsettled.form.orderStatus)
        }
        if (this.detailUnsettled.form.orderType) {
          downloadUrl += ('&orderType=' + this.detailUnsettled.form.orderType)
        }
        if (this.detailUnsettled.form.sn) {
          downloadUrl += ('&sn=' + this.detailUnsettled.form.sn)
        }
        if (this.detailUnsettled.form.unionSn) {
          downloadUrl += ('&sn=' + this.detailUnsettled.form.unionSn)
        }
        const _this = this
        this.detailUnsettled.isDownloading = true
        downloadFileByAjax({
          url: downloadUrl,
          method: 'GET',
          fileName: '店铺账单明细(已结算).xls',
          emptyCallback: () => {
            _this.detailUnsettled.isDownloading = false
            alert('暂无记录')
          },
          completeCallback: () => {
            _this.detailUnsettled.isDownloading = false
          }
        })
      }
    },
    async getAllFinance() {
      const { data } = await getFinanceSummaryInfo({ selectYxStoreId: this.storeId })
      if (data) {
        this.cardList[0].sum = data.turnover ? data.turnover : '00.00'
        this.cardList[1].sum = data.withdrawal ? data.withdrawal : '00.00'
        this.cardList[2].sum = data.noWithdrawal ? data.noWithdrawal : '00.00'
        this.cardList[3].sum = data.platformAllowance ? data.platformAllowance : '00.00'
        this.cardList[4].sum = data.storeAllowance ? data.storeAllowance : '00.00'
        this.cardList[5].sum = data.fee ? data.fee : '00.00'
        this.cardList[6].sum = data.settled ? data.settled : '00.00'
        this.cardList[7].sum = data.unSettled ? data.unSettled : '00.00'
      }
      // console.log(data)
    },
    // 获取账单信息
    async getBillmsg(params) {
      this.billMsg.loading = true
      var obj = {
        pageNo: this.billMsg.page,
        pageSize: this.billMsg.pageSize,
        selectYxStoreId: this.storeId
      }
      if (params) {
        Object.assign(obj, params)
      }
      if (this.billMsg.timeCopy) {
        obj.beginDateTime = Math.floor(moment(this.billMsg.timeCopy[0]).valueOf() / 1000)
        obj.endDateTime = Math.floor(moment(this.billMsg.timeCopy[1]).valueOf() / 1000)
      }
      const { data } = await getYxStoreBillInfo(obj)
      // console.log(data)

      if (data && data.results.length > 0) {
        this.billMsg.data = data.results
        // this.billMsg.page = data.pageNum
        // this.billMsg.pageSize = data.pageSize
        this.billMsg.total = data.totalRecord
        this.billMsg.hasLoadData = true
        this.billMsg.loading = false
        // console.log(this.billMsg.data)
      } else {
        this.billMsg.data = []
        this.billMsg.total = 0
        this.billMsg.loading = false
      }
    },
    // 账单信息搜索
    billMsgSearch() {
      if (this.billMsg.time) {
        this.billMsg.timeCopy = []
        this.billMsg.timeCopy[0] = this.billMsg.time[0]
        this.billMsg.timeCopy[1] = this.billMsg.time[1]
      } else {
        this.billMsg.timeCopy = ''
      }
      // console.log(this.billMsg.timeCopy)
      this.getBillmsg()
    },
    billMsgPageChange(page) {
      var params = {
        pageNo: page
      }
      this.billMsg.page = page
      // console.log(this.billMsg.page)
      this.getBillmsg(params)
    },
    billMsgSizeChange(size) {
      console.log(this.billMsg.page)

      var params = {
        pageSize: size
      }
      this.billMsg.pageSize = size
      this.billMsg.page = 1
      this.getBillmsg(params)
    },
    // 获取账单明细
    async getBillDetail(params, type) {
      type === 0 ? this.detailSettled.loading = true : this.detailUnsettled.loading = true
      var obj = {
        pageNo: 1,
        pageSize: 10,
        settleType: 0,
        selectYxStoreId: this.storeId
      }
      if (params) {
        Object.assign(obj, params)
      }
      // 从formCopy里装载搜索参数
      var form
      if (type === 0) {
        form = this.detailSettled.formCopy
      } else if (type === 1) {
        form = this.detailUnsettled.formCopy
      }
      if (form.orderStatus !== '' && form.orderStatus !== -1) { obj.orderStatus = form.orderStatus } // -1全部状态的时候后端接口没给参数，暂时不传
      if (form.orderType !== '') { obj.orderType = form.orderType }
      obj.settleType = form.settleType
      if (form.sn) { obj.sn = form.sn }
      if (form.unionSn) { obj.unionSn = form.unionSn }
      if (form.time) {
        obj.beginDateTime = Math.floor(moment(form.time[0]).valueOf() / 1000)
        obj.endDateTime = Math.floor(moment(form.time[1]).valueOf() / 1000)
      }
      // console.log(obj)

      const { data } = await getYxStoreBillDetailInfo(obj)
      // console.log(data)
      if (data) {
        if (obj.settleType === 0) {
          this.detailSettled.data = data.results
          this.detailSettled.total = data.totalRecord
          this.detailSettled.hasLoadData = true
          this.detailSettled.loading = false
        } else {
          this.detailUnsettled.data = data.results
          this.detailUnsettled.total = data.totalRecord
          this.detailUnsettled.hasLoadData = true
          this.detailUnsettled.loading = false
        }
      } else {
        this.detailSettled.loading = false
        this.detailUnsettled.loading = false
      }
    },
    // 账单明细搜索
    detailSearch(form) {
      // 拷贝一份form数据给getBillDetail使用
      var objDeepCopy = function(source) {
        var sourceCopy = source instanceof Array ? [] : {}
        for (var item in source) {
          sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
        }
        return sourceCopy
      }
      if (form.settleType === 0) {
        this.detailSettled.formCopy = objDeepCopy(form)
        if (form.time) {
          this.detailSettled.formCopy.time = []
          this.detailSettled.formCopy.time[0] = form.time[0]
          this.detailSettled.formCopy.time[1] = form.time[1]
        } else {
          this.detailSettled.formCopy.time = ''
        }
        this.getBillDetail({ pageSize: this.detailSettled.pageSize }, 0)
      } else if (form.settleType === 1) {
        this.detailUnsettled.formCopy = objDeepCopy(form)
        if (form.time) {
          this.detailUnsettled.formCopy.time = []
          this.detailUnsettled.formCopy.time[0] = form.time[0]
          this.detailUnsettled.formCopy.time[1] = form.time[1]
        } else {
          this.detailUnsettled.formCopy.time = ''
        }
        this.getBillDetail({ pageSize: this.detailUnsettled.pageSize }, 1)
      }
      // console.log(this.detailSettled.formCopy, this.detailUnsettled.formCopy)
    },
    settledSizeChange(size) {
      var params = {
        pageSize: size,
        settleType: 0
      }
      this.detailSettled.page = 1
      this.detailSettled.pageSize = size
      // console.log(this.detailSettled.page)

      this.getBillDetail(params, 0)
    },
    settledPageChange(page) {
      var params = {
        pageNo: page,
        pageSize: this.detailSettled.pageSize,
        settleType: 0
      }
      this.detailSettled.page = page
      this.getBillDetail(params, 0)
    },
    unSettledSizeChange(size) {
      var params = {
        pageSize: size,
        settleType: 1
      }
      this.detailUnsettled.page = 1
      this.detailUnsettled.pageSize = size
      this.getBillDetail(params, 1)
    },
    unSettledPageChange(page) {
      var params = {
        pageNo: page,
        pageSize: this.detailUnsettled.pageSize,
        settleType: 1
      }
      this.detailUnsettled.page = page
      this.getBillDetail(params, 1)
    },
    tabclick(tab) {
      if (tab === '1') {
        this.activeName = 'first'
      } else {
        this.activeName = 'second'
        if (this.detailSettled.hasLoadData) return
        this.getBillDetail(null, 0)
      }
    }

  }
}
</script>

<style lang="scss">
.finance-detail{
  .el-pagination__total, .el-pagination__sizes {
    float: none;
}
  &-title{
    padding: 3px 0 15px 0;
    font-size: 23px;
    font-weight: 500;
  }
  &-tab{
    display: flex;
    padding-bottom: 15px;
    .tab{
      background-color: #fff;
      margin-right: 12px;
      border-radius: 4px;
    }
    .el-radio{
      margin-right: 0;
      background-color: #fff;
      border: 1px solid #fff;
      .el-radio__input{
        display: none;
      }
    }
    .el-radio.is-checked{
      margin-right: 0;
      background-color: #fff;
      background-color: rgba(248, 83, 64, 0.1);
    }
  }
  &-content{
    background-color: #fff;
    border-radius: 4px;
    .el-tabs__header{
      display: none;
    }
    .detailtab{
      // padding-top: 8px;
      .el-tabs__header{
      padding-top: 8px;
      display: block;
      margin-bottom: 0;
      border-left: 1px solid #EBEEF5;
  border-right: 1px solid #EBEEF5;
      }
      .el-tabs__nav-wrap::after{
      background-color: #fff;
      }
      .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2), .el-tabs--bottom .el-tabs__item.is-top:nth-child(2), .el-tabs--top .el-tabs__item.is-bottom:nth-child(2), .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
       padding-left: 30px !important;
      }

    }
    .msgtab{
      .msg-filter{
        padding-top: 15px;
      }
    }
  }
}
</style>
