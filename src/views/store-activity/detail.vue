<template>
  <div class="storeact-details">
    <div v-loading="formLoading" class="storeact-details-content">
      <!-- form1 -->
      <el-form
        ref="form"
        :model="form"
        inline
        label-width="80px"
        label-position="left"
        size="medium"
        class="form"
      >
        <el-row>
          <el-form-item label="活动名称" class="item-name">
            <el-input
              ref="name"
              v-model="form.title"
              :disabled="status === 2"
              placeholder="活动名称"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item label="活动时间" class="item-time">
            <el-date-picker
              ref="time"
              v-model="form.activityTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              :disabled="pageType === 1 || pageType === 2"
            />
          </el-form-item>
          <el-form-item label="活动限购" class="item-buylimit">
            <el-input
              ref="buylimit"
              v-model="form.maxAmountPerTime"
              width="100"
              :disabled="status === 2"
              placeholder="默认0不限购"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item label="排序" class="item-order">
            <el-input
              ref="order"
              v-model="form.order"
              :disabled="status === 2"
              placeholder="默认1最前"
            />
          </el-form-item>
        </el-row>
        <el-row class="img-row">
          <el-form-item label="标题图片" class="item-img">
            <div :class="{noactive: status === 2}" class="upload-btn">
              <el-image v-if="img.url" :src="img.url" />

              <span v-if="!img.url">上传图片</span>
              <input
                ref="inputImg"
                :disabled="status === 2"
                type="file"
                name=""
                accept="image/*"
                multiple="multiple"
                @change="inputChange($event)"
              />
            </div>
            <div class="tip">
              尺寸800*90,建议300k以内
            </div>
          </el-form-item>
          <el-form-item label="活动样式" class="item-display">
            <el-radio
              v-model="form.display"
              style="margin-right:12px"
              :disabled="status === 2"
              :label="0"
              >一列</el-radio
            >
            <el-radio
              v-model="form.display"
              style="margin-right:0px"
              :disabled="status === 2"
              :label="1"
              >两列</el-radio
            >
            <span style="color:#606266">（建议选择偶数个商品）</span>
          </el-form-item>
        </el-row>
      </el-form>
      <!-- form3 -->
      <div
        v-loading="storeLoading"
        class="form3"
        label-position="left"
        inline
        size="normal"
      >
        <div class="label">参与门店</div>
        <div class="content">
          <div class="store-btn">
            <div
              class="seletStore"
              :class="{disabled: status === 2}"
              :disabled="status === 2"
              @click="showSelectModal = true"
            >
              <span
                v-if="form.storeIds.length < 1"
                class="select-tip"
                style="color:#909399"
                >请选择参与门店</span
              >
              <span v-else class="select-tip" style="color:#666"
                >已选<span style="color:#f85340">{{
                  form.storeIds.length
                }}</span
                >个店铺</span
              >
            </div>
            <div class="tip">
              注：每个门店的活动独立生成，可以批量修改
            </div>
          </div>
          <div class="store-area">
            <div v-for="(item, i) of shops" :key="i" class="store-label">
              <span>{{ item.storeName }}</span
              ><span
                v-if="status !== 2"
                class="iclose el-icon-circle-close"
                @click="deleteStoreMsg(item.yxStoreId)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- form2 -->
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :inline="false"
        size="normal"
        class="form2"
      >
        <el-row>
          <span
            style="font-size:14px;color:#606266;font-weight:700;margin-left:10px"
            >设置活动商品</span
          >
          <div class="select">
            <el-button
              style="color:#fff"
              type="primary"
              :disabled="status === 2"
              size="small"
              @click="dialogVisible = true"
              >选择商品</el-button
            >
            <span class="tip"
              >已选<span>{{ form.products.length }}</span
              >个</span
            >
          </div>
          <product-list
            :data="form.products"
            :page-type="pageType"
            :status="status"
            @deletproducts="deleteProduct"
            @inputerror="inputError"
          />
        </el-row>
      </el-form>
    </div>
    <div class="submit-btn">
      <!-- <el-button v-if="form.status!==2" :loading="subloading" @click="$router.push({ name: 'ActivityLists'})">取消</el-button> -->
      <el-button
        v-if="status !== 2"
        :loading="subloading"
        type="primary"
        @click="submitActivity()"
        >提交</el-button
      >
    </div>
    <el-dialog
      :visible="showSelectModal"
      width="400px"
      :append-to-body="true"
      class="select-store-modal"
      :show-close="true"
      title="选择店铺"
      @open="getStore"
      @close="showSelectModal = false"
    >
      <div class="total" style="margin-bottom:15px">
        <el-checkbox v-model="allCheck" @change="selectAll">全选</el-checkbox>
        <span class="select-notice" style="margin-left:10px;color:#999"
          >已选{{ shopId.length }}个店铺</span
        >
      </div>
      <div class="checkGroup">
        <el-checkbox-group v-model="shopId">
          <div
            v-for="(item, i) in options"
            :key="i"
            class="select-box"
            style="margin-bottom:5px"
          >
            <el-checkbox :label="item.yxStoreId">{{
              item.storeName
            }}</el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
      <div class="handle-box" style="margin-top:10px;text-align:center">
        <el-button type="primary" size="small" @click="addStore"
          >确认</el-button
        >
        <el-button type="cancel" size="small" @click="showSelectModal = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
    <my-dialog
      @addproducts="addProducts"
      @selectchange="selectChange"
      :page-type="pageType"
      :visiable.sync="dialogVisible"
      :form="form"
      :checkproducts="form.products"
    />
    <!-- <el-dialog
      class="dialog"
      title="选择商品"
      :visible.sync="dialogVisible"
      width="60%"
      @open="openDialog"
      @close="dialogVisible = false"
    >
      <div class="dialog-select">
        <el-form class="filter" inline size="medium">
          <el-form-item label="商品信息">
            <el-input
              v-model="searchText"
              class="search-input"
              width="200px"
              placeholder="编码/名称/厂家/批准文号"
              clearable
              @keyup.enter.native="searchProducts()"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @keyup.enter.native="getProducts"
              @click="searchProducts()"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
        <div style="margin: 15px 0;" />
        <div class="select-list">
          <select-list
            v-loading="loading"
            :check="checkProducts"
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
    </el-dialog> -->
  </div>
