import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
  email: string
}
interface Idata{
  userName:string
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public email = ''

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  @Action
  public async Login(userInfo: { userAccount:string, password:string, identification:string, rememberMe:string}) {
    let { userAccount, password,identification,rememberMe } = userInfo
    userAccount = userAccount.trim()
    await login({ userAccount, password,identification,rememberMe })
    setToken("LOGIN")
    this.SET_TOKEN("LOGIN")
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    const {data}= await getUserInfo()
    console.log(data)
    
    if (!data) {
      throw Error('获取用户信息失败，请重新登录!')
    }else{
      this.SET_NAME(data.userName)
    this.SET_AVATAR("111")
    this.SET_INTRODUCTION("222")
    this.SET_EMAIL("333")
    this.SET_ROLES(["admin"]);
    }
    // if (this.token === '') {
    //   throw Error('GetUserInfo: token is undefined!')
    // }
    // const { data } = await getUserInfo()
    // if (!data) {
    //   throw Error('Verification failed, please Login again.')
    // }
    // const { roles, name, avatar, introduction, email } = data.user
    // // roles must be a non-empty array
    // if (!roles || roles.length <= 0) {
    //   throw Error('GetUserInfo: roles must be a non-null array!')
    // }
    // this.SET_ROLES(roles)
    this.SET_NAME("毛超")
    this.SET_AVATAR("111")
    this.SET_INTRODUCTION("222")
    this.SET_EMAIL("333")
    this.SET_ROLES(["admin"]);
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token'
    this.SET_TOKEN(token)
    setToken(token)
    await this.GetUserInfo()
    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles)
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes)
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    await logout()
    removeToken()
    resetRouter()

    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
