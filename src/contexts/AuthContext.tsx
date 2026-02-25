import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { UserProfile, Role } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  accessLevel: Role | null; // Track the level unlocked via Password Gate
  login: () => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  setAccessLevel: (level: Role | null) => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessLevel, setAccessLevel] = useState<Role | null>(null);

  useEffect(() => {
    if (!auth || !db) {
      // Mock user for demo if Firebase is not configured
      setUser({
        uid: 'demo-admin',
        email: 'admin@stb.com',
        displayName: 'Demo Super Admin',
        role: 'super_admin',
        createdAt: Date.now()
      });
      setAccessLevel('super_admin'); // Auto-unlock for demo
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile from Firestore
          const userDocRef = doc(db!, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            setUser(userData);
            // If they are already a super_admin in DB, auto-grant access level?
            // User requested "Password to enter", so maybe we DON'T auto-grant accessLevel based on DB role?
            // But for usability, if I'm logged in as Super Admin, I shouldn't need a password every time.
            // Let's say: DB Role = Permanent Identity. Access Level = Session Unlock.
            // We'll auto-grant if DB role matches, but the Gate allows "Guest" to enter password to become Admin temporarily (or prompt login).
            if (userData.role === 'super_admin') setAccessLevel('super_admin');
            else if (userData.role === 'sub_admin') setAccessLevel('sub_admin');
            else if (userData.role === 'editor') setAccessLevel('editor');
          } else {
            // Create new user profile if not exists
            const newUser: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'New Member',
              role: 'member', // Default role
              photoURL: firebaseUser.photoURL || undefined,
              createdAt: Date.now()
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setError("Failed to load user profile.");
        }
      } else {
        setUser(null);
        setAccessLevel(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    setError(null);
    if (!auth) {
      alert("Firebase not configured. Using demo mode.");
      loginDemo();
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Login failed", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError(`Domain not authorized: ${window.location.hostname}`);
      } else if (err.code === 'auth/popup-blocked') {
        setError("Popup blocked. Please allow popups for this site and try again.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("Login cancelled. You closed the popup.");
      } else {
        setError(err.message || "Login failed");
      }
    }
  };

  const loginDemo = async () => {
    setUser({
      uid: 'demo-admin',
      email: 'admin@stb.com',
      displayName: 'Demo Super Admin',
      role: 'super_admin',
      createdAt: Date.now()
    });
    setAccessLevel('super_admin');
    setError(null);
  };

  const logout = async () => {
    if (!auth) {
      setUser(null);
      setAccessLevel(null);
      return;
    }
    try {
      await signOut(auth);
      setAccessLevel(null);
    } catch (err: any) {
      console.error("Logout failed", err);
      setError(err.message || "Logout failed");
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    accessLevel,
    setAccessLevel,
    login,
    loginDemo,
    logout,
    isAdmin: accessLevel === 'super_admin' || accessLevel === 'sub_admin',
    isSuperAdmin: accessLevel === 'super_admin',
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
