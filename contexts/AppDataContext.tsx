import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  supabase,
  AppData,
  AppState,
  AppointmentItem,
  BloodTestItem,
  CustomAnalysis,
  CustomChecklistItem,
  GraphData,
  GraphPoint,
  JournalItem,
  SeriesKey,
  VaccineItem,
  VaccineKey,
} from '@/lib/supabase';
import { syncNotifications } from '@/utils/notifications';

const vaccineIcon = require('../assets/img/vaccinelist.png');
const testIcon = require('../assets/img/testlist.png');

const makeVaccine = (id: number, title: string): VaccineItem => ({
  id,
  dateFirst: 'XXXX/XX/XX',
  dateSecond: 'XXXX/XX/XX',
  firstCap: 'Last inject: ',
  secondCap: 'Next injection: ',
  icon: vaccineIcon,
  title,
});

const makeBloodTest = (id: number, title: string): BloodTestItem => ({
  id,
  dateFirst: 'XXXX/XX/XX',
  dateSecond: 'XXXX/XX/XX',
  firstCap: 'Date Taken: ',
  secondCap: 'Next Date: ',
  icon: testIcon,
  title,
  fastingReminder: false,
});

const emptyGraphData = (): GraphData => ({
  cd4: [],
  viralLoad: [],
  bloodSugar: [],
  hba1c: [],
  renal: [],
  creatinine: [],
  uacr: [],
  liver: [],
  alt: [],
  ast: [],
  lipid: [],
  ldl: [],
  hdl: [],
  triglycerides: [],
});

const defaultVaccines = (): Record<VaccineKey, VaccineItem> => ({
  influenza: makeVaccine(1, 'Influenza'),
  pneumococcal: makeVaccine(2, 'Pneumococcal'),
  pneumo13: makeVaccine(3, 'Pneumo 13'),
  pneumo20: makeVaccine(6, 'Pneumo 20'),
  pneumo23: makeVaccine(4, 'Pneumo 23'),
  hepatitisB: makeVaccine(7, 'Hepatitis B'),
  menACWY: makeVaccine(8, 'Meningococcal (MenACWY)'),
  menB: makeVaccine(9, 'Meningococcal (MenB)'),
  hpv: makeVaccine(5, 'HPV'),
});

// Initial state with proper typing
const initialState: AppState = {
  appData: {
    settings: {
      language: 'bm',
      notificationsEnabled: false,
    },
    graphData: emptyGraphData(),
    customAnalyses: [],
    checkList: {
      vaccine: defaultVaccines(),
      customVaccines: [],
      bloodTest: {
        renal: makeBloodTest(6, 'Renal Profile'),
        liver: makeBloodTest(7, 'Liver Profile'),
        glucose: makeBloodTest(8, 'Glucose'),
      },
      appointment: [],
      journal: [],
    },
  },
};

/**
 * Older saved profiles miss keys that were added later (new vaccines, new
 * graph series, custom analyses, notification settings). Merge whatever was
 * loaded over the defaults so every field the app relies on exists.
 */
const normalizeAppData = (loaded: any): AppData => {
  const defaults = initialState.appData;
  const vaccines = defaultVaccines();
  const loadedVaccine = loaded?.checkList?.vaccine || {};
  (Object.keys(vaccines) as VaccineKey[]).forEach((key) => {
    if (loadedVaccine[key]) {
      vaccines[key] = { ...vaccines[key], ...loadedVaccine[key], icon: vaccineIcon };
    }
  });

  const graphData = emptyGraphData();
  (Object.keys(graphData) as SeriesKey[]).forEach((key) => {
    const arr = loaded?.graphData?.[key];
    if (Array.isArray(arr)) graphData[key] = arr;
  });

  const mergeTest = (key: 'renal' | 'liver' | 'glucose'): BloodTestItem => ({
    ...defaults.checkList.bloodTest[key],
    ...(loaded?.checkList?.bloodTest?.[key] || {}),
    icon: testIcon,
  });

  return {
    settings: {
      language: loaded?.settings?.language === 'en' ? 'en' : 'bm',
      notificationsEnabled: !!loaded?.settings?.notificationsEnabled,
    },
    graphData,
    customAnalyses: Array.isArray(loaded?.customAnalyses) ? loaded.customAnalyses : [],
    checkList: {
      vaccine: vaccines,
      customVaccines: Array.isArray(loaded?.checkList?.customVaccines)
        ? loaded.checkList.customVaccines
        : [],
      bloodTest: {
        renal: mergeTest('renal'),
        liver: mergeTest('liver'),
        glucose: mergeTest('glucose'),
      },
      appointment: Array.isArray(loaded?.checkList?.appointment) ? loaded.checkList.appointment : [],
      journal: Array.isArray(loaded?.checkList?.journal) ? loaded.checkList.journal : [],
    },
  };
};

