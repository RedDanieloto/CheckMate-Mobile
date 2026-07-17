import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRole, Role } from '../context/RoleContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

interface SidebarOption {
  label: string;
  icon: any;
  onPress: () => void;
}

export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen, role } = useRole();
  const insets = useSafeAreaInsets();

  if (!isSidebarOpen) return null;

  // Obtener opciones según el rol
  const getOptions = (currentRole: Role): SidebarOption[] => {
    switch (currentRole) {
      case 'estudiante':
        return [
          {
            label: 'Historial de Justificaciones',
            icon: 'receipt-outline',
            onPress: () => {
              alert('Historial de Justificaciones presionado');
              setIsSidebarOpen(false);
            },
          },
          {
            label: 'Tus Reclamos',
            icon: 'chatbubble-ellipses-outline',
            onPress: () => {
              alert('Tus Reclamos presionado');
              setIsSidebarOpen(false);
            },
          },
          {
            label: 'Contactos',
            icon: 'people-outline',
            onPress: () => {
              alert('Contactos presionado');
              setIsSidebarOpen(false);
            },
          },
          {
            label: 'Ajustes de la APP',
            icon: 'settings-outline',
            onPress: () => {
              alert('Ajustes presionado');
              setIsSidebarOpen(false);
            },
          },
        ];
      case 'administrador':
        return [
          {
            label: 'Historial de Siniestros',
            icon: 'flame-outline',
            onPress: () => {
              alert('Historial de Siniestros presionado');
              setIsSidebarOpen(false);
            },
          },
          {
            label: 'Protocolos de Seguridad',
            icon: 'shield-checkmark-outline',
            onPress: () => {
              alert('Protocolos de Seguridad presionado');
              setIsSidebarOpen(false);
            },
          },
          {
            label: 'Ajustes de la APP',
            icon: 'settings-outline',
            onPress: () => {
              alert('Ajustes presionado');
              setIsSidebarOpen(false);
            },
          },
        ];
      case 'profesor_tutor':
        return [
          {
            label: 'Reclamos',
            icon: 'alert-circle-outline',
            onPress: () => {
              alert('Reclamos presionado');
              setIsSidebarOpen(false);
            },
          },
          {
            label: 'Tus Grupos',
            icon: 'people-outline',
            onPress: () => {
              alert('Tus Grupos presionado');
              setIsSidebarOpen(false);
            },
          },
          {
            label: 'Protocolos de Seguridad',
            icon: 'shield-checkmark-outline',
            onPress: () => {
              alert('Protocolos de Seguridad presionado');
              setIsSidebarOpen(false);
            },
          },
          {
            label: 'Ajustes de la APP',
            icon: 'settings-outline',
            onPress: () => {
              alert('Ajustes presionado');
              setIsSidebarOpen(false);
            },
          },
          {
            label: 'Tus Grupos Tuteados',
            icon: 'school-outline',
            onPress: () => {
              alert('Tus Grupos Tuteados presionado');
              setIsSidebarOpen(false);
            },
          },
          {
            label: 'Justificantes',
            icon: 'document-text-outline',
            onPress: () => {
              alert('Justificantes presionado');
              setIsSidebarOpen(false);
            },
          },
        ];
      case 'profesor':
        return [
          {
            label: 'Reclamos',
            icon: 'alert-circle-outline',
            onPress: () => {
              alert('Reclamos presionado');
              setIsSidebarOpen(false);
            },
          },
          {
            label: 'Tus Grupos',
            icon: 'people-outline',
            onPress: () => {
              alert('Tus Grupos presionado');
              setIsSidebarOpen(false);
            },
          },
          {
            label: 'Protocolos de Seguridad',
            icon: 'shield-checkmark-outline',
            onPress: () => {
              alert('Protocolos de Seguridad presionado');
              setIsSidebarOpen(false);
            },
          },
          {
            label: 'Ajustes de la APP',
            icon: 'settings-outline',
            onPress: () => {
              alert('Ajustes presionado');
              setIsSidebarOpen(false);
            },
          },
        ];
      default:
        return [];
    }
  };

  const options = getOptions(role);

  return (
    <View style={styles.overlayContainer}>
      {/* Backdrop presionable para cerrar el menú */}
      <Pressable
        style={styles.backdrop}
        onPress={() => setIsSidebarOpen(false)}
      />

      {/* Panel del Menú Lateral */}
      <View style={[styles.sidebarPanel, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        {/* Sección Logo superior */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoTextCM}>CM</Text>
          </View>
          <Text style={styles.logoTitle}>CHECK MATE</Text>
          <View style={styles.logoDivider} />
        </View>

        {/* Listado de Opciones */}
        <View style={styles.optionsList}>
          {options.map((option, index) => (
            <Pressable
              key={`${option.label}-${index}`}
              style={styles.optionRow}
              onPress={option.onPress}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name={option.icon} size={28} color="#000000" />
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Versión al pie del menú */}
        <Text style={styles.versionText}>CHECKMATE v0.1</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 10000, // Por encima de todo, incluido el selector global
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sidebarPanel: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: '#FAF9F9',
    borderTopLeftRadius: 36,
    borderBottomLeftRadius: 36,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  logoSection: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logoTextCM: {
    fontSize: 36,
    fontWeight: '900',
    color: '#000000',
    fontStyle: 'italic',
    letterSpacing: -2,
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 12,
    letterSpacing: 1.5,
  },
  logoDivider: {
    width: '80%',
    height: 1,
    backgroundColor: '#E0E1E6',
    marginTop: 12,
  },
  optionsList: {
    flex: 1,
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(224, 225, 230, 0.3)',
  },
  iconWrapper: {
    width: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
    flex: 1,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B0B4BA',
    opacity: 0.7,
    letterSpacing: 0.5,
    marginBottom: Platform.OS === 'ios' ? 10 : 0,
  },
});
