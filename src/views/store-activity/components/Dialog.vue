<template>
  <div class="my-dialog">
    <el-dialog
      class="dialog"
      title="选择商品"
      :visible.sync="dialogVisible"
      width="60%"
      @open="getProducts"
      @close="dialogVisible = false"
    >
      <div class="dialog-select">
        <el-form class="filter" inline size="medium">
          <el-form-item label="商品信息">
            <el-input
              v-model="selectProducts.searchText"
              class="search-input"
              width="200px"
              placeholder="编码/名称/厂家/批准文号"
              clearable
              @keyup.enter.native="searchProducts"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchProducts">搜索</el-button>
          </el-form-item>
        </el-form>
        <div style="margin: 15px 0;" />
        <div class="select-list">
          <select-list
            v-loading="loading"
            v-bind="$attrs"
            v-on="$listeners"
            :data="selectProducts.list"
            :total="selectProducts.total"
            :page.sync="selectProducts.pageNo"
            :page-size.sync="selectProducts.pageSize"
            @search="getProducts"
          />
        </div>
        <div class="comfirm-btn">
          <el-button size="medium" @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button type="primary" size="medium" @click="addProducts()"
            >确认</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import moment from 'moment'

import { Component, Prop, Watch, Emit, Vue } from 'vue-property-decorator'
import { getProducts, getPlanProduct } from '@/api/activity'

import { FormData } from '../detail.vue'
import SelectList from './SelectList.vue'

export interface TableProps {
  list: any[]
  total: number
  pageNo: number
  pageSize: number
  searchText: ''
}
interface ProductQuery {
  pageNo: number
  pageSize: number
  searchInfo: string
  planId?: number
}

@Component({
  name: 'MyDialog',
  components: { SelectList }
})
export default class extends Vue {
  @Prop({ default: () => { return {} } }) private form!: FormData;
  @Prop({ default: 0 }) private pageType!: number;
  @Prop({ default: false }) private visiable!: boolean;

  //   @Watch("visiable", { deep: true })
  //   private onVisiableChange(value: boolean) {
  //     if(value){this.dialogVisible = value;}
  //   }

  @Emit('update:visiable')
  private visiableHandle(val: boolean) {
    return val // return将要传递的值
  }

  @Emit('addproducts')
  private addProductsHandle() {}

  //   private dialogVisible: boolean = false;
  private loading = false;
  private selectProducts: TableProps = {
    list: [],
    pageNo: 1,
    pageSize: 5,
    total: 0,
    searchText: ''
  };

  public get dialogVisible() {
    return this.visiable
  }

  public set dialogVisible(val: boolean) {
    this.visiableHandle(val)
  }

  private searchProducts() {
    // 打开商品列表
    this.selectProducts.pageNo = 1
    this.getProducts()
  }

  private async getProducts() {
    // params是翻页pageNo或者搜索框searchInfo
    this.loading = true
    var obj: ProductQuery = {
      pageSize: this.selectProducts.pageSize,
      pageNo: this.selectProducts.pageNo,
      searchInfo: this.selectProducts.searchText
    }
    // 新增活动查找商品需要传时间(已废弃)
    if (this.pageType === 0) {
      Object.assign(obj, {
        beginDateTime: this.form.activityTime
          ? moment(this.form.activityTime[0]).format('YYYY-MM-DDTHH:mm:ss')
          : '',
        endDateTime: this.form.activityTime
          ? moment(this.form.activityTime[1]).format('YYYY-MM-DDTHH:mm:ss')
          : ''
      })
      // if (params) { Object.assign(obj, params) }
    }
    // 编辑活动查找商品需要planid
    if (this.pageType === 1) {
      obj.planId = this.form.id
      // if (params) { Object.assign(obj, params) }
    }
    //   console.log(obj)
    var { data } =
      this.pageType === 1 ? await getPlanProduct(obj) : await getProducts(obj)

    this.selectProducts.list = data.results
    this.selectProducts.total = data.totalRecord
    // console.log(list)
    this.loading = false
  }

  private addProducts() {
    this.addProductsHandle()
  }
}
</script>
