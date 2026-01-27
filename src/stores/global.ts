import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'

type IState = {
  loginUser: User | null
}

export const useGlobalStore = defineStore('global', {
  state: (): IState => ({
    loginUser: null,
  }),
  actions: {
    setLoginUser(loginUser: IState['loginUser']) {
      this.loginUser = loginUser
      console.log(this.loginUser)
    },
  },
})
