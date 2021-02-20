<template>
  <div class="finance-card">
    <div v-for="(item, i) in cardlist" :key="i" class="list-item">
      <div class="name">
        <span class="border" />
        {{ item.name }}
        <el-tooltip effect="light" placement="right-start">
          <div slot="content">
            <div class="tip" style="width:150px;line-height:1.5;">
              <span style="color:#333">{{ item.tip }}</span>
            </div>
          </div>
          <i class="icon-quest" />
        </el-tooltip>
      </div>
      <div class="sum">
        <span style="font-size:26px;">￥</span
        ><span style="margin-left:-3px">{{ item.sum }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'cards'
})
export default class extends Vue {
  @Prop({ default: () => [] }) private cardlist!: [];
}
</script>

<style lang="scss" scoped>
.finance-card {
  display: flex;
  flex-wrap: wrap;
  min-width: 1260px;
  .list-item {
    width: 300px;
    height: 108px;
    background-color: #fff;
    // text-align: center;
    padding-top: 8px;
    margin: 0 15px 15px 0;
    border-radius: 4px;
    .name {
      margin-bottom: 10px;
      font-size: 14px;
      // font-weight: 700;
      color: #777;
      .border {
        display: inline-block;
        width: 4px;
        height: 9px;
        margin-right: 7px;
        background-color: #f85340;
      }
      // .icon-quest {
      //   display: inline-block;
      //   width: 16px;
      //   height: 16px;
      //   background: url("~@/assets/common/icon-question.png") no-repeat;
      //   background-size: 100% 100%;
      //   margin-bottom: -2px;
      // }
    }
    .sum {
      padding-left: 12px;
      font-size: 32px;
      font-weight: 500;
      color: #333;
    }
  }
}
</style>
