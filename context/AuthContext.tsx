import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this anywhere in the app to get the current user
export const useAuth = () => useContext(AuthContext);