</template>
<script lang="ts">
import moment from 'moment'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import productList from './components/ProductList.vue'
import MyDialog from './components/Dialog.vue'

import { Component, Watch, Vue, Ref } from 'vue-property-decorator'
import {
  activityDetail,
  getProducts,
  getPlanProduct,
  deletProduct,
  getStores,
  addStores,
  deletStore,
  saveStoreAct,
  addStoreAct,
  getQiNiuPicToken
} from '@/api/activity'

export interface TableProps {
  list: any[]
  total: number
  pageNo: number
  pageSize: number
}
interface Img {
  file: any
  url: string
}
export interface FormData {
  id: number
  status: number
  title: string
  activityTime: any[]
  img: string
  order: string
  maxAmountPerTime: string
  products: any[]
  storeIds: any[]
  display: number
}

interface UploadInfo {
  path: string
  bucketToken: string
  uploadServerUrl: string
  domain: string
}

@Component({
  name: 'Activity',
  components: { productList, MyDialog }
})
export default class extends Vue {
  private shops: number[] = [];
  private shopId: any[] = [];
  private oldShopId: [] = [];
  private allCheck = false;
  private options: [] = []; // 可选店铺
  private storeLoading = false;
  private showSelectModal = false; // 选择店铺dialog
  private show = true;
  private time = null;
  private searchText = '';
  private checkAll = false;
  private checkProducts: any[] = [];
  private isIndeterminate = false;
  private selectProducts: TableProps = {
    list: [],
    pageNo: 1,
    pageSize: 5,
    total: 0
  };

  private dialogVisible = false;
  private img: Img = {
    url: '',
    file: ''
  };

  private form: FormData = {
    id: -1,
    status: 0,
    title: '',
    activityTime: [],
    img: '',
    order: '',
    maxAmountPerTime: '',
    products: [],
    storeIds: [],
    display: 0
  };

  private formLoading = false;
  private status = 0;
  private backendProducts: [] = [];
  // private uploadInfo: object = {};
  private pageType = 0;
  private subloading = false;
  private productError = false;
  private uploadInfo: UploadInfo = {
    path: '',
    bucketToken: '',
    uploadServerUrl: '',
    domain: ''
  }; // 七牛图片上传信息

  created() {
    this.initData()
  }

  private initData() {
    if (this.$route.name === 'AddActivity') {
      this.pageType = 0
    } // 暂时店铺活动只有新增活动界面，编辑和查看都是用原来的团购活动页面
    if (this.$route.name === 'EditActivity') {
      this.pageType = 1
    } // 编辑
    if (this.$route.name === 'ActivityDetail') {
      this.pageType = 2
    } // 查看
    if (this.pageType) {
      this.form.id = Number(this.$route.query.id)
      this.status = Number(this.$route.query.status)
      this.getDetail()
    }
  }

