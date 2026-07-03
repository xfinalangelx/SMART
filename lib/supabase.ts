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

export type GraphPoint = { date: string; value: number };

/**
 * Keys of the built-in tracked series. Legacy keys are kept so previously
 * saved data keeps loading:
 * - `bloodSugar` holds fasting blood glucose readings
 * - `lipid` holds total cholesterol readings
 * - `renal` holds legacy eGFR readings (no longer shown; replaced by
 *   creatinine + UACR per clinical feedback)
 */
export type SeriesKey =
  | 'cd4'
  | 'viralLoad'
  | 'bloodSugar'
  | 'hba1c'
  | 'renal'
  | 'creatinine'
  | 'uacr'
  | 'liver'
  | 'alt'
  | 'ast'
  | 'lipid'
  | 'ldl'
  | 'hdl'
  | 'triglycerides';

export type GraphData = Record<SeriesKey, GraphPoint[]>;

/** A user-defined blood analysis with its own normal range. */
export type CustomAnalysis = {
  id: string;
  name: string;
  unit: string;
  normalLow?: number;
  normalHigh?: number;
  data: GraphPoint[];
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

/** A user-added checklist entry (vaccine or any other reminder). */
export type CustomChecklistItem = {
  id: string;
  title: string;
  dateFirst: string;
  dateSecond: string;
};

export type BloodTestItem = {
  id: number;
  dateFirst: string;
  dateSecond: string;
  firstCap: string;
  secondCap: string;
  icon: any;
  title: string;
  /** Remind the user to fast before this test. */
  fastingReminder?: boolean;
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
  entry: string;
  mood?: string;
};

export type VaccineKey =
  | 'influenza'
  | 'pneumococcal'
  | 'pneumo13'
  | 'pneumo20'
  | 'pneumo23'
  | 'hepatitisB'
  | 'menACWY'
  | 'menB'
  | 'hpv';

export type CheckListData = {
  vaccine: Record<VaccineKey, VaccineItem>;
  /** "Others" — user-created checklist items. */
  customVaccines: CustomChecklistItem[];
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
    notificationsEnabled: boolean;
  };
  graphData: GraphData;
  customAnalyses: CustomAnalysis[];
  checkList: CheckListData;
};

export type AppState = {
  appData: AppData;
  userID?: string;
  userEmail?: string;
};
