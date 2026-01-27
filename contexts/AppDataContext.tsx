import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, AppData, AppState } from '@/lib/supabase';

// Initial state with proper typing
const initialState: AppState = {
  appData: {
    settings: {
      language: 'bm',
    },
    graphData: {
      cd4: [],
      bloodSugar: [],
      renal: [],
      liver: [],
      lipid: [],
    },
    checkList: {
      vaccine: {
        influenza: {
          id: 1,
          dateFirst: 'XXXX/XX/XX',
          dateSecond: 'XXXX/XX/XX',
          firstCap: 'Last inject: ',
          secondCap: 'Next injection: ',
          icon: require('../assets/img/vaccinelist.png'),
          title: 'Influenza',
        },
        pneumococcal: {
          id: 2,
          dateFirst: 'XXXX/XX/XX',
          dateSecond: 'XXXX/XX/XX',
          firstCap: 'Last inject: ',
          secondCap: 'Next injection: ',
          icon: require('../assets/img/vaccinelist.png'),
          title: 'Pneumococcal',
        },
        pneumo13: {
          id: 3,
          dateFirst: 'XXXX/XX/XX',
          dateSecond: 'XXXX/XX/XX',
          firstCap: 'Last inject: ',
          secondCap: 'Next injection: ',
          icon: require('../assets/img/vaccinelist.png'),
          title: 'Pneumo 13',
        },
        pneumo23: {
          id: 4,
          dateFirst: 'XXXX/XX/XX',
          dateSecond: 'XXXX/XX/XX',
          firstCap: 'Last inject: ',
          secondCap: 'Next injection: ',
          icon: require('../assets/img/vaccinelist.png'),
          title: 'Pneumo 23',
        },
        hpv: {
          id: 5,
          dateFirst: 'XXXX/XX/XX',
          dateSecond: 'XXXX/XX/XX',
          firstCap: 'Last inject: ',
          secondCap: 'Next injection: ',
          icon: require('../assets/img/vaccinelist.png'),
          title: 'HPV',
        },
      },
      bloodTest: {
        renal: {
          id: 6,
          dateFirst: 'XXXX/XX/XX',
          dateSecond: 'XXXX/XX/XX',
          firstCap: 'Date Taken: ',
          secondCap: 'Next Date: ',
          icon: require('../assets/img/testlist.png'),
          title: 'Renal Profile',
        },
        liver: {
          id: 7,
          dateFirst: 'XXXX/XX/XX',
          dateSecond: 'XXXX/XX/XX',
          firstCap: 'Date Taken: ',
          secondCap: 'Next Date: ',
          icon: require('../assets/img/testlist.png'),
          title: 'Liver Profile',
        },
        glucose: {
          id: 8,
          dateFirst: 'XXXX/XX/XX',
          dateSecond: 'XXXX/XX/XX',
          firstCap: 'Date Taken: ',
          secondCap: 'Next Date: ',
          icon: require('../assets/img/testlist.png'),
          title: 'Glucose',
        },
      },
      appointment: [],
      journal: [],
    },
  },
};

