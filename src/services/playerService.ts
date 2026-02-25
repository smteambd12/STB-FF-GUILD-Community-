import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PlayerStats {
  id?: string;
  name: string;
  role: string;
  level: number;
  rank: string;
  kd: string;
  hs: string;
  winRate: string;
  matches: string;
}

export const getPlayers = async (): Promise<PlayerStats[]> => {
  if (!db) return [];
  const querySnapshot = await getDocs(collection(db, 'players'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PlayerStats));
};

export const addPlayer = async (player: Omit<PlayerStats, 'id'>): Promise<string> => {
  if (!db) throw new Error("Database not initialized");
  const docRef = await addDoc(collection(db, 'players'), player);
  return docRef.id;
};

export const updatePlayer = async (id: string, player: Partial<PlayerStats>): Promise<void> => {
  if (!db) throw new Error("Database not initialized");
  await updateDoc(doc(db, 'players', id), player);
};

export const deletePlayer = async (id: string): Promise<void> => {
  if (!db) throw new Error("Database not initialized");
  await deleteDoc(doc(db, 'players', id));
};
