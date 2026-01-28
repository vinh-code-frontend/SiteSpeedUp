import { defineStore } from 'pinia';
import type { IState } from './types';
import { get } from '@/firebase/services/firestore.service';

export const useStore = defineStore('global', {
  state: (): IState => ({
    loginUser: null,
    tenants: []
  }),
  actions: {
    setLoginUser(loginUser: IState['loginUser']) {
      if (!this.loginUser && !loginUser) {
        return;
      }
      this.loginUser = loginUser;
    },
    async getTenants() {
      const result = await get<Record<string, any>[]>('tenant', {
        orderBy: { field: 'createdAt', direction: 'desc' }
      });
      console.log(result);
    }
  }
});
