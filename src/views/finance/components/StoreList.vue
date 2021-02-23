<template>
  <div class="store-list">
    <el-table
      :data="data"
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="planId"
        min-width="80"
        align="left"
      >
        <template slot="header">
          <span style="padding-left:10px">药店ID</span>
        </template>
        <template slot-scope="scope">
          <span style="padding-left:10px">{{ scope.row.drugStoreBranchId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed
        prop="storeName"
        label="药店名称"
        min-width="100"
        align="left"
      />
      <el-table-column
        fixed
        prop="directorName"
        label="店长"
        min-width="100"
        align="left"
      >
        <template slot-scope="scope">
          <span>店长：{{ scope.row.managerName }}</span><br>
          <span>手机号：{{ scope.row.managerPhoneNo }}</span><br>
        </template>
      </el-table-column>
      <el-table-column
        prop="turnover"
        label="店铺流水/元"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.turnover!==null">{{ scope.row.turnover }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="unsettled"
        label="待结算/元"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.unsettled!==null">{{ scope.row.unsettled }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="withdrawal"
        label="可提现/元"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.withdrawal!==null">{{ scope.row.withdrawal }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="noWithdrawal"
        label="不可提现/元"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.noWithdrawal!==null">{{ scope.row.noWithdrawal }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="withdrawn"
        label="已提现/元"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.withdrawn!==null">{{ scope.row.withdrawn }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="storeAllowance"
        label="店铺补贴/元"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.storeAllowance!==null">{{ scope.row.storeAllowance }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="$router.push({name: 'FinanceDetail',query: {storeId: scope.row.yxStoreId,storeName: scope.row.storeName}})"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-show="total"
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, prev, pager, next, sizes, jumper"
        background
        @size-change="$emit('sizechange',$event)"
        @current-change="$emit('pagechange',$event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from 'vue-property-decorator'

@Component({
  name: 'StoreList'
})
export default class extends Vue {
  @Prop({ default: () => [] }) private data!: [];
  @Prop({ default: 0 }) private total!: number;
  @Prop({ default: 1 }) private page!: number;
  @Prop({ default: 10 }) private pageSize!: number;
  @Prop({ default: 1 }) private status!: number;

  @Watch('page', { deep: true })
  private onPageChange(value: number) {
    if (value === 1) this.pageNo = 1
  }

  private pageNo=1
}
</script>

<style lang="scss">
.store-list{
  .el-table{
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
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
  background-color:transparent;
  text-align: right;
}

.el-pagination__total,
.el-pagination__sizes {
  // float: left;
}

.pagination-container.hidden {
  display: none;
}
.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
  background-color: #fff;
}
}
</style>
