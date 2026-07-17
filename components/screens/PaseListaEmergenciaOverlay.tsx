import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRole, EstudianteEmergencia } from '../../context/RoleContext';

export default function PaseListaEmergenciaOverlay() {
  const {
    isEmergenciaActiva,
    role,
    estudiantesEmergencia,
    marcarEstudianteASalvo,
    marcarEstudianteEnBusqueda,
    setAlertaBusqueda,
    finalizarEmergencia,
  } = useRole();
  const insets = useSafeAreaInsets();

  const [selectedStudent, setSelectedStudent] = useState<EstudianteEmergencia | null>(null);

  // Si no está la emergencia activa o no es docente/admin, no se muestra
  if (!isEmergenciaActiva || role === 'estudiante') return null;

  const presentesCount = estudiantesEmergencia.filter(e => e.estado === 'a_salvo').length;
  const totalCount = estudiantesEmergencia.length;

  const handleMarcarManualASalvo = (student: EstudianteEmergencia) => {
    marcarEstudianteASalvo(student.id);
    setSelectedStudent(null);
    Alert.alert('Estatus Actualizado', `Se ha marcado a ${student.nombre} como "A Salvo" de forma manual.`);
  };

  const handleEmitirAlertaBusqueda = (student: EstudianteEmergencia) => {
    marcarEstudianteEnBusqueda(student.id);
    setAlertaBusqueda(student.nombre);
    setSelectedStudent(null);
    Alert.alert('Alerta Emitida', `Se ha difundido una alerta general de búsqueda para ${student.nombre}.`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Cabecera superior */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pase de Lista - 9A</Text>
        <Text style={styles.headerSubtitle}>PROTOCOLOS DE SEGURIDAD ACTIVOS</Text>
      </View>

      {/* Info General */}
      <View style={styles.summaryRow}>
        <View>
          <Text style={styles.summaryLabel}>Grupo Asignado: 9A</Text>
          <Text style={styles.summaryDate}>24 de Mayo, 2026</Text>
        </View>
        <View style={styles.badgePresentes}>
          <Text style={styles.badgeValue}>
            {presentesCount} / {totalCount}
          </Text>
          <Text style={styles.badgeLabel}>Presentes</Text>
        </View>
      </View>

      {/* Tabla de Alumnos */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderLeft}>Estudiante / Matrícula</Text>
        <Text style={styles.tableHeaderRight}>Estado</Text>
      </View>

      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {estudiantesEmergencia.map((student) => (
          <Pressable
            key={student.id}
            style={styles.studentRow}
            onPress={() => student.estado !== 'a_salvo' && setSelectedStudent(student)}
          >
            <View style={styles.studentInfoCol}>
              {/* Avatar circular */}
              <View style={styles.avatarContainer}>
                {student.estado === 'en_busqueda' && (
                  <View style={styles.alertDot}>
                    <Ionicons name="warning" size={10} color="#ffffff" />
                  </View>
                )}
                <Ionicons
                  name="person"
                  size={20}
                  color={student.estado === 'en_busqueda' ? '#EF4444' : '#9CA3AF'}
                />
              </View>
              <View>
                <Text style={styles.studentName}>{student.nombre}</Text>
                <Text style={styles.studentMatricula}>{student.matricula}</Text>
              </View>
            </View>

            {/* Check o Círculo vacío */}
            <View>
              {student.estado === 'a_salvo' ? (
                <View style={styles.checkActive}>
                  <Ionicons name="checkmark" size={16} color="#ffffff" />
                </View>
              ) : student.estado === 'en_busqueda' ? (
                <View style={[styles.checkInactive, styles.checkEnBusqueda]}>
                  <Ionicons name="warning-outline" size={16} color="#EF4444" />
                </View>
              ) : (
                <View style={styles.checkPending} />
              )}
            </View>
          </Pressable>
        ))}

        {/* Botón de Finalizar Simulacro/Emergencia */}
        <Pressable
          style={styles.btnFinalizar}
          onPress={() => {
            Alert.alert(
              'Finalizar Emergencia',
              '¿Deseas dar por terminada la emergencia activa y restaurar la aplicación a su estado normal?',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Finalizar',
                  onPress: () => {
                    finalizarEmergencia();
                    Alert.alert('Simulacro Finalizado', 'Los estados escolares han sido restaurados.');
                  },
                },
              ]
            );
          }}
        >
          <Ionicons name="shield-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.btnFinalizarText}>FINALIZAR EMERGENCIA</Text>
        </Pressable>
      </ScrollView>

      {/* MODAL DETALLES DEL ALUMNO PENDIENTE / AUSENTE */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedStudent !== null}
        onRequestClose={() => setSelectedStudent(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Cabecera del modal */}
            <View style={styles.modalHeaderClose}>
              <View style={styles.tagGrupo}>
                <Text style={styles.tagGrupoText}>GRUPO 9A</Text>
              </View>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setSelectedStudent(null)}
              >
                <Ionicons name="close" size={24} color="#000000" />
              </Pressable>
            </View>

            {/* Avatar grande */}
            <View style={styles.largeAvatarContainer}>
              <View style={styles.largeAvatarCircle}>
                <Ionicons name="person" size={56} color="#4B5563" />
                <View style={styles.largeAvatarAlertDot}>
                  <Ionicons name="alert-sharp" size={16} color="#ffffff" />
                </View>
              </View>
              <Text style={styles.modalStudentName}>{selectedStudent?.nombre}</Text>
              <Text style={styles.modalStudentSub}>ID Estudiante: #{selectedStudent?.matricula}</Text>
            </View>

            {/* Caja de Ausencia Detectada */}
            <View style={styles.ausenciaBox}>
              <View style={styles.ausenciaIconWrapper}>
                <Ionicons name="alert-circle" size={22} color="#EF4444" />
              </View>
              <View style={styles.ausenciaTextWrapper}>
                <Text style={styles.ausenciaTitle}>Ausencia Detectada</Text>
                <Text style={styles.ausenciaDesc}>
                  Este alumno no se ha reportado en la reagrupación del incidente actual.
                </Text>
              </View>
            </View>

            {/* Fila de Tiempos y Zonas */}
            <View style={styles.metaRow}>
              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>Hora Última Vez</Text>
                <Text style={styles.metaValue}>{selectedStudent?.horaUltimaVez}</Text>
              </View>
              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>Zona de Registro</Text>
                <Text style={styles.metaValue}>{selectedStudent?.zonaRegistro}</Text>
              </View>
            </View>

            {/* Caja de Estado del Protocolo */}
            <View style={styles.statusProtocolBox}>
              <Text style={styles.statusProtocolLabel}>Estado de Protocolo</Text>
              <View style={styles.statusProtocolValueRow}>
                <View style={styles.statusProtocolIndicatorRow}>
                  <View style={styles.redDot} />
                  <Text style={styles.statusProtocolValue}>
                    {selectedStudent?.estado === 'en_busqueda' ? 'En Búsqueda' : 'Pendiente'}
                  </Text>
                </View>
                <Ionicons name="information-circle-outline" size={20} color="#9CA3AF" />
              </View>
            </View>

            {/* Botones de acción */}
            <View style={styles.modalActionsRow}>
              {/* Botón Emitir Alerta */}
              <Pressable
                style={styles.btnEmitirAlerta}
                onPress={() => selectedStudent && handleEmitirAlertaBusqueda(selectedStudent)}
              >
                <Ionicons name="radio-outline" size={22} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.btnEmitirAlertaText}>Emitir Alerta</Text>
              </Pressable>

              {/* Botón Marcar A Salvo Manualmente */}
              <Pressable
                style={styles.btnMarcarASalvo}
                onPress={() => selectedStudent && handleMarcarManualASalvo(selectedStudent)}
              >
                <Ionicons name="checkmark-circle-outline" size={22} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.btnMarcarASalvoText}>Marcar Presente</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    zIndex: 9990, // Por debajo del disclaimer pero arriba de tabs
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? 88 : 68,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111E38',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 20,
  },
  summaryLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111E38',
  },
  summaryDate: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  badgePresentes: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111E38',
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableHeaderLeft: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  tableHeaderRight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 40,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  studentInfoCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  alertDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111E38',
  },
  studentMatricula: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  checkActive: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkPending: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#9CA3AF',
  },
  checkInactive: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkEnBusqueda: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  btnFinalizar: {
    height: 48,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  btnFinalizarText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeaderClose: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tagGrupo: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagGrupoText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeAvatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  largeAvatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  largeAvatarAlertDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#EF4444',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  modalStudentName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111E38',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalStudentSub: {
    fontSize: 13,
    color: '#6B7280',
  },
  ausenciaBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    marginBottom: 16,
  },
  ausenciaIconWrapper: {
    marginRight: 10,
    marginTop: 2,
  },
  ausenciaTextWrapper: {
    flex: 1,
  },
  ausenciaTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#B91C1C',
    marginBottom: 4,
  },
  ausenciaDesc: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111E38',
  },
  statusProtocolBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  statusProtocolLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  statusProtocolValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusProtocolIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  statusProtocolValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111E38',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnEmitirAlerta: {
    flex: 1.1,
    height: 48,
    backgroundColor: '#000000',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  btnEmitirAlertaText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  btnMarcarASalvo: {
    flex: 1.2,
    height: 48,
    backgroundColor: '#10B981',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  btnMarcarASalvoText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
