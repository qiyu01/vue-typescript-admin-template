<template>
  <div class="home">
    <div class="home-title">{{ userName }}，欢迎回来邻药优选商家管理后台！</div>
    <img src="../../assets/home/home-bg.png" alt="">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Home'
})
export default class extends Vue {
  get userName() {
    return UserModule.name || 'Hello'
  }
}
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: calc(100vh - 80px);
  background: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
      align-items: center;
  justify-content: center;
  &-title{
    font-size: 16px;
    color: #333333;
  }
  img {
    width: 492px;
    height: 382px;
  }
}
</style>
