import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRole } from '../../context/RoleContext';

export default function SettingsScreen() {
  const { showSettings, setShowSettings } = useRole();
  const insets = useSafeAreaInsets();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  // Verificar el estado de los permisos reales al abrir los ajustes
  useEffect(() => {
    if (showSettings) {
      checkPermissions();
    }
  }, [showSettings]);

  const checkPermissions = async () => {
    try {
      // 1. Notificaciones
      const notificationSettings = await Notifications.getPermissionsAsync();
      setNotificationsEnabled(
        notificationSettings.granted ||
        notificationSettings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
        notificationSettings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED
      );

      // 2. Ubicación
      const locationSettings = await Location.getForegroundPermissionsAsync();
      setLocationEnabled(locationSettings.granted);
    } catch (error) {
      console.warn('Error chequeando permisos:', error);
    }
  };

  const handleNotificationsChange = async (value: boolean) => {
    if (value) {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          setNotificationsEnabled(true);
        } else {
          setNotificationsEnabled(false);
          Alert.alert(
            'Permiso Denegado',
            'No se pudieron activar las notificaciones. Por favor, actívalas en la configuración de tu dispositivo.'
          );
        }
      } catch (error) {
        console.warn('Error solicitando permisos de notificaciones:', error);
        setNotificationsEnabled(false);
      }
    } else {
      // Desactivación lógica local
      setNotificationsEnabled(false);
    }
  };

  const handleLocationChange = async (value: boolean) => {
    if (value) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setLocationEnabled(true);
        } else {
          setLocationEnabled(false);
          Alert.alert(
            'Permiso Denegado',
            'No se pudo acceder a la ubicación. Por favor, actívala en la configuración de tu dispositivo.'
          );
        }
      } catch (error) {
        console.warn('Error solicitando permisos de ubicación:', error);
        setLocationEnabled(false);
      }
    } else {
      setLocationEnabled(false);
    }
  };

  if (!showSettings) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header superior */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => setShowSettings(false)}
        >
          <Ionicons name="arrow-back-outline" size={32} color="#111E38" />
        </Pressable>
        <Text style={styles.headerTitle}>AJUSTES DE LA APP</Text>
      </View>
      <View style={styles.divider} />

      {/* Listado de configuraciones */}
      <View style={styles.settingsContent}>
        {/* Opción Notificaciones */}
        <View style={styles.settingRow}>
          <View style={styles.leftGroup}>
            <Ionicons name="notifications-sharp" size={30} color="#111E38" style={styles.optionIcon} />
            <Text style={styles.optionText}>NOTIFICACIONES</Text>
          </View>
          <Switch
            trackColor={{ false: '#D1D5DB', true: '#000000' }}
            thumbColor="#ffffff"
            ios_backgroundColor="#D1D5DB"
            onValueChange={handleNotificationsChange}
            value={notificationsEnabled}
          />
        </View>

        {/* Opción Permitir Ubicación */}
        <View style={styles.settingRow}>
          <View style={styles.leftGroup}>
            <Ionicons name="location-sharp" size={30} color="#111E38" style={styles.optionIcon} />
            <Text style={styles.optionText}>Permitir Ubicación</Text>
          </View>
          <Switch
            trackColor={{ false: '#D1D5DB', true: '#000000' }}
            thumbColor="#ffffff"
            ios_backgroundColor="#D1D5DB"
            onValueChange={handleLocationChange}
            value={locationEnabled}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? 88 : 68, // Deja libre la barra de pestañas (Bottom TabBar)
    backgroundColor: '#ffffff',
    zIndex: 999, // Se dibuja justo por debajo del Sidebar (10000) pero encima del stack
  },
  header: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 10,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111E38',
    marginLeft: 16,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '90%',
    alignSelf: 'center',
    marginTop: 8,
  },
  settingsContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 18,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
});
