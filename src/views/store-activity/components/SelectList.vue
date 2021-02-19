<template>
  <div class="select-list">
    <el-table
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      :row-key="handleReserve"
      :data="data"
      style="width: 100%"
    >
      <el-table-column
        label="活动ID"
        width="80"
        align="left"
        type="selection"
        :reserve-selection="true"
      >
        <!-- <template slot="header">
          <div style="padding-left:10px"></div>
        </template>
        <template slot-scope="scope">
          <div style="padding-left:10px">
            <el-checkbox v-model="scope.row.checked"></el-checkbox>
          </div>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="planId"
        label="商品编码"
        min-width="100"
        align="left"
      >
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.planId }}</span><br> -->
          <span>{{ scope.row.productId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="listOrder"
        label="商品名称"
        min-width="150"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            {{ scope.row.drugName }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="title"
        label="活动名称"
        min-width="250"
        align="left"
      /> -->
      <el-table-column prop="img" label="规格" min-width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.pack }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="批准文号"
        min-width="120"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            {{ scope.row.approval }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="生产厂家"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.factoryName }}
        </template>
      </el-table-column>
      <el-table-column
        prop="storeNum"
        label="价格"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.price }}</span>
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
  name: 'selectList'
})
export default class extends Vue {
  @Prop({ default: Object }) private data!: [];
  @Prop({ default: Object }) private checkproducts!: any[];
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
  // @Watch("checkproducts", { deep: true })
  // private checkProductsChange(value: any[]) {
  //   //在爷爷组件里修改checkproducts，checkbox选择状态也需要修改
  //   console.log(value);
  //   // console.log(this.multipleSelection);

  //   this.multipleSelection = [];
  // }
  @Watch('data', { deep: true })
  private dataChange(value: any[]) {
    // this.multipleSelection = [];
    console.log(this.checkproducts)

    var exist = false
    this.$nextTick(() => {
      // 每次加载数据，根据已选checkproducts来改变checkbox状态
      this.data.forEach((row: any) => {
        for (let i = 0; i < this.checkproducts.length; i++) {
          if (this.checkproducts[i].productId === row.productId) {
            exist = true
            break
          }
        }
        if (exist) {
          (this.$refs.multipleTable as Vue & {
            toggleRowSelection: Function
          }).toggleRowSelection(row, true)
        } else {
          (this.$refs.multipleTable as Vue & {
            toggleRowSelection: Function
          }).toggleRowSelection(row, false)
        }
        exist = false
      })
    })
  }

  // @Watch("deleteproduct", { deep: true })
  // private deleteProductChange(value: any) {
  //   //在爷爷组件里修改checkproducts，checkbox选择状态也需要修改
  //   // console.log(value);
  //   this.removeName(value);
  //   // this.multipleSelection = value;
  // }
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

  @Emit('selectchange')
  private selectChangeHandle(val: any[]) {
    return val
    // return将要传递的值
  }

  private pageNo = 1;
  // private multipleSelection: any[] = [];

  public get currPageSize() {
    return this.pageSize
  }

  public set currPageSize(val: number) {
    // this.$emit("update:pageSize", val);
    console.log('pagechange')

    this.pageSizeHandle(val)
  }

  // public get multipleSelection(): any[] {
  //   console.log(this.checkproducts);

  //   return this.checkproducts;
  // }
  // public set multipleSelection(val: any[]) {}
  private multipleSelection: any[] = [];

  private handleSelectionChange(val: any[]) {
    // console.log(val);

    this.multipleSelection = val
    this.selectChangeHandle(val) // 给爷爷组件的checkproducts传选择的值
  }

  private handleReserve(row: any) {
    // 重新加载数据记录选中状态
    return row.productId
  }

  // private removeName(item: any) {
  //   // 删除,取消表格选中
  //   const arr = this.data.filter((sub: any) => {
  //     return sub.productId === item.productId;
  //   }); // 取消当前表格里的选中状态时,用表格里的数据
  //   const row = arr.length ? arr[0] : item;
  //   console.log(row);

  //   this.$refs.multipleTable &&
  //     (this.$refs.multipleTable as Vue & {
  //       toggleRowSelection: Function;
  //     }).toggleRowSelection(row, false);
  // }

  private handleSizeChange(val: number) {
    this.currPageSize = val // 强制设置pageSize
    // this.$emit("update:page", 1);
    this.pageHandle(1)
    // this.$emit("search", { page: 1, pageSize: val });
    this.searchHandle()
  }

  private handleCurrentChange(val: number) {
    // console.log(val);
    // this.$emit("update:page", val);
    this.pageHandle(val)
    // this.$emit("search");
    this.searchHandle()
  }
}
</script>
<style lang="scss">
.select-list {
  .el-pagination__sizes,
  .el-pagination__jump {
    display: none !important;
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