  private async getDetail() {
    // 获取活动信息
    this.formLoading = true
    try {
      var { data } = await activityDetail({ planId: this.form.id })
      this.form.title = data.title
      this.form.order = data.listOrder
      this.form.maxAmountPerTime = data.maxAmountPerTime
        ? data.maxAmountPerTime
        : 0
      const time = [
        data.beginTime ? new Date(data.beginTime) : '',
        data.endTime ? new Date(data.endTime) : ''
      ]
      this.form.activityTime = time
      this.form.img = data.img // 设置表单图片地址
      this.img.url = data.img // 设置图片显示
      this.form.display = data.display ? data.display : 0

      if (data.yxStoreIds) {
        this.shops = data.yxStoreIds.map((item: any) => {
          return {
            yxStoreId: item.yxStoreId,
            storeName: item.yxStoreName
          }
        })
        this.shopId = data.yxStoreIds.map((item: any) => {
          return item.yxStoreId
        })
        this.oldShopId = data.yxStoreIds.map((item: any) => {
          return item.yxStoreId
        })
        this.form.storeIds = this.shopId
      }

      for (const i of data.productInfo.results) {
        // 对products数据处理以便绑定到input框
        i.price = i.unitPrice // 这里后端返回零售价price字段为unitprice
        i.buyLimit = i.maxAmountPerTime // 这里后端返回每人限购字段为maxAmountPerTime;
      }
      this.form.products = data.productInfo.results
      this.backendProducts = data.productInfo.results.map((item: any) => {
        return item.productId
      }) // 另外储存一份productId，以便在删除商品时判断是本地添加的，还是后端已经存在的
      // this.checkProducts = JSON.parse(JSON.stringify(data.productInfo.results));
      // console.log(this.checkProducts);

      this.formLoading = false
      // console.log(this.form.products)
    } catch (e) {
      console.error(e)
      this.formLoading = false
    }
  }

  private async submitActivity() {
    if (!this.validate()) return
    if (this.productError) return
    if (!this.validateProducts()) return
    this.submit()
  }

  private async submit() {
    // 请求提交接口
    this.formLoading = true
    this.subloading = true
    try {
      var imgurl = ''
      if (this.img.file) {
        // 创建活动时必须选择图片才能上传图片
        const { data } = await getQiNiuPicToken()
        this.uploadInfo = data
        imgurl = await new Promise((resolve, reject) => {
          this.uploadFileToQiNiu(this.img.file).then((res: any) => {
            this.img.url = this.uploadInfo.domain + res.key
            resolve(this.img.url)
          })
        })
      } else {
        // 修改活动时可以直接拿原来的图片地址，（当然也可以通过inputchange事件，img.file里也会装入新的图片）
        imgurl = this.img.url
      }
      // 对products进行装载（因为后端给的字段不统一）
      var params = {}
      var products: any[] = []
      var formProducts = this.form.products
      for (let i = 0; i < formProducts.length; i++) {
        products[i] = {}
        products[i].buyLimit = formProducts[i].buyLimit
        products[i].linePrice = formProducts[i].linePrice
        products[i].order = formProducts[i].listOrder
        products[i].price = formProducts[i].price
        products[i].productId = formProducts[i].productId
        products[i].stock = formProducts[i].stock
        if (this.pageType === 0) {
          products[i].stock = formProducts[i].maxAmount
        } // 新增活动的时候，活动库存不可设置，默认等于活动总数
        products[i].maxAmount = formProducts[i].maxAmount // 新增一个活动总数的字段，新建活动的时候其实就是原来那个库存字段，编辑的时候两个会分开
        products[i].productName = formProducts[i].drugName
      }
      // form表单数据装载
      // let time;
      // if (
      //   this.form.activityTime === null ||
      //   this.form.activityTime.length < 2
      // ) {
      //   time = [];
      // } else {
      //   time = this.form.activityTime;
      // }
      // if (this.form.maxAmountPerTime === "") {
      //   // 不输入活动限购时，默认0不限购
      //   this.form.maxAmountPerTime = "";
      // }
      // if (this.form.order === "") {
      //   this.form.order = ""; // 不填默认值1
      // }
      params = this.pageType
        ? {
          img: imgurl,
          listOrder: this.form.order === '' ? 1 : this.form.order, // 这里后端编辑活动的排序是listOrder,不填默认1
          maxAmountPerTime:
              this.form.maxAmountPerTime === ''
                ? 0
                : this.form.maxAmountPerTime, // 不填默认0
          title: this.form.title,
          products,
          planId: this.form.id,
          display: Number(this.form.display)
        }
        : {
          beginDateTime: moment(this.form.activityTime[0]).format(
            'YYYY-MM-DDTHH:mm:ss'
          ),
          endDateTime: moment(this.form.activityTime[1]).format(
            'YYYY-MM-DDTHH:mm:ss'
          ),
          img: imgurl,
          order: this.form.order === '' ? 1 : this.form.order, // 这里后端新增活动的排序是order
          maxAmountPerTime:
              this.form.maxAmountPerTime === ''
                ? 0
                : this.form.maxAmountPerTime,
          title: this.form.title,
          products,
          storeIds: this.form.storeIds,
          // isAll: 1,
          display: Number(this.form.display)
        }
      const res:any = this.pageType
        ? await saveStoreAct(params)
        : await addStoreAct(params)
      if (res.code === '40001') {
        this.pageType === 0
          ? this.$message.success('新增活动成功')
          : this.$message.success('保存活动信息成功')
        this.form = {
          // 清空活动信息防止下次再进来这个页面路由状态保存
          id: -1,
          status: 0,
          title: '',
          activityTime: [],
          img: '',
          order: '',
          products: [],
          storeIds: [],
          maxAmountPerTime: '',
          display: 0
        }
        this.shopId = []
        this.shops = []
        this.allCheck = false
        this.img = {
          file: '',
          url: ''
        };
        (this.$refs.inputImg as Vue & { value: string }).value = ''
        // this.$refs['inputImg'].value = ''
        this.formLoading = false
        this.subloading = false
        this.$router.push({ name: 'StoreActivity' })
      } else {
        this.$message.error('发生未知错误')
        this.formLoading = false
        this.subloading = false
      }
    } catch (e) {
      console.error(e)
      this.formLoading = false
      this.subloading = false
    }
  }

