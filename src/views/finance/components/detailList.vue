<template>
  <div class="index-list">
    <el-table
      border
      :data="data"
      style="width: 100%"
    >
      <el-table-column
        prop="storeName"
        fixed
        min-width="190"
        align="left"
      >
        <template slot="header">
          <span style="padding-left:10px">订单编号</span>
        </template>
        <template slot-scope="scope">
          <span style="padding-left:10px">{{ scope.row.sn }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed
        label="支付/退款时间"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.payTime,1) }}</span><br>
          <span>{{ formatTime(scope.row.payTime,2) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="unionSn"
        fixed
        label="商户单号"
        min-width="160"
        align="center"
      />
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        min-width="80"
        align="center"
      />
      <!-- <template slot-scope="scope">
          <span>{{ formatStatus(scope.row.orderStatus) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="orderType"
        label="订单类型"
        min-width="80"
        align="center"
      />
      <!-- <template slot-scope="scope">
          <span>{{ formatType(scope.row.orderType) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="productAllPrice"
        label="商品原价"
        min-width="90"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.productAllPrice!==null&&!scope.row.refundMoney">{{ scope.row.productAllPrice }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="platformAllowance"
        label="平台补贴"
        min-width="90"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.platformAllowance!==null&&!scope.row.refundMoney">{{ scope.row.platformAllowance }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="storeAllowance"
        label="店铺补贴"
        min-width="90"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.storeAllowance!==null&&!scope.row.refundMoney">{{ scope.row.storeAllowance }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="userPay"
        label="用户实付"
        min-width="90"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.userPay!==null&&!scope.row.refundMoney">{{ scope.row.userPay }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="fee"
        label="平台服务费"
        min-width="90"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.fee!==null&&!scope.row.refundMoney">{{ scope.row.fee }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="refundMoney"
        label="退款金额"
        min-width="90"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.refundMoney">{{ scope.row.refundMoney }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="settleMoney"
        :label="type?'结算金额':'待结算金额'"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.settleMoney!==null&&!scope.row.refundMoney">{{ scope.row.settleMoney }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="type"
        prop="settleDateTime"
        label="结算时间"
        min-width="120"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.settleDateTime!==null&&scope.row.settleDateTime!==''">
            <span>{{ formatTime(scope.row.settleDateTime,1) }}</span><br>
            <span>{{ formatTime(scope.row.settleDateTime,2) }}</span>
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-show="total"
        :current-page="pageNo"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, prev, pager, next, sizes, jumper"
        background
        @size-change="sizeChange($event)"
        @current-change="pageChange($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

@Component({
  name: 'DetailList'
})
export default class extends Vue {
  @Prop({ default: () => [] }) private data!: [];
  @Prop({ default: 0 }) private total!: number;
  @Prop({ default: 1 }) private page!: number;
  @Prop({ default: 10 }) private pageSize!: number;
  @Prop({ default: 1 }) private type!: number;

  @Watch('page', { deep: true })
  private onPageChange(value: number) {
    if (value === 1) this.pageNo = 1
  }

  private pageNo=1

  private formatTime(str:string, type:number) {
    if (typeof (str) !== 'string' || !str) { return }
    if (type === 1) { return moment(str).format('YYYY-MM-DD') }
    if (type === 2) { return moment(str).format('HH:MM:SS') }
  }

  private formatStatus(status:string) {
    if (status === '0') {
      return '待付款'
    } else if (status === '3') {
      return '待核销'
    } else if (status === '4') {
      return '已核销'
    } else if (status === '5') {
      return '已退款'
    } else if (status === '8') {
      return '超时已取消'
    } else {
      return '其他'
    }
  }

  private formatType(type:string) {
    if (type === '1' || type === '-1') {
      return '普通订单'
    } else {
      return '其他订单'
    }
  }

  private sizeChange(e:any) {
    if (this.type === 0) {
      this.$emit('sizechange', e)
    } else {
      this.$emit('sizechange', e)
    }
  }

  private pageChange(e:any) {
    if (this.type === 0) {
      this.$emit('pagechange', e)
    } else {
      this.$emit('pagechange', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.index-list{
    .order{
        display: flex;
        align-items: center;
        justify-content: center;
        .num{
            display: inline-block;
            width: 60%;
            text-align: center;
            // vertical-align: -2px;
            padding-top: 1px;
        }
        .iconfont{
            display: inline-block;
            width: 40%;
            text-align: left;
            vertical-align: middle;
        }
    }
    .cell{
    .el-button--text{
    padding: 0px 0;
  }
  }
  .pagination-container {
  padding: 32px 0;
  text-align: right;
}

.el-pagination__total,
.el-pagination__sizes {
  float: left;
}

.pagination-container.hidden {
  display: none;
}
}
</style>
