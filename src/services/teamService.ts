import { collection, addDoc, updateDoc, doc, arrayUnion, arrayRemove, getDocs, getDoc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Team, UserProfile } from '../types';

export const createTeam = async (name: string, leaderId: string): Promise<string> => {
  if (!db) throw new Error("Database not initialized");
  
  const teamData = {
    name,
    leaderId,
    members: [leaderId],
    createdAt: Date.now()
  };
  
  const docRef = await addDoc(collection(db, 'teams'), teamData);
  
  // Update user's teamId
  await updateDoc(doc(db, 'users', leaderId), {
    teamId: docRef.id,
    role: 'team_admin' // Promote to Team Admin
  });
  
  return docRef.id;
};

export const joinTeam = async (teamId: string, userId: string): Promise<void> => {
  if (!db) throw new Error("Database not initialized");
  
  const teamRef = doc(db, 'teams', teamId);
  const teamSnap = await getDoc(teamRef);
  
  if (!teamSnap.exists()) throw new Error("Team not found");
  
  const teamData = teamSnap.data() as Team;
  if (teamData.members.length >= 5) throw new Error("Team is full (max 5 members)");
  
  await updateDoc(teamRef, {
    members: arrayUnion(userId)
  });
  
  await updateDoc(doc(db, 'users', userId), {
    teamId: teamId
  });
};

export const leaveTeam = async (teamId: string, userId: string): Promise<void> => {
  if (!db) throw new Error("Database not initialized");
  
  await updateDoc(doc(db, 'teams', teamId), {
    members: arrayRemove(userId)
  });
  
  await updateDoc(doc(db, 'users', userId), {
    teamId: null
  });
};

export const getTeams = async (): Promise<Team[]> => {
  if (!db) return [];
  
  const querySnapshot = await getDocs(collection(db, 'teams'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
};

export const getTeamById = async (teamId: string): Promise<Team | null> => {
  if (!db) return null;
  
  const docRef = doc(db, 'teams', teamId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Team;
  } else {
    return null;
  }
};