// Action types
type AppAction =
  | { type: 'REFRESH' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'bm' }
  | { type: 'ADD_CD4'; payload: { date: string; value: number } }
  | { type: 'MODIFY_CD4'; payload: Array<{ date: string; value: number }> }
  | { type: 'EDIT_CD4'; payload: { index: number; date: string; value: number } }
  | { type: 'DELETE_CD4'; payload: number }
  | { type: 'ADD_BLOOD'; payload: { date: string; value: number } }
  | { type: 'MODIFY_BLOOD'; payload: Array<{ date: string; value: number }> }
  | { type: 'EDIT_BLOOD'; payload: { index: number; date: string; value: number } }
  | { type: 'DELETE_BLOOD'; payload: number }
  | { type: 'ADD_RENAL'; payload: { date: string; value: number } }
  | { type: 'MODIFY_RENAL'; payload: Array<{ date: string; value: number }> }
  | { type: 'EDIT_RENAL'; payload: { index: number; date: string; value: number } }
  | { type: 'DELETE_RENAL'; payload: number }
  | { type: 'ADD_LIVER'; payload: { date: string; value: number } }
  | { type: 'MODIFY_LIVER'; payload: Array<{ date: string; value: number }> }
  | { type: 'EDIT_LIVER'; payload: { index: number; date: string; value: number } }
  | { type: 'DELETE_LIVER'; payload: number }
  | { type: 'ADD_LIPID'; payload: { date: string; value: number } }
  | { type: 'MODIFY_LIPID'; payload: Array<{ date: string; value: number }> }
  | { type: 'EDIT_LIPID'; payload: { index: number; date: string; value: number } }
  | { type: 'DELETE_LIPID'; payload: number }
  | { type: 'MODIFY_INFLUENZA_VACCINE'; payload: any }
  | { type: 'MODIFY_PNEUMO_VACCINE'; payload: any }
  | { type: 'MODIFY_PNEUMO13_VACCINE'; payload: any }
  | { type: 'MODIFY_PNEUMO23_VACCINE'; payload: any }
  | { type: 'MODIFY_HPV_VACCINE'; payload: any }
  | { type: 'MODIFY_RENAL_TEST'; payload: any }
  | { type: 'MODIFY_LIVER_TEST'; payload: any }
  | { type: 'MODIFY_GLUCOSE_TEST'; payload: any }
  | { type: 'ADD_APPOINTMENT'; payload: any }
  | { type: 'MODIFY_APPOINTMENT'; payload: any[] }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'ADD_JOURNAL'; payload: any }
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

    // Create a clean state object without require() calls
    const cleanState = {
      ...state,
      appData: {
        ...state.appData,
        checkList: {
          ...state.appData.checkList,
          vaccine: {
            influenza: {
              ...state.appData.checkList.vaccine.influenza,
              icon: undefined, // Remove icon references
            },
            pneumococcal: {
              ...state.appData.checkList.vaccine.pneumococcal,
              icon: undefined,
            },
            pneumo13: {
              ...state.appData.checkList.vaccine.pneumo13,
              icon: undefined,
            },
            pneumo23: {
              ...state.appData.checkList.vaccine.pneumo23,
              icon: undefined,
            },
            hpv: {
              ...state.appData.checkList.vaccine.hpv,
              icon: undefined,
            },
          },
          bloodTest: {
            renal: {
              ...state.appData.checkList.bloodTest.renal,
              icon: undefined,
            },
            liver: {
              ...state.appData.checkList.bloodTest.liver,
              icon: undefined,
            },
            glucose: {
              ...state.appData.checkList.bloodTest.glucose,
              icon: undefined,
            },
          },
        },
      },
    };

    const jsonState = JSON.stringify(cleanState);
    
    // Save to AsyncStorage
    await AsyncStorage.setItem('appData', jsonState);
    console.log('✅ Saved to AsyncStorage');

    // Save to Supabase using UPSERT (creates row if doesn't exist)
    const { error } = await supabase
      .from('profiles')
      .upsert(
        { 
          id: user.id,
          email: user.email,
          data: jsonState,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('❌ Supabase save error:', error);
    } else {
      console.log('✅ Saved to Supabase for user:', user.id);
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

    if (error || !data) {
      await saveData(initialState);
      return initialState;
    }

    const dbData = JSON.parse(data.data || '{}');
    await AsyncStorage.setItem('appData', data.data);

    if (data.data && data.data !== '{}') {
      return {
        ...initialState,
        appData: dbData.appData,
        userID: user.id,
        userEmail: user.email,
      };
    } else {
      await saveData(initialState);
      return initialState;
    }
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

  // Dispatch function to handle actions
  const dispatch = async (action: AppAction): Promise<void> => {
    switch (action.type) {
      case 'REFRESH': {
        const data = await loadData();
        setState(data);
        break;
      }

      case 'SET_LANGUAGE': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              settings: {
                ...prevState.appData.settings,
                language: action.payload,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'ADD_CD4': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                cd4: [...prevState.appData.graphData.cd4, action.payload],
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_CD4': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                cd4: action.payload,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'EDIT_CD4': {
        setState((prevState) => {
          const newData = [...prevState.appData.graphData.cd4];
          newData[action.payload.index] = {
            date: action.payload.date,
            value: action.payload.value,
          };
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                cd4: newData,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'DELETE_CD4': {
        setState((prevState) => {
          const newData = prevState.appData.graphData.cd4.filter((_, index) => index !== action.payload);
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                cd4: newData,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'ADD_BLOOD': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                bloodSugar: [...prevState.appData.graphData.bloodSugar, action.payload],
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_BLOOD': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                bloodSugar: action.payload,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'EDIT_BLOOD': {
        setState((prevState) => {
          const newData = [...prevState.appData.graphData.bloodSugar];
          newData[action.payload.index] = {
            date: action.payload.date,
            value: action.payload.value,
          };
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                bloodSugar: newData,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'DELETE_BLOOD': {
        setState((prevState) => {
          const newData = prevState.appData.graphData.bloodSugar.filter((_, index) => index !== action.payload);
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                bloodSugar: newData,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'ADD_RENAL': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                renal: [...prevState.appData.graphData.renal, action.payload],
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_RENAL': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                renal: action.payload,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'EDIT_RENAL': {
        setState((prevState) => {
          const newData = [...prevState.appData.graphData.renal];
          newData[action.payload.index] = {
            date: action.payload.date,
            value: action.payload.value,
          };
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                renal: newData,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'DELETE_RENAL': {
        setState((prevState) => {
          const newData = prevState.appData.graphData.renal.filter((_, index) => index !== action.payload);
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                renal: newData,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'ADD_LIVER': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                liver: [...prevState.appData.graphData.liver, action.payload],
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_LIVER': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                liver: action.payload,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'EDIT_LIVER': {
        setState((prevState) => {
          const newData = [...prevState.appData.graphData.liver];
          newData[action.payload.index] = {
            date: action.payload.date,
            value: action.payload.value,
          };
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                liver: newData,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'DELETE_LIVER': {
        setState((prevState) => {
          const newData = prevState.appData.graphData.liver.filter((_, index) => index !== action.payload);
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                liver: newData,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'ADD_LIPID': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                lipid: [...prevState.appData.graphData.lipid, action.payload],
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_LIPID': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                lipid: action.payload,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'EDIT_LIPID': {
        setState((prevState) => {
          const newData = [...prevState.appData.graphData.lipid];
          newData[action.payload.index] = {
            date: action.payload.date,
            value: action.payload.value,
          };
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                lipid: newData,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'DELETE_LIPID': {
        setState((prevState) => {
          const newData = prevState.appData.graphData.lipid.filter((_, index) => index !== action.payload);
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              graphData: {
                ...prevState.appData.graphData,
                lipid: newData,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_INFLUENZA_VACCINE': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              checkList: {
                ...prevState.appData.checkList,
                vaccine: {
                  ...prevState.appData.checkList.vaccine,
                  influenza: action.payload,
                },
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_PNEUMO_VACCINE': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              checkList: {
                ...prevState.appData.checkList,
                vaccine: {
                  ...prevState.appData.checkList.vaccine,
                  pneumococcal: action.payload,
                },
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_PNEUMO13_VACCINE': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              checkList: {
                ...prevState.appData.checkList,
                vaccine: {
                  ...prevState.appData.checkList.vaccine,
                  pneumo13: action.payload,
                },
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_PNEUMO23_VACCINE': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              checkList: {
                ...prevState.appData.checkList,
                vaccine: {
                  ...prevState.appData.checkList.vaccine,
                  pneumo23: action.payload,
                },
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_HPV_VACCINE': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              checkList: {
                ...prevState.appData.checkList,
                vaccine: {
                  ...prevState.appData.checkList.vaccine,
                  hpv: action.payload,
                },
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_RENAL_TEST': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              checkList: {
                ...prevState.appData.checkList,
                bloodTest: {
                  ...prevState.appData.checkList.bloodTest,
                  renal: action.payload,
                },
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_LIVER_TEST': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              checkList: {
                ...prevState.appData.checkList,
                bloodTest: {
                  ...prevState.appData.checkList.bloodTest,
                  liver: action.payload,
                },
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_GLUCOSE_TEST': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              checkList: {
                ...prevState.appData.checkList,
                bloodTest: {
                  ...prevState.appData.checkList.bloodTest,
                  glucose: action.payload,
                },
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'ADD_APPOINTMENT': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              checkList: {
                ...prevState.appData.checkList,
                appointment: [...prevState.appData.checkList.appointment, action.payload],
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_APPOINTMENT': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              checkList: {
                ...prevState.appData.checkList,
                appointment: action.payload,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'DELETE_APPOINTMENT': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              checkList: {
                ...prevState.appData.checkList,
                appointment: prevState.appData.checkList.appointment.filter((a: any) => a.id !== action.payload),
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'ADD_JOURNAL': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              checkList: {
                ...prevState.appData.checkList,
                journal: [...prevState.appData.checkList.journal, action.payload],
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'MODIFY_JOURNAL': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              checkList: {
                ...prevState.appData.checkList,
                journal: action.payload,
              },
            },
          };
          saveData(newState);
          return newState;
        });
        break;
      }

      case 'DELETE_JOURNAL': {
        setState((prevState) => {
          const newState = {
            ...prevState,
            appData: {
              ...prevState.appData,
              checkList: {
                ...prevState.appData.checkList,
                journal: prevState.appData.checkList.journal.filter((j: any) => j.id !== action.payload),
              },
            },
          };
          saveData(newState);
          return newState;
        });
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
