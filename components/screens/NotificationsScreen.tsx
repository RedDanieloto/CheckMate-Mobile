import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRole } from '../../context/RoleContext';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: any;
  iconBg: string;
}

export default function NotificationsScreen() {
  const { showNotifications, setShowNotifications } = useRole();
  const insets = useSafeAreaInsets();

  if (!showNotifications) return null;

  const mockNotifications: NotificationItem[] = [
    {
      id: '1',
      title: 'Justificación Aprobada',
      description: 'Tu justificante del día 15 de Julio ha sido aprobado con éxito por el departamento de Coordinación Académica.',
      time: 'Hace 5 min',
      icon: 'checkmark-circle-outline',
      iconBg: '#E8F5E9',
    },
    {
      id: '2',
      title: 'Registro de Asistencia',
      description: 'Entrada registrada correctamente en el lector del acceso principal norte a las 07:02 AM.',
      time: 'Hace 4 horas',
      icon: 'time-outline',
      iconBg: '#E3F2FD',
    },
    {
      id: '3',
      title: 'Alerta de Inasistencia',
      description: 'Se ha registrado una falta en la clase de Programación Móvil. Recuerda justificar antes de las 48 horas.',
      time: 'Ayer',
      icon: 'alert-circle-outline',
      iconBg: '#FFEBEE',
    },
    {
      id: '4',
      title: 'Protocolo de Seguridad',
      description: 'Se ha publicado la actualización semestral sobre los puntos de reunión y evacuación en caso de sismo.',
      time: 'Hace 2 días',
      icon: 'shield-checkmark-outline',
      iconBg: '#EDE7F6',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header superior */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => setShowNotifications(false)}
        >
          <Ionicons name="arrow-back-outline" size={32} color="#111E38" />
        </Pressable>
        <Text style={styles.headerTitle}>NOTIFICACIONES</Text>
      </View>
      <View style={styles.divider} />

      {/* Listado de Notificaciones */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {mockNotifications.map((item) => (
          <View key={item.id} style={styles.notificationCard}>
            <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.icon} size={26} color="#111E38" />
            </View>
            <View style={styles.textContainer}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardTime}>{item.time}</Text>
              </View>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
    zIndex: 999, // Mismo nivel de la pantalla de ajustes
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
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FAF9F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E1E6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111E38',
    flex: 1,
    marginRight: 8,
  },
  cardTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
  },
  cardDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});
