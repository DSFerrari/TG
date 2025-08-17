import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dexinwdvkjmgckzgbbgh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRleGlud2R2a2ptZ2NremdiYmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1ODk2NDksImV4cCI6MjA3MDE2NTY0OX0.F0l-jTcA3q_RThTVRnNyqpiCrGr-C5_PzJWaBvD9EUo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});