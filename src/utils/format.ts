import type { ITenant } from '@/features/Tenant/model';
import { formatFSTime } from '@/firebase/services/firestore.service';

export const formatTenant = (item: Record<string, any> | null) => {
  if (!item) {
    return item;
  }
  return {
    id: item.id,
    title: item.title,
    userId: item.userId,
    userDisplayName: item.userDisplayName,
    isPrivate: item.isPrivate,
    createdAt: formatFSTime(item.createdAt),
    updatedAt: formatFSTime(item.updatedAt)
  } satisfies ITenant;
};
