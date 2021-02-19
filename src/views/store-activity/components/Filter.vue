<template>
  <el-form class="filter" inline size="medium">
    <el-form-item label="活动名称">
      <el-input
        v-model="form.comboInfo"
        placeholder="活动ID/活动名称"
        clearable
        @keyup.enter.native="$emit('search')"
      />
    </el-form-item>
    <el-form-item label="参与门店">
      <el-select
        v-model="form.yxStoreName"
        class="store-select"
        filterable
        placeholder="请选择"
      >
        <el-option
          v-for="item in shops"
          :key="item.yxStoreId"
          :label="item.yxStoreName"
          :value="item.yxStoreName"
        >
          {{ item.yxStoreName }}</el-option
        >
      </el-select>
    </el-form-item>

    <!-- <el-form-item label="活动ID">
      <el-input v-model="form.searchID" placeholder="活动ID" clearable @keyup.enter.native="$emit('search')" />
    </el-form-item>
    <el-form-item label="活动名称">
      <el-input v-model="form.searchText" placeholder="活动名称" clearable @keyup.enter.native="$emit('search')" />
    </el-form-item> -->
    <el-form-item label="活动时间">
      <el-date-picker
        v-model="form.time"
        type="daterange"
        range-separator="-"
        unlink-panels
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @keyup.enter.native="$emit('search')"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="$emit('search')">搜索</el-button>
      <el-button @click="goto('AddActivity')">新建活动</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

export interface FormProps {
  comboInfo: string
  yxStoreName: string
  time: string
}

@Component({
  name: 'activityFilter'
})
export default class extends Vue {
  @Prop({ required: true })
  private form!: FormProps;

  @Prop({ default: () => [] }) private shops!: [];

  // private form: FormProps = {
  //   comboInfo: "",
  //   yxStoreName: "",
  //   time: ""
  // };
  create() {
    console.log(this.form)
  }

  private goto(name: string) {
    this.$router.push({ name: name })
  }
}
</script>

<style lang="scss" scoped>
.filter {
}
</style>
