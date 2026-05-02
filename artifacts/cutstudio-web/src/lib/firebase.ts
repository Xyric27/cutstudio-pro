import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";

export interface FirebaseConfig {
  apiKey: string;
  projectId: string;
  razorpayKey: string;
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function initFirebase(config: FirebaseConfig): boolean {
  if (!config.apiKey || !config.projectId) return false;
  try {
    const existing = getApps();
    if (existing.length > 0) {
      app = existing[0];
    } else {
      app = initializeApp({
        apiKey: config.apiKey,
        authDomain: `${config.projectId}.firebaseapp.com`,
        projectId: config.projectId,
        storageBucket: `${config.projectId}.appspot.com`,
        messagingSenderId: "000000000000",
        appId: "1:000000000000:web:000000000000000000000000",
      });
    }
    db = getFirestore(app);
    return true;
  } catch (e) {
    console.error("Firebase init failed:", e);
    return false;
  }
}

export function getDB(): Firestore | null {
  return db;
}

export async function fsGetAll<T>(collectionName: string): Promise<T[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, collectionName));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as T));
}

export async function fsSet<T extends { id?: string; uid?: string }>(
  collectionName: string,
  item: T
): Promise<void> {
  if (!db) return;
  const id = (item as any).id || (item as any).uid;
  if (!id) return;
  await setDoc(doc(db, collectionName, id), item, { merge: true });
}

export async function fsBatchWrite<T extends { id?: string; uid?: string }>(
  collectionName: string,
  items: T[]
): Promise<void> {
  if (!db || items.length === 0) return;
  const batch = writeBatch(db);
  items.forEach(item => {
    const id = (item as any).id || (item as any).uid;
    if (id) batch.set(doc(db!, collectionName, id), item, { merge: true });
  });
  await batch.commit();
}

export async function fsDelete(collectionName: string, id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, collectionName, id));
}

export function fsListen<T>(
  collectionName: string,
  callback: (items: T[]) => void
): () => void {
  if (!db) return () => {};
  return onSnapshot(collection(db, collectionName), snap => {
    callback(snap.docs.map(d => ({ ...d.data() } as T)));
  });
}
