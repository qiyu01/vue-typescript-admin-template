<template>
  <div
    :class="classObj"
    class="app-wrapper"
  >
    <div class="app-header">
      <div class="app-header-left">
        <img src="@/assets/common/logo.png" class="logo">
        <div class="title">邻药优选</div>
      </div>
      <div class="app-header-right">
        <span>{{ userName }},欢迎你！</span>
        <span class="separator">|</span>
        <el-button type="text" style="color: #333" @click="logout">退出</el-button>
      </div>
    </div>
    <div
      v-if="classObj.mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div
      :class="{hasTagsView: showTagsView}"
      class="main-container"
    >
      <div :class="{'fixed-header': fixedHeader}">
        <!-- <navbar /> -->
        <tags-view v-if="showTagsView" />
      </div>
      <app-main />
      <!-- <right-panel v-if="showSettings">
        <settings />
      </right-panel> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { DeviceType, AppModule } from '@/store/modules/app'
import { SettingsModule } from '@/store/modules/settings'
import { UserModule } from '@/store/modules/user'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import RightPanel from '@/components/RightPanel/index.vue'
import ResizeMixin from './mixin/resize'

@Component({
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  }
})
export default class extends mixins(ResizeMixin) {
  get userName() {
    return UserModule.name || 'Hello'
  }

  get classObj() {
    return {
      hideSidebar: !this.sidebar.opened,
      openSidebar: this.sidebar.opened,
      withoutAnimation: this.sidebar.withoutAnimation,
      mobile: this.device === DeviceType.Mobile
    }
  }

  get showSettings() {
    return SettingsModule.showSettings
  }

  get showTagsView() {
    return SettingsModule.showTagsView
  }

  get fixedHeader() {
    return SettingsModule.fixedHeader
  }

  private handleClickOutside() {
    AppModule.CloseSideBar(false)
  }

  private logout() {
    this.$confirm('确定登出？', {
      closeOnClickModal: false
    }).then(async() => {
      await UserModule.LogOut()
      this.$router.push(`/login?redirect=${this.$route.fullPath}`).catch(err => {
        console.warn(err)
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.app-header{
    height: 50px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1002;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    box-shadow: 0px 3px 20px 0px
    rgba(0, 0, 0, 0.06);
    background-color:#fff;
    padding: 0 20px;
    &-left{
      display: flex;
      align-items: center;
      .logo{
        width: 26px;
        height: 26px;
        margin-right: 3px;
      }
      .title{
        font-size: 18px;
        color: #333333;
        font-weight: bold;
      }
    }
    &-right{
      font-size: 14px;
      color: #333333;
      .separator{
        margin: 0 10px;
        color: #909399;
        opacity: 0.5;
      }
    }
  }

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.main-container {
  min-height: 100%;
  transition: margin-left .28s;
  margin-left: $sideBarWidth;
  position: relative;
  top: 50px;
}

.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 50px;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.fixed-header {
  position: fixed;
  top: 50px;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar {
  .main-container {
    margin-left: 54px;
  }

  .sidebar-container {
    width: 54px !important;
  }

  .fixed-header {
    width: calc(100% - 54px)
  }
}

/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform .28s;
    width: $sideBarWidth !important;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }

  .fixed-header {
    width: 100%;
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
