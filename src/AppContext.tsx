import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';

interface CalculatorFeature {
  id: string;
  name: string;
  normalPrice: number;
  promoPrice: number;
  iconName: string;
}

interface CalculatorCategory {
  id: string;
  name: string;
  features: CalculatorFeature[];
}

interface Content {
  hero: { title: string; subtitle: string };
  about: { title: string; description: string };
  portfolio: { title: string; description: string; tech: string[]; image: string; link: string }[];
  services: { title: string; description: string; iconName: string }[];
  pricing: { name: string; price: string; originalPrice?: string; features: string[]; recommended: boolean }[];
  testimonials: { name: string; role: string; text: string; avatar: string }[];
  calculator: {
    categories: CalculatorCategory[];
    discountThreshold: number;
    discountPercentage: number;
  };
}

interface AppContextType {
  user: User | null;
  loading: boolean;
  content: Content | null;
}

const AppContext = createContext<AppContextType>({ user: null, loading: true, content: null });

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    // Check for emergency bypass session
    const bypassSessionStr = localStorage.getItem("simpluse_admin_bypass");
    if (bypassSessionStr) {
      try {
        const session = JSON.parse(bypassSessionStr);
        // Valid for 24 hours
        if (Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
          setUser({ email: session.email, uid: "bypass-admin" } as any);
        } else {
          localStorage.removeItem("simpluse_admin_bypass");
        }
      } catch (e) {
        localStorage.removeItem("simpluse_admin_bypass");
      }
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
      setLoading(false);
    });

    // Safety timeout: if auth doesn't respond in 5 seconds, stop loading
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribeContent = onSnapshot(
      doc(db, 'content', 'landing'),
      (snapshot) => {
        if (snapshot.exists()) {
          setContent(snapshot.data() as Content);
        }
      },
      (error) => {
        console.warn("Firestore snapshot error (likely network/offline):", error.message);
        // We don't throw here to prevent crashing the app if offline
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeContent();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AppContext.Provider value={{ user, loading, content }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
