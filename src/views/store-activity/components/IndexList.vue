<template>
  <div class="index-list">
    <el-table :data="data" style="width: 100%">
      <el-table-column
        prop="drugStoreBranchId"
        label="活动ID"
        min-width="80"
        align="left"
        header-align="left"
      >
        <template slot="header">
          <div style="padding-left:10px">
            活动ID
          </div>
        </template>
        <template slot-scope="scope">
          <div style="padding-left:10px">
            <!-- <span>药师帮店铺ID：{{ scope.row.drugStoreBranchId }}</span><br> -->
            <span>{{ scope.row.planId }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="planId"
        label="活动名称"
        min-width="100"
        align="left"
      >
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.planId }}</span><br> -->
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!(status === 2)"
        prop="listOrder"
        label="排序"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div class="order">
            <el-input
              v-if="scope.row.edit"
              :ref="'inp' + scope.row.planId"
              v-model="scope.row.oldOrder"
              size="small"
              clearable
              @blur="orderBlur($event, scope.row)"
            />

            <span v-else class="num">{{ scope.row.listOrder }}</span>
            <el-button
              v-if="!(status === 2) && !scope.row.edit"
              style="margin-left:auto"
              type="text"
              size="default"
              class="iconfont icon-xiugai"
              @click="orderClick(scope.row)"
            />
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="title"
        label="活动名称"
        min-width="250"
        align="left"
      /> -->
      <el-table-column
        prop="img"
        label="活动图片"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-image style="width: 130px;" :src="scope.row.img" />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="活动时间"
        min-width="180"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            {{ formatTime(scope.row.beginDatetime) }}<br />
            {{ formatTime(scope.row.endDatetime) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="productNum"
        label="商品数"
        width="80"
        align="center"
      />
      <el-table-column prop="name" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ formatStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="storeNum"
        label="参与门店"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div class="join-store">
            <span>{{ scope.row.storeNum }}</span>
            <i
              class="icon-right"
              @click="
                $router.push({
                  name: 'StoreList',
                  query: {id: scope.row.planId, status: scope.row.status}
                })
              "
            />
          </div>
          <!-- <el-button type="text" >查看</el-button> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="couponNum"
        label="优惠券"
        width="80"
        align="center"
      />
      <el-table-column
        prop="name"
        label="创建时间"
        min-width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.ctime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        width="100"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <div v-if="status === 2">
            <el-button
              type="text"
              @click="
                $router.push({
                  name: 'ActivityDetail',
                  query: {id: scope.row.planId, status: scope.row.status}
                })
              "
              >查看</el-button
            ><br />
            <!-- <el-button
              type="text"
              @click="
                $router.push({
                  name: 'CouponList',
                  query: {
                    id: scope.row.planId,
                    status: scope.row.status,
                    name: scope.row.title,
                    btime: scope.row.beginDatetime,
                    etime: scope.row.endDatetime
                  }
                })
              "
              >优惠券</el-button -->
          </div>
          <div v-else>
            <el-button
              type="text"
              @click="
                $router.push({
                  name: 'EditActivity',
                  query: {id: scope.row.planId, status: scope.row.status}
                })
              "
              >编辑</el-button
            ><br />
            <!-- <el-button
              type="text"
              @click="
                $router.push({
                  name: 'CouponList',
                  query: {
                    id: scope.row.planId,
                    status: scope.row.status,
                    name: scope.row.title,
                    btime: scope.row.beginDatetime,
                    etime: scope.row.endDatetime
                  }
                })
              "
              >优惠券</el-button
            ><br /> -->
            <el-button type="text" @click="$emit('end', scope.row.planId)"
              >结束</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-if="total > 0"
        background
        layout="total,prev, pager, next,sizes,jumper"
        :current-page.sync="pageNo"
        :page-size.sync="currPageSize"
        :page-sizes="pageSizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from 'vue-property-decorator'

@Component({
  name: 'cards'
})
export default class extends Vue {
  @Prop({ default: () => [] }) private data!: [];
  @Prop({ default: 0 }) private total!: number;
  @Prop({ default: 1 }) private page!: number;
  @Prop({ default: 20 }) private pageSize!: number;
  @Prop({
    default: () => {
      return [10, 20, 50, 100]
    }
  })
  private pageSizes!: [];

  @Prop({ default: 1 }) private status!: number;

  @Watch('page', { deep: true })
  private onPageChange(value: number) {
    if (value === 1) this.pageNo = 1
  }

  @Emit('update:pageSize')
  private pageSizeHandle(val: number) {
    return val // return将要传递的值
  }

  @Emit('update:page')
  private pageHandle(val: number) {
    return val // return将要传递的值
  }

  @Emit('search')
  private searchHandle() {
    // return将要传递的值
  }

  private pageNo = 1;

  public get currPageSize() {
    return this.pageSize
  }

  public set currPageSize(val: number) {
    // this.$emit("update:pageSize", val);
    console.log('pagechange')

    this.pageSizeHandle(val)
  }

  private handleSizeChange(val: number) {
    this.currPageSize = val // 强制设置pageSize
    // this.$emit("update:page", 1);
    this.pageHandle(1)
    // this.$emit("search", { page: 1, pageSize: val });
    this.searchHandle()
  }

  private handleCurrentChange(val: number) {
    console.log(val)
    // this.$emit("update:page", val);
    this.pageHandle(val)
    // this.$emit("search");
    this.searchHandle()
  }

  private formatTime(str: string) {
    if (typeof str !== 'string') {
      return
    }
    return str.split('T').join(' ')
  }

  private formatStatus(status: number) {
    if (status === 1) {
      return '进行中'
    } else if (status === 0) {
      return '未开始'
    } else {
      return '已结束'
    }
  }

  private orderClick(row: any) {
    setTimeout(() => {
      this.$nextTick(function() {
        (this.$refs['inp' + row.planId] as HTMLDivElement).focus()
      })
    }, 0)
    // 通过点击修改图标，设置scope.row.edit属性让表格重新渲染出输入框
    this.$set(row, 'edit', true)
    this.$set(row, 'oldOrder', row.listOrder)
  }

  private orderBlur(e: any, row: any) {
    //   this.$refs['inp+' + row.planId].focus()
    //   console.log(e)
    var reg = /^\d+$/
    if (
      !reg.test(e.target.value) ||
      Number(e.target.value) < 1 ||
      Number(e.target.value) > 99999
    ) {
      this.$message.error('请输入1-99999的整数')
      row.oldOrder = row.listOrder
      this.$set(row, 'edit', false)
    } else if (Number(e.target.value) === row.oldOrder) {
      this.$set(row, 'edit', false)
    } else {
      row.listOrder = row.oldOrder
      this.$emit('changeOrder', row.listOrder, row.planId)
      this.$set(row, 'edit', false)
    }
  }
}
</script>
<style lang="scss">
.index-list {
  .join-store {
    display: flex;
    align-items: center;
    padding-left: 20px;
    .icon-right {
      display: block;
      width: 16px;
      height: 16px;
      //   background: url("~@/assets/common/icon-more.svg") no-repeat;
      margin: 0 0 2px 5px;
      cursor: pointer;
    }
  }
  .el-table {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .order {
    display: flex;
    align-items: center;
    justify-content: center;
    .num {
      display: inline-block;
      width: 60%;
      text-align: center;
      // vertical-align: -2px;
      padding-top: 1px;
    }
    .iconfont {
      display: inline-block;
      width: 40%;
      text-align: left;
      vertical-align: middle;
    }
  }
  .cell {
    .el-button--text {
      padding: 0px 0;
    }
  }
  .pagination-container {
    padding: 32px 0;
    text-align: right;
  }

  .el-pagination__total,
  .el-pagination__sizes {
    float: none;
  }

  .pagination-container.hidden {
    display: none;
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    background-color: #fff;
  }
  .el-table__fixed-right {
    height: 100% !important;
  }
}
</style>
