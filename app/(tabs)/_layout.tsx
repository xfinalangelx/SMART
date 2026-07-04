import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { SmartColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '@/contexts/AppDataContext';

export default function TabLayout() {
  const { state } = useAppData();
  const bm = state?.appData?.settings?.language !== 'en';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarInactiveTintColor: '#9BA1A6',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: bm ? 'Pembelajaran' : 'Learn',
          tabBarActiveTintColor: SmartColors.learn,
          tabBarIcon: ({ color }) => <Ionicons name="school" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: bm ? 'Pengurusan' : 'Manage',
          tabBarActiveTintColor: SmartColors.manage,
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: bm ? 'Pemantauan' : 'Track',
          tabBarActiveTintColor: SmartColors.track,
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="connect"
        options={{
          title: bm ? 'Sokongan' : 'Connect',
          tabBarActiveTintColor: SmartColors.connect,
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: bm ? 'Tetapan' : 'Settings',
          href: null, // Reached via the gear icon in each module header
        }}
      />
    </Tabs>
  );
}
