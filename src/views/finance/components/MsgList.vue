<template>
  <div class="msg-list">
    <el-table
      :data="data"
      style="width: 100%"
    >
      <el-table-column
        prop="dateValue"
        label="时间"
        min-width="100"
        align="left"
      >
        <template slot="header">
          <span style="padding-left:55px">时间</span>
        </template>
        <template slot-scope="scope">
          <span style="padding-left:30px">{{ formatTime(scope.row.dateValue) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="有效订单"
        min-width="100"
        align="center"
      />
      <el-table-column
        prop="turnover"
        label="店铺流水/元"
        min-width="100"
        align="center"
      />
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
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

@Component({
  name: 'MsgList'
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

  private formatTime(str:string) {
    if (typeof (str) !== 'string') { return }
    return str.split('T').join(' ')
  }
}
</script>

<style lang="scss">
.msg-list{
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

// .el-pagination__total,
// .el-pagination__sizes {
//   float: left;
// }

.pagination-container.hidden {
  display: none;
}

}
</style>
