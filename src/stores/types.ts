import type { ITenant } from '@/features/Tenant/model';
import type { User } from 'firebase/auth';

export type IState = {
  loginUser: User | null;
  tenants: ITenant[];
};
