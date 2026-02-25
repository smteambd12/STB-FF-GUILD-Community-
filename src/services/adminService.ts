import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AccessCodes {
  super_admin: string;
  sub_admin: string;
  editor: string;
}

const DEFAULT_CODES: AccessCodes = {
  super_admin: 'admin123',
  sub_admin: 'sub123',
  editor: 'edit123'
};

export const getAccessCodes = async (): Promise<AccessCodes> => {
  if (!db) return DEFAULT_CODES;
  
  try {
    const docRef = doc(db, 'system', 'access_codes');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as AccessCodes;
    } else {
      // Initialize with defaults if not exists
      // Note: This might fail if user doesn't have write permission yet, which is fine
      return DEFAULT_CODES;
    }
  } catch (error) {
    console.warn("Failed to fetch access codes, using defaults:", error);
    return DEFAULT_CODES;
  }
};

export const updateAccessCodes = async (newCodes: AccessCodes): Promise<void> => {
  if (!db) throw new Error("Database not initialized");
  
  const docRef = doc(db, 'system', 'access_codes');
  await setDoc(docRef, newCodes);
};
