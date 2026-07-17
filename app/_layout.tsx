import { useState } from 'react';
import { View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import LoginScreen from '@/components/screens/LoginScreen';
import { RoleProvider } from '@/context/RoleContext';
import GlobalRoleSelector from '@/components/GlobalRoleSelector';
import Sidebar from '@/components/Sidebar';
import SettingsScreen from '@/components/screens/SettingsScreen';
import NotificationsScreen from '@/components/screens/NotificationsScreen';
import JustificantesScreen from '@/components/screens/JustificantesScreen';
import ReclamosScreen from '@/components/screens/ReclamosScreen';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RoleProvider>
        {!isAuthenticated ? (
          <LoginScreen onLogin={() => setIsAuthenticated(true)} />
        ) : (
          <View style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <GlobalRoleSelector />
            <Sidebar />
            <SettingsScreen />
            <NotificationsScreen />
            <JustificantesScreen />
            <ReclamosScreen />
          </View>
        )}
        <StatusBar style="auto" />
      </RoleProvider>
    </ThemeProvider>
  );
}