// Action types
type AppAction =
  | { type: 'REFRESH' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'bm' }
  | { type: 'SET_NOTIFICATIONS'; payload: boolean }
  | { type: 'ADD_POINT'; payload: { series: SeriesKey; point: GraphPoint } }
  | { type: 'EDIT_POINT'; payload: { series: SeriesKey; index: number; point: GraphPoint } }
  | { type: 'DELETE_POINT'; payload: { series: SeriesKey; index: number } }
  | { type: 'ADD_CUSTOM_ANALYSIS'; payload: CustomAnalysis }
  | { type: 'UPDATE_CUSTOM_ANALYSIS'; payload: { id: string; patch: Partial<Omit<CustomAnalysis, 'id' | 'data'>> } }
  | { type: 'DELETE_CUSTOM_ANALYSIS'; payload: string }
  | { type: 'ADD_CUSTOM_POINT'; payload: { id: string; point: GraphPoint } }
  | { type: 'EDIT_CUSTOM_POINT'; payload: { id: string; index: number; point: GraphPoint } }
  | { type: 'DELETE_CUSTOM_POINT'; payload: { id: string; index: number } }
  | { type: 'MODIFY_VACCINE'; payload: { key: VaccineKey; item: VaccineItem } }
  | { type: 'ADD_CUSTOM_VACCINE'; payload: CustomChecklistItem }
  | { type: 'UPDATE_CUSTOM_VACCINE'; payload: { id: string; patch: Partial<CustomChecklistItem> } }
  | { type: 'DELETE_CUSTOM_VACCINE'; payload: string }
  | { type: 'MODIFY_BLOOD_TEST'; payload: { key: 'renal' | 'liver' | 'glucose'; item: BloodTestItem } }
  | { type: 'ADD_APPOINTMENT'; payload: AppointmentItem }
  | { type: 'MODIFY_APPOINTMENT'; payload: AppointmentItem[] }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'ADD_JOURNAL'; payload: JournalItem | any }
  | { type: 'MODIFY_JOURNAL'; payload: any[] }
  | { type: 'DELETE_JOURNAL'; payload: string };

// Context type
type AppDataContextType = {
  state: AppState;
  dispatch: (action: AppAction) => Promise<void>;
  isLoading: boolean;
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Save data to both AsyncStorage and Supabase
const saveData = async (state: AppState): Promise<void> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('No user logged in, skipping save');
      return;
    }

    // Strip non-serializable icon references (require() handles)
    const jsonState = JSON.stringify(state, (key, value) =>
      key === 'icon' ? undefined : value
    );

    // Save to AsyncStorage
    await AsyncStorage.setItem('appData', jsonState);

    // Save to Supabase using UPSERT (creates row if doesn't exist)
    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          email: user.email,
          data: jsonState,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('❌ Supabase save error:', error);
    }
  } catch (error) {
    console.error('❌ Save error:', error);
  }
};

