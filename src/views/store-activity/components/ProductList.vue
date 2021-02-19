<template>
  <div class="product-list">
    <!-- <el-input
      ref="input"
      v-model="currPageSize"
      placeholder=""
      size="normal"
      clearable
    ></el-input> -->

    <el-table :data="productsData" style="width: 100%">
      <el-table-column
        prop="drugStoreBranchId"
        label="活动ID"
        width="80"
        align="left"
        header-align="left"
      >
        <template slot="header">
          <div style="padding-left:10px">
            排序
          </div>
        </template>
        <template slot-scope="scope">
          <div v-show="!scope.row.edit" class="order">
            <span class="num">{{ scope.row.listOrder }}</span>
            <el-button type="text" class="edit" @click="editOrder(scope.row)"
              >修改</el-button
            >
          </div>
          <div v-show="scope.row.edit" class="order">
            <el-input
              :class="'inp' + scope.row.productId"
              v-model="scope.row.listOrder"
              size="small"
              @blur="blurOrder(scope.row)"
            ></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="planId"
        label="商品信息"
        min-width="150"
        align="left"
      >
        <template slot-scope="scope">
          <div>
            <div class="nowrap">
              <span style="color:#909399">商品名称：</span
              ><span>{{ scope.row.drugName }}</span>
            </div>
            <div class="nowrap">
              <span style="color:#909399">批准文号：</span
              ><span>{{ scope.row.approval }}</span>
            </div>
            <div class="nowrap">
              <span style="color:#909399">厂家：</span
              ><span>{{ scope.row.factoryName }}</span>
            </div>
            <div class="nowrap">
              <span style="color:#909399">规格：</span
              ><span>{{ scope.row.pack }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="salePrice"
        label="零售价"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          <div class="price" v-if="status!==2">
            <span class="yuan">￥</span>
            <el-input
              :class="'price' + scope.row.productId"
              v-model="scope.row.price"
              size="small"
              clearable
              @blur="blurInput('price', scope.row)"
            ></el-input>
          </div>
          <div class="price" v-else>
            <span>{{scope.row.price}}</span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="title"
        label="活动名称"
        min-width="250"
        align="left"
      /> -->
      <el-table-column prop="img" label="划线价" width="140" align="center">
        <template slot-scope="scope">
          <div class="price" v-if="status!==2">
            <span class="yuan">￥</span>
            <el-input
              :class="'linePrice' + scope.row.productId"
              v-model="scope.row.linePrice"
              size="small"
              clearable
              @blur="blurInput('linePrice', scope.row)"
            ></el-input>
          </div>
          <div class="price" v-else>
            <span>{{scope.row.linePrice}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="实际库存" width="140" align="center">
        <template slot-scope="scope">
          <div>
            {{ scope.row.stock }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="maxAmount"
        label="活动总数"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <el-input
          v-if="status!==2"
            :class="'maxAmount' + scope.row.productId"
            v-model="scope.row.maxAmount"
            size="small"
            clearable
            @blur="blurInput('maxAmount', scope.row)"
          ></el-input>
          <div v-else>
            <span>{{scope.row.maxAmount}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="收入" width="140" align="center">
        <template slot-scope="scope">
          <div>
            {{ scope.row.income }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="storeNum"
        label="每人限购"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div v-if="status!==2">
            <el-input
              :class="'buyLimit' + scope.row.productId"
              v-model="scope.row.buyLimit"
              size="small"
              clearable
              @blur="blurInput('buyLimit', scope.row)"
            ></el-input>
          </div>
          <div v-else>
            <span>{{scope.row.buyLimit}}</span>
          </div>
          <!-- <el-button type="text" >查看</el-button> -->
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
          <el-button
            type="text"
            @click="$emit('deletproducts', scope.row.productId)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- <div class="pagination-container">
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
    </div> -->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from 'vue-property-decorator'

export interface RegProps {
  listOrder: RegExp
  price: RegExp
  linePrice: RegExp
  maxAmount: RegExp
  buyLimit: RegExp
}

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

  @Watch('errorRow', { deep: true })
  private errorRowChange(value: number) {
    value === -1 ? this.errorHandle(false) : this.errorHandle(true)
    // if (value !==-1) this.errorHandle(false);
  }

  @Watch('data', { deep: true })
  private onDataChange(value: any[]) {
    // 需要使用watch，重新赋值data，v-model才会更新
    this.productsData = value
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

  @Emit('inputerror')
  private errorHandle(val: boolean) {
    return val
    // return将要传递的值
  }

  private pageNo = 1;
  private productsData: any[] = [];
  private reg: RegProps = {
    listOrder: /^\d+$/,
    price: /^(([0-9]+)|([0-9]+\.[0-9]{1,2}))$/,
    linePrice: /^(([0-9]+)|([0-9]+\.[0-9]{1,2}))$/,
    maxAmount: /^\d+$/,
    buyLimit: /^\d+$/
  };

  private errorRow = -1;

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

  private editOrder(row: any) {
    if (this.errorRow !== -1) {
      // 如果已经有一个输入框出现错误focus了，保持这个focus直到修改正确，
      (document.getElementsByClassName('inp' + this.errorRow)[0]
        .childNodes[1] as HTMLDivElement).focus()
    } else {
      this.$set(row, 'edit', true)
      this.$nextTick(() => {
        (document.getElementsByClassName('inp' + row.productId)[0]
          .childNodes[1] as HTMLDivElement).focus()
      })
    }
  }

  private blurOrder(row: any) {
    if (
      !this.reg.listOrder.test(row.listOrder) ||
      Number(row.listOrder) < 1 ||
      Number(row.listOrder) > 99999
    ) {
      this.$message.error('请输入1-99999的整数');
      (document.getElementsByClassName('inp' + row.productId)[0]
        .childNodes[1] as HTMLDivElement).focus()
      this.errorRow = row.productId // 保存错误的id
    } else {
      this.errorRow = -1 // 错误id重置
      this.$set(row, 'edit', false)
    }
  }

  private blurInput(type: string, row: any) {
    switch (type) {
      case 'price':
        if (!this.reg.price.test(row.price)) {
          this.$message.error('请输入小数点不多于两位的正数');
          (document.getElementsByClassName('price' + row.productId)[0]
            .childNodes[1] as HTMLDivElement).focus()
          this.errorRow = row.productId
        } else {
          this.errorRow = -1
        }
        break
      case 'linePrice':
        if (!this.reg.linePrice.test(row.linePrice)) {
          this.$message.error('请输入小数点不多于两位的正数');
          (document.getElementsByClassName('linePrice' + row.productId)[0]
            .childNodes[1] as HTMLDivElement).focus()
          this.errorRow = row.productId
        } else {
          this.errorRow = -1
        }
        break
      case 'maxAmount':
        if (
          !this.reg.maxAmount.test(row.maxAmount) ||
          Number(row.maxAmount) < 1
        ) {
          this.$message.error('请输入大于0的整数');
          (document.getElementsByClassName('maxAmount' + row.productId)[0]
            .childNodes[1] as HTMLDivElement).focus()
          this.errorRow = row.productId
        } else {
          this.errorRow = -1
        }
        break
      case 'buyLimit':
        if (
          !this.reg.buyLimit.test(row.buyLimit) ||
          Number(row.buyLimit) < 1
        ) {
          this.$message.error('请输入大于0的整数');
          (document.getElementsByClassName('buyLimit' + row.productId)[0]
            .childNodes[1] as HTMLDivElement).focus()
          this.errorRow = row.productId
        } else {
          this.errorRow = -1
        }
        break
    }
  }
}
</script>
<style lang="scss">
.product-list {
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
      width: 40px;
      text-align: center;
      // vertical-align: -2px;
      padding-top: 1px;
    }
    .edit {
      display: inline-block;
      width: 40px;
      text-align: left;
      vertical-align: middle;
    }
  }
  .nowrap {
    // display: inline-block;
    // width: 100px;
    word-wrap: nowrap;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    .nowrap {
      vertical-align: middle;
    }
  }
  .price {
    .yuan {
      display: inline-block;
      // float: left;
      // width: 10%;
      margin-right: 4px;
    }
    .el-input {
      display: inline-block;
      width: 80%;
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
