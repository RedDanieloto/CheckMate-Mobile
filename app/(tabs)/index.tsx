import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRole } from '@/context/RoleContext';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { role } = useRole();

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
          <Text style={styles.dotsText}>...</Text>
          <Pressable style={styles.credencialButton} onPress={() => alert('Credencial presionado')}>
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
    bottom: Platform.OS === 'ios' ? 170 : 150, // Posicionado encima del selector global flotante
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dotsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7A22FF',
    lineHeight: 18,
    marginBottom: 4,
    letterSpacing: 2,
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
});
