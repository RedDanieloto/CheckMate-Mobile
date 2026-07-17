import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRole } from '../../context/RoleContext';

export default function EmergenciaEstudianteOverlay() {
  const { isEmergenciaActiva, nombreProtocoloActivo, marcarEstudianteASalvo, role } = useRole();
  const insets = useSafeAreaInsets();

  // Si no está la emergencia activa o no es estudiante, no se muestra
  if (!isEmergenciaActiva || role !== 'estudiante') return null;

  const handleReportarASalvo = () => {
    // Marcamos al estudiante logueado (Diego Maradona, ID '6') como a salvo
    marcarEstudianteASalvo('6');
    Alert.alert(
      'Estado Reportado',
      'Has reportado tu estado como "A SALVO". Mantén la calma y sigue las instrucciones de los brigadistas.',
      [{ text: 'ENTENDIDO' }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Icono de Peligro Animado / Gigante */}
        <View style={styles.alertIconWrapper}>
          <Ionicons name="alert-circle" size={80} color="#EF4444" />
        </View>

        {/* Textos Informativos */}
        <Text style={styles.alertTitle}>¡PROTOCOLO DE EMERGENCIA ACTIVO!</Text>
        <View style={styles.protocolBadge}>
          <Ionicons name="flame-outline" size={20} color="#EF4444" style={{ marginRight: 6 }} />
          <Text style={styles.protocolBadgeText}>{nombreProtocoloActivo || 'EMERGENCIA GENERAL'}</Text>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionHeading}>INSTRUCCIONES DE SEGURIDAD:</Text>
          <Text style={styles.instructionText}>
            1. Mantén la calma y dirígete al punto de reunión o zona segura más cercana de forma ordenada.
            {'\n\n'}
            2. Reporta tu estado presionando el botón inferior para que tus profesores y coordinadores sepan que estás a salvo.
            {'\n\n'}
            3. Si requieres ayuda médica urgente o visualizas a alguien herido, repórtalo con los brigadistas en el punto de encuentro.
          </Text>
        </View>

        {/* Botón Gigante */}
        <Pressable
          style={styles.btnASalvo}
          onPress={handleReportarASalvo}
        >
          <Ionicons name="checkmark-circle-outline" size={28} color="#ffffff" style={{ marginRight: 10 }} />
          <Text style={styles.btnASalvoText}>REPORTARME A SALVO</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    zIndex: 9999, // Cubre toda la aplicación
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#B91C1C',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  protocolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 28,
  },
  protocolBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  instructionsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 40,
  },
  instructionHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111E38',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  instructionText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  btnASalvo: {
    width: '100%',
    height: 60,
    backgroundColor: '#000000',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  btnASalvoText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
