import { defineStore } from 'pinia';
import type { IState } from './types';
import { formatFSTime, get } from '@/firebase/services/firestore.service';

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
      const result = await get<Record<string, any>>('tenant', {
        orderBy: { field: 'createdAt', direction: 'desc' }
      });
      this.tenants = result.map((item) => ({
        id: item.id,
        title: item.title,
        userId: item.userId,
        userDisplayName: item.userDisplayName,
        isPrivate: item.isPrivate,
        createdAt: formatFSTime(item.createdAt),
        updatedAt: formatFSTime(item.updatedAt)
      }));
    }
  }
});
