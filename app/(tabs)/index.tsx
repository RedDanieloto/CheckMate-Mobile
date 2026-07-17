import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRole } from '@/context/RoleContext';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { role } = useRole();
  const [showCredencial, setShowCredencial] = useState(false);

  // Si está en modo de ver credencial (y es estudiante)
  if (showCredencial && role === 'estudiante') {
    return (
      <View style={styles.container}>
        {/* Header de Credencial con botón atrás y menú */}
        <View style={[styles.headerWithBack, { paddingTop: insets.top }]}>
          <Pressable style={styles.menuButtonLeft} onPress={() => setShowCredencial(false)}>
            <Ionicons name="arrow-back-outline" size={32} color="#000000" />
          </Pressable>
          <Pressable style={styles.menuButton} onPress={() => alert('Menú presionado')}>
            <Ionicons name="menu-outline" size={36} color="#000000" />
          </Pressable>
        </View>

        {/* Diseñó de la Tarjeta Credencial */}
        <View style={styles.credencialContent}>
          <Ionicons name="card" size={180} color="#000000" />
          <Text style={styles.studentName}>WALTER BROWN</Text>
          <Text style={styles.studentGroup}>1° "A"</Text>
        </View>

        {/* Botón flotante para código QR (template) */}
        <View style={styles.qrContainer}>
          <Pressable style={styles.qrButton} onPress={() => alert('Código QR presionado')}>
            <Ionicons name="qr-code-outline" size={36} color="#000000" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con botón de menú hamburguesa */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable style={styles.menuButton} onPress={() => alert('Menú presionado')}>
          <Ionicons name="menu-outline" size={36} color="#000000" />
        </Pressable>
      </View>

      {/* Contenido Principal Centrado */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Bienvenido a{'\n'}CheckMate
        </Text>
      </View>

      {/* Botón flotante para credencial de alumno (Solo rol estudiante) */}
      {role === 'estudiante' && (
        <View style={styles.credencialContainer}>
          <Pressable style={styles.credencialButton} onPress={() => setShowCredencial(true)}>
            <Ionicons name="id-card-outline" size={36} color="#000000" />
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
