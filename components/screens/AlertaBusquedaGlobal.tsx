import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../../context/RoleContext';

export default function AlertaBusquedaGlobal() {
  const { alertaBusqueda, setAlertaBusqueda } = useRole();

  if (!alertaBusqueda) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={alertaBusqueda !== null}
      onRequestClose={() => setAlertaBusqueda(null)}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.alertHeader}>
            <View style={styles.warningBadge}>
              <Ionicons name="warning" size={24} color="#EF4444" />
              <Text style={styles.warningBadgeText}>BÚSQUEDA ACTIVA</Text>
            </View>
          </View>

          <Text style={styles.alertTitle}>¡ESTUDIANTE NO LOCALIZADO!</Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.alertMessage}>
              Se ha emitido una alerta de búsqueda para:
              {'\n'}
              <Text style={styles.studentName}>{alertaBusqueda}</Text> (Grupo 9A).
              {'\n\n'}
              Si visualizas al alumno en el punto de encuentro o en las inmediaciones del campus, repórtalo inmediatamente con un brigadista o docente encargado.
            </Text>
          </View>

          <Pressable
            style={styles.closeButton}
            onPress={() => setAlertaBusqueda(null)}
          >
            <Text style={styles.closeButtonText}>CERRAR ALERTA</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: '#EF4444',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  alertHeader: {
    marginBottom: 16,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  warningBadgeText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#B91C1C',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  alertMessage: {
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 18,
    textAlign: 'center',
  },
  studentName: {
    fontWeight: '900',
    fontSize: 15,
    color: '#B91C1C',
  },
  closeButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
