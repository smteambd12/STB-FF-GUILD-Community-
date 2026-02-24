export type Role = 'super_admin' | 'sub_admin' | 'editor' | 'team_admin' | 'member';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  teamId?: string;
  photoURL?: string;
  createdAt: number;
}

export interface Team {
  id: string;
  name: string;
  leaderId: string;
  members: string[]; // array of uids
  logo?: string;
  createdAt: number;
}

export interface Tournament {
  id: string;
  title: string;
  description: string;
  totalSlots: number;
  registeredTeams: string[]; // array of teamIds
  entryFee: number;
  prizePool: string;
  startDate: number;
  status: 'open' | 'closed' | 'completed';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  teamId: string; // Private chat per team
}
