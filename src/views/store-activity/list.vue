<template>
  <div class="activity">
    <div class="filter">
      <activity-filter :form="form" :shops="shops" @search="clickSearch" />
    </div>
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
      <el-tab-pane :label="'进行中(' + onGoing.total + ')'" name="first">
        <index-list
          v-loading="loading"
          :data="onGoing.list"
          :total="onGoing.total"
          :status="onGoing.status"
          :page.sync="onGoing.pageNo"
          :page-size.sync="onGoing.pageSize"
          @search="handleSearch(1)"
          @changeOrder="changeOrder"
          @end="changeStatus"
        />
        <!-- <list
          v-loading="loading"
          :data="onGoing.list"
          @changeOrder="changeOrder"
          @end="changeStatus"
        /> -->
      </el-tab-pane>
      <el-tab-pane :label="'未开始(' + noStart.total + ')'" name="second">
        <index-list
          v-loading="loading"
          :data="noStart.list"
          :total="noStart.total"
          :status="noStart.status"
          :page.sync="noStart.pageNo"
          :page-size.sync="noStart.pageSize"
          @search="handleSearch(0)"
          @changeOrder="changeOrder"
          @end="changeStatus"
        />
        <!-- <list v-loading="loading" :data="noStart.list" @changeOrder="changeOrder" @end="changeStatus" /> -->
      </el-tab-pane>
      <el-tab-pane :label="'已结束(' + hadFinish.total + ')'" name="third">
        <index-list
          v-loading="loading"
          :data="hadFinish.list"
          :total="hadFinish.total"
          :page.sync="hadFinish.pageNo"
          :page-size.sync="hadFinish.pageSize"
          :status="hadFinish.status"
          @search="handleSearch(2)"
          @changeOrder="changeOrder"
        />
        <!-- <list v-loading="loading" :status="hadFinish.status" :data="hadFinish.list" :total="hadFinish.total" :page.sync="hadFinish.pageNo" :page-size.sync="hadFinish.pageSize" @search="pageChange" @changeOrder="changeOrder" /> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import moment from 'moment'

import { Component, Watch, Vue } from 'vue-property-decorator'
import ActivityFilter, { FormProps } from './components/Filter.vue'
import IndexList from './components/IndexList.vue'

import { getStorePlan, endActivity } from '@/api/activity'
import { getIdNameList } from '@/api/shop'

export interface TableProps {
  list: any[]
  total: number
  pageNo: number
  pageSize: number
  status: number
}
export interface SearchProps {
  status: number
  pageNo: number
  pageSize: number
  comboInfo: string
  yxStoreName: string
  beginDatetime: string
  endDatetime: string
}

@Component({
  name: 'Activity',
  components: {
    ActivityFilter,
    IndexList
  }
})
export default class extends Vue {
  private form: FormProps = {
    comboInfo: '',
    yxStoreName: '',
    time: ''
  };

  private loading = false;
  private activeName = 'first';
  private shops: any[] = [];
  private status = 1; // 当前tab的状态值;
  private onGoing: TableProps = {
    list: [],
    pageNo: 1,
    pageSize: 20,
    total: 0,
    status: 1
  };

  private noStart: TableProps = {
    list: [],
    pageNo: 1,
    pageSize: 20,
    total: 0,
    status: 0
  };

  private hadFinish: TableProps = {
    list: [],
    pageNo: 1,
    pageSize: 20,
    total: 0,
    status: 2
  };

  created() {
    this.handleSearch(1)
  }

  mounted() {
    this.getShops()
  }

  private handleClick() {
    if (this.activeName === 'first') {
      this.status = 1
    } else if (this.activeName === 'second') {
      this.status = 0
    } else if (this.activeName === 'third') {
      this.status = 2
    }
    this.handleSearch(this.status)
  }

  private async handleSearch(status: number) {
    // console.log(this.form)

    this.loading = true

    // var reg1 = /^\d+$/
    // var reg2 = /^\s+$/
    let obj: TableProps = {
      list: [],
      pageNo: 1,
      pageSize: 20,
      total: 0,
      status: 0
    }
    let pageNo: number
    let pageSize: number
    if (status === 1) {
      pageNo = this.onGoing.pageNo
      pageSize = this.onGoing.pageSize
    } else if (status === 0) {
      pageNo = this.noStart.pageNo
      pageSize = this.noStart.pageSize
    } else {
      pageNo = this.hadFinish.pageNo
      pageSize = this.hadFinish.pageSize
    }
    // console.log(pageNo)
    const params: SearchProps = {
      status,
      pageNo,
      pageSize,
      comboInfo: this.form.comboInfo,
      yxStoreName:
        this.form.yxStoreName === '全部' ? '' : this.form.yxStoreName,
      beginDatetime: this.form.time
        ? moment(this.form.time[0]).format('YYYY-MM-DD') + 'T00:00:00'
        : '',
      endDatetime: this.form.time
        ? moment(this.form.time[1]).format('YYYY-MM-DD') + 'T23:59:59'
        : ''
    }
    try {
      const { data } = await getStorePlan(params)
      if (status === 1) {
        obj = this.onGoing
      } else if (status === 0) {
        obj = this.noStart
      } else if (status === 2) {
        obj = this.hadFinish
      }
      // console.log(data)

      if (data.data.results) {
        obj.list = data.data.results
      } else {
        obj.list = []
      }
      obj.total = data.data.totalRecord
      // tab的头部数量设置
      this.onGoing.total = data.num1
      this.noStart.total = data.num0
      this.hadFinish.total = data.num2
    } catch (e) {
      console.error(e)
    }
    this.loading = false
  }

  // 根据搜索信息查找活动
  private async clickSearch() {
    this.hadFinish.pageNo = 1 // 需要重置翻页，不然再已经翻到比如第五页的时候，点击一下搜索。其实返回的是第一页的数据，但是分页组件的页码显示还是5
    this.onGoing.pageNo = 1
    this.noStart.pageNo = 1
    this.handleSearch(this.status)
  }

  // 获取筛选店铺列表
  private async getShops() {
    try {
      const res:any = await getIdNameList()
      const list:any[] = [{
        yxStoreId: 0,
        yxStoreName: '全部'
      }]
      this.shops = list.concat(res.data || [])
    } catch (e) {
      console.error(e)
    }
  }

  private changeOrder() {}
  private changeStatus(planId:number) {
    this.$confirm('是否确定要结束活动', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      const { message } = await endActivity({ planId })
      this.$message.success(message)
      this.handleSearch(this.status)
    })
  }
}
</script>

<style lang="scss">
.activity {
  .filter {
    background-color: #fff;
    border-radius: 4px;
    padding: 12px 0 0px 10px;
    margin-bottom: 8px;
  }
  .el-tabs {
    background-color: transparent !important;
    border-radius: 4px;
    .el-tabs__header {
      background-color: #fff;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
  }
  // .el-tabs{
  //   background-color: #fff;
  //   border-radius: 4px;

  // }
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__nav-wrap::after {
    background-color: #f6f6f6;
  }
  .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
  .el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
  .el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
  .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 20px !important;
  }
  .el-tabs__item {
    height: 56px;
    line-height: 56px;
  }
}
</style>
