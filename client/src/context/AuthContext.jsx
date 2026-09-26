import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('your_supabase') &&
  !supabaseAnonKey.includes('placeholder') &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const DEMO_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'alex.rivera@mit.edu',
  user_metadata: {
    full_name: 'Alex Rivera',
    academic_institution: 'Massachusetts Institute of Technology',
    field_of_study: 'EECS & Mechanical Engineering'
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session exists in localStorage
    const savedUser = localStorage.getItem('easyspace_user');
    const savedToken = localStorage.getItem('easyspace_token');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setSession({ access_token: savedToken });
      } catch (e) {
        setUser(DEMO_USER);
        setSession({ access_token: 'demo-token' });
      }
    } else {
      // Default to demo student for seamless experience
      setUser(DEMO_USER);
      setSession({ access_token: 'demo-token' });
      localStorage.setItem('easyspace_user', JSON.stringify(DEMO_USER));
      localStorage.setItem('easyspace_token', 'demo-token');
      localStorage.setItem('easyspace_demo_mode', 'true');
    }

    // If Supabase is connected, subscribe to auth changes
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setSession(session);
          setUser(session.user);
          localStorage.setItem('easyspace_token', session.access_token);
          localStorage.setItem('easyspace_user', JSON.stringify(session.user));
          localStorage.removeItem('easyspace_demo_mode');
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setSession(session);
          setUser(session.user);
          localStorage.setItem('easyspace_token', session.access_token);
          localStorage.setItem('easyspace_user', JSON.stringify(session.user));
          localStorage.removeItem('easyspace_demo_mode');
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const loginDemoUser = () => {
    setUser(DEMO_USER);
    setSession({ access_token: 'demo-token' });
    localStorage.setItem('easyspace_user', JSON.stringify(DEMO_USER));
    localStorage.setItem('easyspace_token', 'demo-token');
    localStorage.setItem('easyspace_demo_mode', 'true');
    return true;
  };

  const signIn = async (email, password) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
      localStorage.setItem('easyspace_token', data.session.access_token);
      localStorage.setItem('easyspace_user', JSON.stringify(data.user));
      localStorage.removeItem('easyspace_demo_mode');
      return data;
    } else {
      // Offline / Local fallback login
      const customUser = {
        id: crypto.randomUUID(),
        email,
        user_metadata: {
          full_name: email.split('@')[0],
          academic_institution: 'Engineering University',
          field_of_study: 'STEM Curriculum'
        }
      };
      setUser(customUser);
      setSession({ access_token: 'demo-token' });
      localStorage.setItem('easyspace_user', JSON.stringify(customUser));
      localStorage.setItem('easyspace_token', 'demo-token');
      localStorage.setItem('easyspace_demo_mode', 'true');
      return { user: customUser };
    }
  };

  const signUp = async (email, password, fullName, institution, fieldOfStudy) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            academic_institution: institution,
            field_of_study: fieldOfStudy
          }
        }
      });
      if (error) throw error;
      if (data.session) {
        setUser(data.user);
        setSession(data.session);
        localStorage.setItem('easyspace_token', data.session.access_token);
        localStorage.setItem('easyspace_user', JSON.stringify(data.user));
      }
      return data;
    } else {
      const customUser = {
        id: crypto.randomUUID(),
        email,
        user_metadata: {
          full_name: fullName || email.split('@')[0],
          academic_institution: institution || 'MIT / Stanford',
          field_of_study: fieldOfStudy || 'Computer Science'
        }
      };
      setUser(customUser);
      setSession({ access_token: 'demo-token' });
      localStorage.setItem('easyspace_user', JSON.stringify(customUser));
      localStorage.setItem('easyspace_token', 'demo-token');
      localStorage.setItem('easyspace_demo_mode', 'true');
      return { user: customUser };
    }
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('easyspace_user');
    localStorage.removeItem('easyspace_token');
    localStorage.removeItem('easyspace_demo_mode');
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        loginDemoUser,
        isDemo: !isSupabaseConfigured || localStorage.getItem('easyspace_demo_mode') === 'true'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
