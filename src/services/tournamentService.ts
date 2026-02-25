import { collection, addDoc, updateDoc, doc, arrayUnion, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Tournament } from '../types';

export const createTournament = async (data: Omit<Tournament, 'id' | 'registeredTeams'>): Promise<string> => {
  if (!db) throw new Error("Database not initialized");
  
  const tournamentData = {
    ...data,
    registeredTeams: [],
    createdAt: Date.now()
  };
  
  const docRef = await addDoc(collection(db, 'tournaments'), tournamentData);
  return docRef.id;
};

export const registerTeamForTournament = async (tournamentId: string, teamId: string): Promise<void> => {
  if (!db) throw new Error("Database not initialized");
  
  await updateDoc(doc(db, 'tournaments', tournamentId), {
    registeredTeams: arrayUnion(teamId)
  });
};

export const getTournaments = async (): Promise<Tournament[]> => {
  if (!db) return [];
  
  const querySnapshot = await getDocs(collection(db, 'tournaments'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
};

export const deleteTournament = async (tournamentId: string): Promise<void> => {
  if (!db) throw new Error("Database not initialized");
  await deleteDoc(doc(db, 'tournaments', tournamentId));
};