  private uploadFileToQiNiu(file: any) {
    const arr = file.name.match(/^([\S\s]+)\.(\S+)$/)
    const suffix = arr[2] // 文件后缀
    const key =
      this.uploadInfo.path +
      this.form.id +
      '_' +
      moment().format('HHmmss') +
      '_' +
      uuidv4() +
      '.' +
      suffix
    const formData = new FormData()
    formData.append('token', this.uploadInfo.bucketToken)
    formData.append('key', key)
    formData.append('file', file)
    return new Promise((resolve, reject) => {
      axios
        .post(this.uploadInfo.uploadServerUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          resolve({
            key: key
          })
        })
        .catch(err => {
          if (err) {
            // 这里会有问题，请求成功会同时进入then和catch，不知道什么原因
            reject(err)
            this.$message.error('图片上传七牛出错请重试')
          }
        })
    })
  }

  private validate() {
    // 验证form表单
    if (!this.form.title) {
      this.$message.error('请输入活动名称');
      (this.$refs.name as Vue & { focus: Function }).focus()
      return false
    }
    // console.log(this.form.activityTime)

    if (!this.form.activityTime || this.form.activityTime.length < 2) {
      this.$message.error('请输入活动时间');
      (this.$refs.time as HTMLDivElement).focus()
      return false
    }
    if (!this.form.img) {
      this.$message.error('请选择活动图片')
      return false
    }
    var reg = /^\d+$/
    if (
      (!reg.test(this.form.maxAmountPerTime) ||
        Number(this.form.maxAmountPerTime) > 99999) &&
      this.form.maxAmountPerTime !== ''
    ) {
      (this.$refs.buylimit as HTMLDivElement).focus()
      this.form.maxAmountPerTime = ''
      this.$message.error('请输入0-99999的整数')
      return false
    }
    if (
      (!reg.test(this.form.order) ||
        Number(this.form.order) < 1 ||
        Number(this.form.order) > 99999) &&
      this.form.order !== ''
    ) {
      (this.$refs.order as HTMLDivElement).focus()
      this.form.order = ''
      this.$message.error('请输入1-99999的整数')
      return false
    }
    if (this.form.storeIds.length < 1) {
      this.$message.error('请至少选择一个门店')
      return false
    }
    if (this.form.products.length < 1) {
      this.$message.error('请至少选择一个商品')
      return false
    }
    return true
  }

  private inputError(val: boolean) {
    this.productError = val
  }

  private validateProducts() {
    // 点击提交按钮还需要统一验证
    // 验证商品信息
    const products = this.form.products
    const reg = {
      listOrder: /^\d+$/,
      price: /^(([0-9]+)|([0-9]+\.[0-9]{1,2}))$/,
      linePrice: /^(([0-9]+)|([0-9]+\.[0-9]{1,2}))$/,
      maxAmount: /^\d+$/,
      buyLimit: /^\d+$/
    }
    for (const i of products) {
      if (
        !reg.listOrder.test(i.listOrder) ||
        Number(i.listOrder) < 1 ||
        Number(i.listOrder) > 99999
      ) {
        this.$message.error('请输入1-99999的整数')
        i.edit = true
        this.$nextTick(() => {
          (document.getElementsByClassName('inp' + i.productId)[0]
            .childNodes[1] as HTMLDivElement).focus()
        })
        return false
      }
      if (!reg.price.test(i.price)) {
        this.$message.error('请输入小数点不多于两位的正数')
        // i.edit = true;
        this.$nextTick(() => {
          (document.getElementsByClassName('price' + i.productId)[0]
            .childNodes[1] as HTMLDivElement).focus()
        })
        return false
      }
      if (!reg.linePrice.test(i.linePrice)) {
        this.$message.error('请输入小数点不多于两位的正数')
        // i.edit = true;
        this.$nextTick(() => {
          (document.getElementsByClassName('linePrice' + i.productId)[0]
            .childNodes[1] as HTMLDivElement).focus()
        })
        return false
      }
      if (!reg.maxAmount.test(i.maxAmount) || Number(i.maxAmount) < 1) {
        this.$message.error('请输入大于0的整数')
        // i.edit = true;
        this.$nextTick(() => {
          (document.getElementsByClassName('maxAmount' + i.productId)[0]
            .childNodes[1] as HTMLDivElement).focus()
        })
        return false
      }
      if (!reg.buyLimit.test(i.buyLimit) || Number(i.buyLimit) < 1) {
        this.$message.error('请输入大于0的整数')
        // i.edit = true;
        this.$nextTick(() => {
          (document.getElementsByClassName('buyLimit' + i.productId)[0]
            .childNodes[1] as HTMLDivElement).focus()
        })
        return false
      }
      return true
    }
  }

  private async inputChange(e: any) {
    // 选择活动图片
    const file = e.target.files[0]
    if (file.size > 300000) {
      this.$message.error('图片大小不能大于300k');
      (this.$refs.inputImg as Vue & { value: string }).value = ''
      return
    }
    const url = await window.URL.createObjectURL(file)

    this.img = { file: file, url: url }

    this.form.img = url
  }

  private async getStore() {
    // 获取店铺列表
    if (this.pageType === 2) {
      return
    }
    // this.showSelectModal = true;
    const { data } = await getStores()
    this.options = data.filter((item: any) => item.yxStoreId !== -1)
    // console.log(this.options)
  }

  private selectAll() {
    if (this.allCheck) {
      // 选择店铺
      this.shopId = this.options.map((item: any) => {
        return item.yxStoreId
      })
    } else {
      this.shopId = []
    }
    // console.log(this.shopId)
  }

  private async addStore() {
    // 确定选择店铺
    if (this.pageType) {
      // 编辑活动时，需要去后端添加店铺（后端为了性能考虑）
      var storeIds: any[] = []
      var deleteIds: any[] = []
      var exit = false
      var deExit = false
      for (const i of this.shopId) {
        for (const j of this.oldShopId) {
          if (i === j) {
            exit = true
            break
          }
        }
        if (!exit) {
          // 不存在原来返回的店铺数组中
          storeIds.push(i)
        }
        exit = false
      }
      for (const i of this.oldShopId) {
        for (const j of this.shopId) {
          if (i === j) {
            deExit = true
            break
          }
        }
        if (!deExit) {
          // 原来返回的店铺数组中的店铺，不存在新添加的shopid里。说明用户取消选择了。
          deleteIds.push(i)
        }
        deExit = false
      }
      if (storeIds.length > 0) {
        // 去后端添加店铺
        try {
          this.storeLoading = true
          const res:any = await addStores({
            templateComboId: this.form.id,
            stores: storeIds
          })
          if (res.code === '40001') {
            this.addLocalStores() // 本地添加店铺
            this.storeLoading = false
          } else {
            this.$message.error('添加店铺失败')
            this.storeLoading = false
          }
        } catch (e) {
          this.storeLoading = false
          console.log(e)
        }
      }
      if (deleteIds.length > 0) {
        // 去后端删除店铺
        try {
          this.storeLoading = true
          const res:any = await deletStore({
            comboId: this.form.id,
            selectYxStoreId: deleteIds
          })

          if (res.code === '40001') {
            for (const k of deleteIds) {
              this.deleteLocalStore(k) // 本地删除
            }
            this.storeLoading = false
          } else {
            this.$message.error('删除店铺失败')
            this.storeLoading = false
          }
        } catch (e) {
          this.storeLoading = false
          console.log(e)
        }
      }
      // this.storeIds = []
      // this.deleteIds = []
    } else {
      // 新建活动的时候只需要本地临时添加
      this.addLocalStores()
    }
    this.showSelectModal = false
  }

  private addLocalStores() {
    // 本地添加店铺
    this.form.storeIds = this.shopId
    this.shops = this.shopId.map(item => {
      // 根据已选店铺id返回已选店铺信息列表作显示用
      let value!: number
      for (const i of this.options) {
        if ((i as any).yxStoreId === item) {
          value = i
        }
      }
      return value
    })
  }

  private async deleteStoreMsg(id: number) {
    // 删除店铺（新增弹窗需求）
    if (this.pageType) {
      // 编辑活动时，需要去后端删除店铺（后端为了性能考虑）
      this.$confirm('确定删除店铺？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.storeLoading = true
        const res:any = await deletStore({
          comboId: this.form.id,
          selectYxStoreId: [id]
        })
        console.log(res)

        if (res.code === '40001') {
          this.deleteLocalStore(id) // 本地也要对应删除
          this.$message.success('删除成功')
          this.storeLoading = false
        } else {
          this.$message.error('删除失败')
          this.storeLoading = false
        }
      })
    } else {
      // 新建活动时，只需要本地删除
      this.deleteLocalStore(id)
    }
  }

  private deleteLocalStore(id: number) {
    // 删除本地已选店铺
    this.form.storeIds.forEach((item: number, index: number, arr: any[]) => {
      // 从form中删除（作已废弃）
      if (item === id) {
        arr.splice(index, 1)
      }
    })
    this.shopId.forEach((item: number, index: number, arr: any[]) => {
      // 从多选按钮已选中删除
      if (item === id) {
        arr.splice(index, 1)
      }
    })
    this.oldShopId.forEach((item: number, index: number, arr: any[]) => {
      // 从原来后端返回的店铺数组中删除（删除时是没有刷新返回数据的）
      if (item === id) {
        arr.splice(index, 1)
      }
    })
    this.shops.forEach((item: any, index: number, arr: any[]) => {
      // 从显示列表中删除
      if (item.yxStoreId === id) {
        arr.splice(index, 1)
      }
    })
  }

  private async addProducts() {
    // for (var i of this.form.products) {
    //   for (let j = 0; j < this.checkProducts.length; j++) {
    //     if (i.productId === this.checkProducts[j].productId) {
    //       this.checkProducts.splice(j, 1);
    //     }
    //   }
    // }
    let ifexist = false
    for (let i = 0; i < this.backendProducts.length; i++) {
      // 添加时对后端已存在的商品进行filter
      // console.log(11);
      for (let j = 0; j < this.checkProducts.length; j++) {
        // console.log(
        //   this.backendProducts[i] === this.checkProducts[j].productId
        // );

        if (this.backendProducts[i] === this.checkProducts[j].productId) {
          // 删除重复添加（后端有的，用户不需要操作也在checkproducts里。这时候要删除掉，因为后面要用concat）,如果不使用concat，用户添加了几个商品，然后修改零售价这些字段以后再去添加checkproducts，直接对formproducts赋值checkproducts会重新覆盖掉这些用户设定值
          // this.checkProducts.splice(j, 1);
          // console.log(11);
          ifexist = true
          break
        }
      }
      if (!ifexist) {
        // 后端存在的商品，这次点添加商品的时候没有了（用户取消选择这个商品的checkbook），需要去后端删除
        try {
          const res:any = await deletProduct({
            planId: this.form.id,
            productId: this.backendProducts[i]
          })
          if (res.code === '40001') {
            // this.$message.success("删除成功");
            // 还要从form表单删除
            // for (let k = 0; k < this.form.products.length; k++) {
            //   if (this.form.products[k].productId === this.backendProducts[i]) {
            //     this.form.products.splice(k, 1);
            //   }
            // }
            // 从临时products删除
            this.backendProducts.splice(i, 1)
            // for (let i = 0; i < this.backendProducts.length; i++) {
            //   if (this.backendProducts[i] === this.backendProducts[i]) {
            //     this.backendProducts.splice(i, 1);
            //   }
            // }
          }
        } catch (e) {
          console.log(e)
        }
      } else {
        ifexist = false // 重置状态以便下次循环
      }
    }

    let tempAdd = false // 本地查找重复或者取消选择
    for (let i = 0; i < this.form.products.length; i++) {
      for (let j = 0; j < this.checkProducts.length; j++) {
        if (
          this.form.products[i].productId === this.checkProducts[j].productId
        ) {
          // 对formproducts里存在的商品进行去重
          this.checkProducts.splice(j, 1)
          tempAdd = true
          break
        }
      }
      if (!tempAdd) {
        // 全部循环完checkproducts后没有找到form里的这个商品，说明用户取消选择了这个添加的商品。
        // console.log(11);
        this.form.products.splice(i, 1)
      }
      tempAdd = false
    }
    // 全部处理完checkproducts对其字段进行初始化赋值
    var list = this.checkProducts
    for (let i = 0; i < list.length; i++) {
      // 设置默认值
      this.$set(list[i], 'listOrder', this.form.products.length + i + 1)
      this.$set(list[i], 'linePrice', (list[i].price * 1.2).toFixed(2))
      this.$set(list[i], 'price', Number(list[i].price).toFixed(2))
      this.$set(list[i], 'income', list[i].price) // 新增商品默认的收入等于零售价
      this.$set(list[i], 'stock', 100)
      this.$set(list[i], 'maxAmount', 100)
      this.$set(list[i], 'buyLimit', 1)
    }
    // 使用concat添加checkproducts到formproducts（前面已经进行清洗去重了，这里concat的保证没有重复的数据，如果用户取消checkbox的，对应的formproducts也已经删除）
    this.form.products = this.form.products.concat(this.checkProducts)
    // console.log(this.form.products);
    // this.checkProducts = this.form.products; //赋值完formproducts后，让checkproducts指向新formproducts，方便checkbox记录选中状态.
    this.dialogVisible = false
  }

  private selectChange(val: any[]) {
    console.log(val)

    let ifexist = false // selection去重
    for (let i = 0; i < val.length; i++) {
      for (let j = 0; j < this.checkProducts.length; j++) {
        if (this.checkProducts[j].productId === val[i].productId) {
          ifexist = true
          break
        }
      }
      if (!ifexist) {
        this.checkProducts.push(val[i])
      }
      ifexist = false
    }
    this.checkProducts = val
    // console.log(this.checkProducts);
  }

  private deleteProduct(val: number) {
    // 查找该商品是否已经存在于后端，（新建商品是temproducts是空的）
    var ifexsit = false
    for (var i of this.backendProducts) {
      if (i === val) {
        ifexsit = true
        break
      }
    }
    if (ifexsit) {
      // 该商品是存在后端的，不是临时添加的
      this.$confirm('确定删除商品？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          const res:any = await deletProduct({
            planId: this.form.id,
            productId: val
          })
          if (res.code === '40001') {
            this.$message.success('删除成功')
            // 还要从form表单删除
            for (let i = 0; i < this.form.products.length; i++) {
              if (this.form.products[i].productId === val) {
                this.form.products.splice(i, 1)
              }
            }
            // 还要从临时products删除(我真的是....后端给的这个接口)
            for (let i = 0; i < this.backendProducts.length; i++) {
              if (this.backendProducts[i] === val) {
                this.backendProducts.splice(i, 1)
              }
            }
          }
        } catch (e) {
          console.log(e)
        }
      })
    } else {
      // 本地临时添加的的商品。只需从formproducts和checkproducts删除
      for (let i = 0; i < this.form.products.length; i++) {
        if (this.form.products[i].productId === val) {
          this.form.products.splice(i, 1)
        }
      }

      for (let i = 0; i < this.checkProducts.length; i++) {
        if (val === this.checkProducts[i].productId) {
          // this.deleteproduct = this.checkProducts.slice(i, 1);
          this.checkProducts.splice(i, 1)
        }
      }
    }
  }
}
</script>
<style lang="scss">
.storeact-details {
  .item-store,
  .item-name,
  .item-img,
  .item-time {
    label::before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .item-buylimit,
  .item-display {
    label::before {
      content: "*";
      color: #fff;
      margin-right: 4px;
    }
    // input{
    //   width: 170px;
    // }
  }
  .item-order {
    label {
      width: 53px !important;
    }
    label::before {
      content: "*";
      color: #fff;
      margin-right: 4px;
    }
    // input{
    //   width: 170px;
    // }
  }
  .seletStore {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 185px;
    height: 36px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    cursor: pointer;
  }
  .select-store-modal {
    .total {
      margin-bottom: 15px;
      .select-notice {
        color: #999999;
        margin-left: 10px;
      }
    }
    .checkGroup {
      max-height: 300px;
      overflow-y: auto;
    }
    .select-box {
      margin-bottom: 5px;
    }
    .handle-box {
      margin-top: 10px;
      text-align: center;
    }
    ::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 15px;
    }
    ::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(239, 243, 245, 0.2);
      background: #c1c1c1;
    }
    ::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, 0);
      border-radius: 10px;
      background: #ffffff;
    }
  }
  .el-dialog-div {
    height: 60vh;
  }

  .upload-btn {
    position: relative;
    width: 158px;
    height: 88px;
    background-color: #ededed;
    margin-top: 8px;
    margin-right: 26px;
    cursor: pointer;
    .el-image {
      width: 100%;
      height: 100%;
    }
    span {
      position: absolute;
      display: inline-block;
      top: 25px;
      left: 50px;
      color: #909399;
      cursor: pointer;
    }
    input {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
  .noactive.upload-btn {
    cursor: not-allowed;
    .el-image {
      cursor: not-allowed;
    }
    span {
      cursor: not-allowed;
    }
    input {
      cursor: not-allowed;
    }
  }
  .uploadtext {
    position: absolute;
    display: block;
    color: #909399;
    top: 25px;
    left: 50px;
  }
  .tip {
    color: #909399;
    font-size: 12px;
    margin-top: -5px;
    // margin-left: 80px;
  }
  .select {
    margin: 15px 10px 10px 10px;
    .el-button {
      font-size: 14px;
      color: #333333;
    }
    .el-button.is-disabled {
      color: #909399 !important;
      background-color: #ededed;
      border-color: #ededed;
    }
    .tip {
      font-size: 14px;
      color: #333333;
      margin-left: 10px;
      span {
        color: #f85340;
      }
    }
  }
  .dialog-select {
    position: relative;
    padding-bottom: 15px;
    .search-input {
      width: 208px;
    }
    .allproduct {
      position: absolute;
      top: 87px;
      left: 9px;
      z-index: 100;
    }
    .comfirm-btn {
      position: absolute;
      bottom: -10px;
      width: 100%;
      display: flex;
      align-content: center;
      justify-content: center;
    }
  }

  //dddddd

  &-content {
    background-color: transparent;
    border-radius: 4px;
    margin-bottom: 15px;
    .noactive {
      cursor: default;
    }
    .title {
      height: 56px;
      line-height: 56px;
      border-bottom: 1px solid #efefef;
      padding-left: 20px;
    }
    .form2 {
      background-color: #fff;
      border-radius: 4px;
      padding: 15px 0 0 18px;
    }
    .form {
      padding: 20px;
      margin-bottom: 8px;
      background-color: #fff;
      border-radius: 4px;
    }
    .form3 {
      padding: 20px 20px 12px 20px;
      margin-bottom: 8px;
      background-color: #fff;
      border-radius: 4px;
      display: flex;
      .label {
        display: inline-block;
        flex: 0 0 80px;
        font-size: 14px;
        color: #606266;
        font-weight: 700;
        padding-top: 9px;
      }
      .label::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
      }
      .content {
        flex: 1;
        overflow: hidden;
      }
      .store-btn {
        display: flex;
        // flex-wrap: wrap;
        align-items: center;
        .seletStore {
          flex: 0 0 185px;
          margin-right: 10px;
          font-size: 14px;
        }
        .seletStore.disabled {
          cursor: not-allowed;
          background-color: #ededed;
          border: 1px solid #ededed;
        }
        .tip {
          font-size: 12px;
          color: #333;
          flex: 0 0 300px;
          padding-top: 5px;
        }
      }
      .store-area {
        display: flex;
        flex-wrap: wrap;
        max-height: 137px;
        overflow-y: auto;
        padding: 5px 0 0 0;
        // border: 1px solid #e0e0e0;
        border-radius: 4px;
        margin-top: 3px;
        .store-label {
          display: inline-block;
          background-color: #f3f3f3;
          color: #333;
          height: 36px;
          line-height: 21px;
          font-size: 14px;
          border-radius: 4px;
          padding: 8px 15px;
          margin: 0 10px 8px 0;
          .iclose {
            margin-left: 10px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
