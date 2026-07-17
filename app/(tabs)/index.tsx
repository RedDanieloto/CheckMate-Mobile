import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRole } from '@/context/RoleContext';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { role, setIsSidebarOpen, setShowNotifications } = useRole();
  const [showCredencial, setShowCredencial] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'qr'>('card');

  // Si está en modo de ver credencial (y es estudiante, profesor o tutor)
  if (showCredencial && (role === 'estudiante' || role === 'profesor' || role === 'profesor_tutor')) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerWithBack, { paddingTop: insets.top }]}>
          <Pressable style={styles.menuButtonLeft} onPress={() => { setShowCredencial(false); setViewMode('card'); }}>
            <Ionicons name="arrow-back-outline" size={32} color="#000000" />
          </Pressable>
          <Pressable style={styles.menuButton} onPress={() => setIsSidebarOpen(true)}>
            <Ionicons name="menu-outline" size={36} color="#000000" />
          </Pressable>
        </View>

        {/* Diseñó de la Tarjeta Credencial / Código QR */}
        <View style={styles.credencialContent}>
          <Ionicons name={viewMode === 'card' ? 'card' : 'qr-code'} size={180} color="#000000" />
          <Text style={styles.studentName}>WALTER BROWN</Text>
          <Text style={styles.studentGroup}>1° "A"</Text>
        </View>

        {/* Botón flotante para alternar entre credencial y código QR */}
        <View style={styles.qrContainer}>
          <Pressable style={styles.qrButton} onPress={() => setViewMode(viewMode === 'card' ? 'qr' : 'card')}>
            <Ionicons name={viewMode === 'card' ? 'qr-code-outline' : 'card-outline'} size={36} color="#000000" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con notificaciones a la izquierda y hamburguesa a la derecha */}
      <View style={[styles.headerWithNotifications, { paddingTop: insets.top }]}>
        <Pressable style={styles.notificationButton} onPress={() => setShowNotifications(true)}>
          <Ionicons name="notifications-outline" size={32} color="#000000" />
        </Pressable>
        <Pressable style={styles.menuButton} onPress={() => setIsSidebarOpen(true)}>
          <Ionicons name="menu-outline" size={36} color="#000000" />
        </Pressable>
      </View>

      {/* Contenido Principal Centrado */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Bienvenido a{'\n'}CheckMate
        </Text>
      </View>

      {/* Botón flotante para credencial de alumno (Estudiante, Profesor y Tutor) */}
      {(role === 'estudiante' || role === 'profesor' || role === 'profesor_tutor') && (
        <View style={styles.credencialContainer}>
          <Pressable style={styles.credencialButton} onPress={() => setShowCredencial(true)}>
            <Ionicons name="card-outline" size={36} color="#000000" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    height: 100,
    alignItems: 'center',
  },
  headerWithBack: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 100,
    alignItems: 'center',
  },
  headerWithNotifications: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 100,
    alignItems: 'center',
  },
  menuButtonLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
  notificationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: -80,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 42,
  },
  credencialContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 150,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  credencialButton: {
    borderRadius: 35,
    width: 70,
    height: 70,
    backgroundColor: '#00BCFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  credencialContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: -100,
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 20,
    textAlign: 'center',
  },
  studentGroup: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
  },
  qrContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 150,
    alignSelf: 'center',
    zIndex: 1000,
  },
  qrButton: {
    borderRadius: 35,
    width: 70,
    height: 70,
    backgroundColor: '#00BCFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
});
