import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { useRole, Role } from '../context/RoleContext';

export default function GlobalRoleSelector() {
  const { role: currentRole, setRole } = useRole();

  const roles: { id: Role; label: string }[] = [
    { id: 'estudiante', label: 'Estudiante' },
    { id: 'administrador', label: 'Admin' },
    { id: 'profesor_tutor', label: 'Tutor' },
    { id: 'profesor', label: 'Profesor' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.selectorBar}>
        {roles.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.tab,
              currentRole === item.id && styles.tabActive,
            ]}
            onPress={() => setRole(item.id)}
          >
            <Text
              style={[
                styles.tabText,
                currentRole === item.id && styles.tabTextActive,
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 96 : 76, // Posicionado dinámicamente sobre la barra de navegación
    left: 20,
    right: 20,
    zIndex: 9999, // Asegura que quede por encima de todo
  },
  selectorBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    padding: 4,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E1E6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#000000',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8e8e93',
  },
  tabTextActive: {
    color: '#ffffff',
  },
});