// Load data from Supabase
const loadData = async (): Promise<AppState> => {
  try {
    const {
      data: { session: activeSession },
    } = await supabase.auth.getSession();

    if (!activeSession) {
      return initialState;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return initialState;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('data')
      .eq('id', user.id)
      .single();

    if (error || !data || !data.data || data.data === '{}') {
      await saveData(initialState);
      return initialState;
    }

    const dbData = JSON.parse(data.data);
    await AsyncStorage.setItem('appData', data.data);

    return {
      ...initialState,
      appData: normalizeAppData(dbData?.appData),
      userID: user.id,
      userEmail: user.email,
    };
  } catch (error) {
    console.error('Load error:', error);
    return initialState;
  }
};

// Provider component
type AppDataProviderProps = {
  children: ReactNode;
};

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const notifTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const loadedData = await loadData();
          setState(loadedData);
        }
      } catch (error) {
        console.error('Initialize error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Keep scheduled reminders in sync with the data (debounced)
  useEffect(() => {
    if (isLoading) return;
    if (notifTimer.current) clearTimeout(notifTimer.current);
    notifTimer.current = setTimeout(() => {
      syncNotifications(state.appData).catch((err) =>
        console.warn('Notification sync failed:', err)
      );
    }, 1200);
    return () => {
      if (notifTimer.current) clearTimeout(notifTimer.current);
    };
  }, [state.appData, isLoading]);

  /** Apply an immutable update to appData, persist, and update state. */
  const update = (updater: (appData: AppData) => AppData): void => {
    setState((prevState) => {
      const newState: AppState = { ...prevState, appData: updater(prevState.appData) };
      saveData(newState);
      return newState;
    });
  };

  const updateSeries = (series: SeriesKey, fn: (points: GraphPoint[]) => GraphPoint[]) =>
    update((appData) => ({
      ...appData,
      graphData: { ...appData.graphData, [series]: fn(appData.graphData[series] || []) },
    }));

  const updateCustomAnalyses = (fn: (list: CustomAnalysis[]) => CustomAnalysis[]) =>
    update((appData) => ({ ...appData, customAnalyses: fn(appData.customAnalyses || []) }));

  const updateCheckList = (fn: (checkList: AppData['checkList']) => AppData['checkList']) =>
    update((appData) => ({ ...appData, checkList: fn(appData.checkList) }));

  // Dispatch function to handle actions
  const dispatch = async (action: AppAction): Promise<void> => {
    switch (action.type) {
      case 'REFRESH': {
        const data = await loadData();
        setState(data);
        break;
      }

      case 'SET_LANGUAGE': {
        update((appData) => ({
          ...appData,
          settings: { ...appData.settings, language: action.payload },
        }));
        break;
      }

      case 'SET_NOTIFICATIONS': {
        update((appData) => ({
          ...appData,
          settings: { ...appData.settings, notificationsEnabled: action.payload },
        }));
        break;
      }

      case 'ADD_POINT': {
        updateSeries(action.payload.series, (points) => [...points, action.payload.point]);
        break;
      }

      case 'EDIT_POINT': {
        updateSeries(action.payload.series, (points) =>
          points.map((p, i) => (i === action.payload.index ? action.payload.point : p))
        );
        break;
      }

      case 'DELETE_POINT': {
        updateSeries(action.payload.series, (points) =>
          points.filter((_, i) => i !== action.payload.index)
        );
        break;
      }

      case 'ADD_CUSTOM_ANALYSIS': {
        updateCustomAnalyses((list) => [...list, action.payload]);
        break;
      }

      case 'UPDATE_CUSTOM_ANALYSIS': {
        updateCustomAnalyses((list) =>
          list.map((a) => (a.id === action.payload.id ? { ...a, ...action.payload.patch } : a))
        );
        break;
      }

      case 'DELETE_CUSTOM_ANALYSIS': {
        updateCustomAnalyses((list) => list.filter((a) => a.id !== action.payload));
        break;
      }

      case 'ADD_CUSTOM_POINT': {
        updateCustomAnalyses((list) =>
          list.map((a) =>
            a.id === action.payload.id ? { ...a, data: [...a.data, action.payload.point] } : a
          )
        );
        break;
      }

      case 'EDIT_CUSTOM_POINT': {
        updateCustomAnalyses((list) =>
          list.map((a) =>
            a.id === action.payload.id
              ? {
                  ...a,
                  data: a.data.map((p, i) => (i === action.payload.index ? action.payload.point : p)),
                }
              : a
          )
        );
        break;
      }

      case 'DELETE_CUSTOM_POINT': {
        updateCustomAnalyses((list) =>
          list.map((a) =>
            a.id === action.payload.id
              ? { ...a, data: a.data.filter((_, i) => i !== action.payload.index) }
              : a
          )
        );
        break;
      }

      case 'MODIFY_VACCINE': {
        updateCheckList((checkList) => ({
          ...checkList,
          vaccine: { ...checkList.vaccine, [action.payload.key]: action.payload.item },
        }));
        break;
      }

      case 'ADD_CUSTOM_VACCINE': {
        updateCheckList((checkList) => ({
          ...checkList,
          customVaccines: [...(checkList.customVaccines || []), action.payload],
        }));
        break;
      }

      case 'UPDATE_CUSTOM_VACCINE': {
        updateCheckList((checkList) => ({
          ...checkList,
          customVaccines: (checkList.customVaccines || []).map((item) =>
            item.id === action.payload.id ? { ...item, ...action.payload.patch } : item
          ),
        }));
        break;
      }

      case 'DELETE_CUSTOM_VACCINE': {
        updateCheckList((checkList) => ({
          ...checkList,
          customVaccines: (checkList.customVaccines || []).filter(
            (item) => item.id !== action.payload
          ),
        }));
        break;
      }

      case 'MODIFY_BLOOD_TEST': {
        updateCheckList((checkList) => ({
          ...checkList,
          bloodTest: { ...checkList.bloodTest, [action.payload.key]: action.payload.item },
        }));
        break;
      }

      case 'ADD_APPOINTMENT': {
        updateCheckList((checkList) => ({
          ...checkList,
          appointment: [...checkList.appointment, action.payload],
        }));
        break;
      }

      case 'MODIFY_APPOINTMENT': {
        updateCheckList((checkList) => ({ ...checkList, appointment: action.payload }));
        break;
      }

      case 'DELETE_APPOINTMENT': {
        updateCheckList((checkList) => ({
          ...checkList,
          appointment: checkList.appointment.filter((a: any) => a.id !== action.payload),
        }));
        break;
      }

      case 'ADD_JOURNAL': {
        updateCheckList((checkList) => ({
          ...checkList,
          journal: [...checkList.journal, action.payload],
        }));
        break;
      }

      case 'MODIFY_JOURNAL': {
        updateCheckList((checkList) => ({ ...checkList, journal: action.payload }));
        break;
      }

      case 'DELETE_JOURNAL': {
        updateCheckList((checkList) => ({
          ...checkList,
          journal: checkList.journal.filter((j: any) => j.id !== action.payload),
        }));
        break;
      }
    }
  };

  return (
    <AppDataContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </AppDataContext.Provider>
  );
};

// Custom hook to use the context
export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
