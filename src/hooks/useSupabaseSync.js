import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../config/supabase';

export const useSupabaseSync = (gameData, updateGameData) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncEnabled, setSyncEnabled] = useState(isSupabaseConfigured());

  // Check auth state on mount
  useEffect(() => {
    if (!syncEnabled) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        loadFromCloud();
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        loadFromCloud();
      }
    });

    return () => subscription.unsubscribe();
  }, [syncEnabled]);

  // Auto-save to cloud when data changes (debounced)
  useEffect(() => {
    if (!user || !syncEnabled) return;

    const timeoutId = setTimeout(() => {
      saveToCloud(gameData);
    }, 2000); // Save 2 seconds after last change

    return () => clearTimeout(timeoutId);
  }, [gameData, user, syncEnabled]);

  // Sign in with email
  const signInWithEmail = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  // Sign up with email
  const signUpWithEmail = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  // Save data to cloud
  const saveToCloud = async (data) => {
    if (!user || syncing) return;

    setSyncing(true);
    try {
      const { error } = await supabase
        .from('user_data')
        .upsert({
          user_id: user.id,
          game_data: data,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setLastSync(new Date());
      console.log('✅ Data synced to cloud');
      return { success: true };
    } catch (error) {
      console.error('Save to cloud error:', error);
      return { success: false, error: error.message };
    } finally {
      setSyncing(false);
    }
  };

  // Load data from cloud
  const loadFromCloud = async () => {
    if (!user) return;

    setSyncing(true);
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('game_data, updated_at')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows" error

      if (data?.game_data) {
        // Merge cloud data with local data (cloud data takes priority)
        updateGameData(data.game_data);
        setLastSync(new Date(data.updated_at));
        console.log('✅ Data loaded from cloud');
        return { success: true, data: data.game_data };
      }

      return { success: true, data: null };
    } catch (error) {
      console.error('Load from cloud error:', error);
      return { success: false, error: error.message };
    } finally {
      setSyncing(false);
    }
  };

  return {
    user,
    loading,
    syncing,
    lastSync,
    syncEnabled,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    saveToCloud: () => saveToCloud(gameData),
    loadFromCloud,
  };
};
