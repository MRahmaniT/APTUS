import { db } from "../config/firebase";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query } from "firebase/firestore";

export const FirebaseRepository = {
  saveDocument: async (collectionName: string, docId: string, data: any) => {
    return await setDoc(doc(db, collectionName, docId), data, { merge: true });
  },
  
  getDocument: async (collectionName: string, docId: string) => {
    const snap = await getDoc(doc(db, collectionName, docId));
    return snap.exists() ? snap.data() : null;
  },

  getAllDocuments: async (collectionName: string) => {
    const q = query(collection(db, collectionName));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  updateDocument: async (collectionName: string, docId: string, data: any) => {
    return await updateDoc(doc(db, collectionName, docId), data);
  }
};
