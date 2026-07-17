import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

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
    // Ajuste para compensar el offset del header y el bottom bar en el centrado
    marginTop: -80,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 42,
  },
  bottomLabel: {
    position: 'absolute',
    bottom: 8,
    left: 16,
    fontSize: 12,
    color: '#B0B4BA',
    opacity: 0.5,
  },
});
