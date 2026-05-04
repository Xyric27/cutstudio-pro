import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  writeBatch,
  query,
  orderBy,
  enableIndexedDbPersistence,
} from "firebase/firestore";

export interface FirebaseConfig {
  apiKey: string;
  projectId: string;
  razorpayKey?: string;
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

/**
 * Initialize Firebase with configuration
 */
export function initFirebase(config: FirebaseConfig): boolean {
  if (!config.apiKey || !config.projectId) {
    console.error("❌ initFirebase: Missing apiKey or projectId");
    return false;
  }
  
  try {
    const existing = getApps();
    if (existing.length > 0) {
      app = existing[0];
      console.log("✅ Using existing Firebase app");
    } else {
      app = initializeApp({
        apiKey: config.apiKey,
        authDomain: `${config.projectId}.firebaseapp.com`,
        projectId: config.projectId,
        storageBucket: `${config.projectId}.firebasestorage.app`,
        messagingSenderId: "000000000000", // Optional: Add yours if needed
        appId: "1:000000000000:web:000000000000000000000000", // Optional: Add yours
      });
      console.log("✅ Firebase app initialized");
    }
    
    db = getFirestore(app);
    
    // Enable offline persistence
    if (typeof window !== 'undefined') {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('⚠️ Persistence failed: multiple tabs open');
        }
      });
    }
    
    return true;
  } catch (e) {
    console.error("❌ Firebase init failed:", e);
    return false;
  }
}

export function getDB(): Firestore | null {
  return db;
}

/**
 * Get all documents from a collection (ordered by createdAt desc)
 */
export async function fsGetAll<T>(collectionName: string): Promise<T[]> {
  if (!db) {
    console.error("❌ fsGetAll: Firestore not initialized");
    return [];
  }
  
  try {
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    
    const results = snap.docs.map(d => ({ 
      id: d.id, 
      ...d.data() 
    })) as T[];
    
    console.log(`📦 fsGetAll(${collectionName}): ${results.length} documents`);
    return results;
  } catch (e) {
    console.error(`❌ fsGetAll(${collectionName}) error:`, e);
    return [];
  }
}

/**
 * Set/Create a document - SUPPORTS AUTO-GENERATED IDs!
 * If item.id exists → updates/creates with that ID
 * If item.id missing → creates new document with auto-generated ID
 */
export async function fsSet<T extends { id?: string; uid?: string }>(
  collectionName: string,
  item: T
): Promise<string> {
  if (!db) {
    throw new Error("Firestore not initialized");
  }
  
  try {
    const itemId = (item as any).id || (item as any).uid;
    const timestampedItem = {
      ...item,
      updatedAt: new Date().toISOString(),
      ...(item.createdAt ? {} : { createdAt: new Date().toISOString() })
    };
    
    let docId: string;
    
    if (itemId) {
      // Update or create with specific ID
      await setDoc(doc(db, collectionName, itemId), timestampedItem, { merge: true });
      docId = itemId;
      console.log(`✅ fsSet(${collectionName}): Updated ${docId}`);
    } else {
      // Create new document with auto-generated ID
      const docRef = await addDoc(collection(db, collectionName), timestampedItem);
      docId = docRef.id;
      console.log(`✅ fsSet(${collectionName}): Created new ${docId}`);
    }
    
    return docId;
  } catch (e) {
    console.error(`❌ fsSet(${collectionName}) error:`, e);
    throw e;
  }
}

/**
 * Batch write multiple documents
 */
export async function fsBatchWrite<T extends { id?: string; uid?: string }>(
  collectionName: string,
  items: T[]
): Promise<void> {
  if (!db || items.length === 0) return;
  
  try {
    const batch = writeBatch(db);
    
    items.forEach(item => {
      const id = (item as any).id || (item as any).uid;
      if (id) {
        batch.set(doc(db!, collectionName, id), {
          ...item,
          createdAt: item.createdAt || new Date().toISOString()
        }, { merge: true });
      }
    });
    
    await batch.commit();
    console.log(`✅ fsBatchWrite(${collectionName}): ${items.length} documents`);
  } catch (e) {
    console.error("❌ fsBatchWrite error:", e);
    throw e;
  }
}

/**
 * Delete a document by ID
 */
export async function fsDelete(collectionName: string, id: string): Promise<void> {
  if (!db) return;
  
  try {
    await deleteDoc(doc(db, collectionName, id));
    console.log(`✅ fsDelete(${collectionName}): Deleted ${id}`);
  } catch (e) {
    console.error(`❌ fsDelete error:`, e);
    throw e;
  }
}

/**
 * Listen to real-time updates on a collection
 * Returns unsubscribe function
 */
export function fsListen<T>(
  collectionName: string,
  callback: (items: T[]) => void
): () => void {
  if (!db) {
    console.error("❌ fsListen: Firestore not initialized");
    return () => {};
  }
  
  try {
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    
    const unsub = onSnapshot(q, 
      (snapshot) => {
        const items = snapshot.docs.map(d => ({ 
          id: d.id, 
          ...d.data() 
        })) as T[];
        
        callback(items);
        console.log(`📡 fsListen(${collectionName}): ${items.length} docs`);
      },
      (error) => {
        console.error(`❌ fsListen(${collectionName}) error:`, error);
      }
    );
    
    return unsub;
  } catch (e) {
    console.error("❌ fsListen setup error:", e);
    return () => {};
  }
}
