import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// SecureStore adapter for Supabase auth
const SecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting item from SecureStore:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error setting item in SecureStore:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing item from SecureStore:', error);
    }
  },
};

const supabaseUrl = 'https://vkwuxtwrmddjmwkdfapy.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrd3V4dHdybWRkam13a2RmYXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNzI1NTcsImV4cCI6MjA4NDg0ODU1N30.HQ4ybqPu3g1nebcwM78AkJtRiFbqGhWEt1hksk5lb54';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types for database schema
export type Profile = {
  id: string;
  email: string;
  data: string; // JSON string of user data
  created_at?: string;
  updated_at?: string;
};

export type GraphData = {
  cd4: Array<{ date: string; value: number }>;
  bloodSugar: Array<{ date: string; value: number }>;
  renal: Array<{ date: string; value: number }>;
  liver: Array<{ date: string; value: number }>;
  lipid: Array<{ date: string; value: number }>;
};

export type VaccineItem = {
  id: number;
  dateFirst: string;
  dateSecond: string;
  firstCap: string;
  secondCap: string;
  icon: any;
  title: string;
};

export type BloodTestItem = {
  id: number;
  dateFirst: string;
  dateSecond: string;
  firstCap: string;
  secondCap: string;
  icon: any;
  title: string;
};

export type AppointmentItem = {
  id: string;
  date: string;
  time: string;
  title: string;
  notes?: string;
};

export type JournalItem = {
  id: string;
  date: string;
  content: string;
  mood?: string;
};

export type CheckListData = {
  vaccine: {
    influenza: VaccineItem;
    pneumococcal: VaccineItem;
    pneumo13: VaccineItem;
    pneumo23: VaccineItem;
    hpv: VaccineItem;
  };
  bloodTest: {
    renal: BloodTestItem;
    liver: BloodTestItem;
    glucose: BloodTestItem;
  };
  appointment: AppointmentItem[];
  journal: JournalItem[];
};

export type AppData = {
  settings: {
    language: 'en' | 'bm';
  };
  graphData: GraphData;
  checkList: CheckListData;
};

export type AppState = {
  appData: AppData;
  userID?: string;
  userEmail?: string;
};
