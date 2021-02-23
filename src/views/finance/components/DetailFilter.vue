<template>
  <div class="finance-detail-filter">
    <el-form class="filter" inline size="medium">

      <el-form-item label="订单编号">
        <el-input v-model="form.sn" class="ordeID" width="100" placeholder="订单编号" size="medium" clearable @keyup.enter.native="$emit('detailSearch',form)" />
      </el-form-item>
      <el-form-item label="商户单号">
        <el-input v-model="form.unionSn" class="storeID" placeholder="商户单号" size="medium" clearable @keyup.enter.native="$emit('detailSearch',form)" />
      </el-form-item>
      <!-- <el-form-item label="城市">
          <el-cascader v-model="cityId" :props="props" placeholder="全部" />
        </el-form-item> -->
      <el-form-item label="支付/退款时间">
        <el-date-picker
          v-model="form.time"
          size="medium"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="form.orderStatus" class="select" placeholder="请选择">
          <el-option
            v-for="item in orderStatus"
            :key="item.value"
            :label="item.name"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单类型">
        <el-select v-model="form.orderType" class="select" placeholder="请选择">
          <el-option
            v-for="item in orederType"
            :key="item.value"
            :label="item.name"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="$emit('detailSearch',form)">搜索</el-button>
        <!-- <el-button @click="handleExport()">导出</el-button> -->
        <el-button size="medium" :loading="isdowning" @click="$emit('download',form.settleType)">下载</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

export interface FormProps {
  sn: string
  unionSn: string
  time: string
  orderStatus: number
  orderType: number
}

@Component({
  name: 'activityFilter'
})
export default class extends Vue {
  @Prop({ required: true })
  private form!: FormProps;

  @Prop({ default: false }) private isdowning!: boolean;

  private orderStatus=[
    { name: '全部', label: -1 },
    // { name: '待付款', label: 0 },
    { name: '待取货', label: 3 },
    { name: '已完成', label: 4 },
    { name: '已退款', label: 5 }
    // { name: '超时已取消', label: 8 }
  ]

  private orederType=[
    { name: '全部', label: -1 },
    { name: '普通订单', label: 1 }
  ]

  create() {
    console.log(this.form)
  }
}
</script>

<style lang="scss">
.finance-detail-filter{
  border-left: 1px solid #EBEEF5;
  border-right: 1px solid #EBEEF5;
  padding: 16px 0 0 19px;
  .ordeID{
    width: 130px;
  }
  .storeID,.orderStatus,.orderType{
    width: 120px;
  }
  .orderType{
    margin-right: 10px;
  }
  .select{
    .el-input__inner{
          width: 150px;
    }
  }

}
</style>
