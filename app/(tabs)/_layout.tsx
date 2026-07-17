import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
}

const TabIcon = ({ name, focused, color }: TabIconProps) => {
  return (
    <View style={styles.iconWrapper}>
      {focused && <View style={styles.activeIndicator} />}
      <Ionicons name={name} size={24} color={color} />
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#8e8e93',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#E0E1E6',
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name={focused ? 'calendar' : 'calendar-outline'}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name={focused ? 'home' : 'home-outline'}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name={focused ? 'person' : 'person-outline'}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  activeIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? -8 : -8,
    height: 4,
    width: 60,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
});
