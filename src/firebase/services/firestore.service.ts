import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  CollectionReference,
  type DocumentData,
  type QueryConstraint,
  type WhereFilterOp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../';
import dayjs from 'dayjs';

/**
 * Get collection reference
 */
const getCollectionRef = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

/**
 * Get all documents
 */

export const getAll = async <T>(
  collectionName: string,
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'asc'
): Promise<(T & { id: string })[]> => {
  const colRef = getCollectionRef<T>(collectionName);
  let q: CollectionReference<T> | import('firebase/firestore').Query<T> = colRef;
  if (orderByField) {
    q = query(colRef, orderBy(orderByField, orderDirection));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as T)
  }));
};

/**
 * Get documents with query, where, orderBy, limit
 */
export interface FirestoreQueryOption {
  wheres?: Array<{
    field: string;
    op: WhereFilterOp;
    value: unknown;
  }>;

  orderBy?: { field: string; direction?: 'asc' | 'desc' };
  limit?: number;
}

export const get = async <T>(
  collectionName: string,
  options?: FirestoreQueryOption
): Promise<(T & { id: string })[]> => {
  const colRef = getCollectionRef<T>(collectionName);
  let q: CollectionReference<T> | import('firebase/firestore').Query<T> = colRef;

  const queryConstraints: QueryConstraint[] = [];

  if (options?.wheres) {
    for (const w of options.wheres) {
      queryConstraints.push(where(w.field, w.op, w.value));
    }
  }

  if (options?.orderBy) {
    queryConstraints.push(orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
  }
  if (options?.limit) {
    queryConstraints.push(limit(options.limit));
  }
  if (queryConstraints.length > 0) {
    q = query(colRef, ...queryConstraints);
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as T)
  }));
};

/**
 * Get document by id
 */
export const getById = async <T>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> => {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as T)
  };
};

/**
 * Add document
 */
export const add = async <T>(collectionName: string, data: T): Promise<string> => {
  const colRef = getCollectionRef<T>(collectionName);
  const docRef = await addDoc(colRef, data);
  return docRef.id;
};

/**
 * Update document
 */
export const update = async <T>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
};

/**
 * Delete document
 */
export const remove = async (collectionName: string, id: string): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

/**
 * Format timestamp created by firebase using dayjs
 */
export const formatFSTime = (ts?: Timestamp, format = 'DD/MM/YYYY HH:mm') => {
  if (!ts) {
    return '--';
  }
  return dayjs(ts.toDate()).format(format);
};
