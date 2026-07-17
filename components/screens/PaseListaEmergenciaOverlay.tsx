import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Modal,
  Alert,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRole, EstudianteEmergencia } from '../../context/RoleContext';

interface GrupoAdmin {
  id: string;
  nombre: string;
  carrera: string;
  division: string;
  estado: 'salvo' | 'alerta';
}

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
  
  // Estado local para la navegación del administrador durante la emergencia
  const [adminViewState, setAdminViewState] = useState<'grupos' | 'detalle_grupo' | 'desactivar_protocolo'>('grupos');
  const [selectedGrupoNombre, setSelectedGrupoNombre] = useState<string>('9A');

  // Animación del slider de desactivación
  const pan = useRef(new Animated.ValueXY()).current;
  const sliderWidth = 280;
  const buttonSize = 56;
  const maxDrag = sliderWidth - buttonSize - 12; // Margen de drag máximo

  // Responder de arrastre para desactivar el protocolo
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        // Permitir arrastrar solo en el eje X y dentro de los límites
        if (gestureState.dx >= 0 && gestureState.dx <= maxDrag) {
          pan.x.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        // Si superó el 75% del recorrido, desactivamos el protocolo
        if (gestureState.dx >= maxDrag * 0.75) {
          Animated.timing(pan.x, {
            toValue: maxDrag,
            duration: 100,
            useNativeDriver: false,
          }).start(() => {
            Alert.alert(
              'Protocolo Desactivado',
              'El estado de emergencia escolar ha sido controlado y desactivado por el administrador. La aplicación volverá a la normalidad.',
              [
                {
                  text: 'ENTENDIDO',
                  onPress: () => {
                    finalizarEmergencia();
                    setAdminViewState('grupos');
                    pan.x.setValue(0);
                  },
                },
              ]
            );
          });
        } else {
          // Regresar a la posición inicial
          Animated.spring(pan.x, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Si no está la emergencia activa o no es docente/admin, no se muestra
  if (!isEmergenciaActiva || role === 'estudiante') return null;

  const presentesCount = estudiantesEmergencia.filter(e => e.estado === 'a_salvo').length;
  const totalCount = estudiantesEmergencia.length;

  // Grupos mock para la vista de administrador
  const gruposAdmin: GrupoAdmin[] = [
    {
      id: '1',
      nombre: '9no "A"',
      carrera: 'Tecnologías de la información',
      division: 'Desarrollo Multiplataforma de Software',
      estado: 'salvo',
    },
    {
      id: '2',
      nombre: '9no "B"',
      carrera: 'Tecnologías de la información',
      division: 'Desarrollo Multiplataforma de Software',
      estado: 'salvo',
    },
    {
      id: '3',
      nombre: '6to "A"',
      carrera: 'Tecnologías de la información',
      division: 'Desarrollo Multiplataforma de Software',
      estado: 'alerta',
    },
  ];

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

  const handleSelectGrupoAdmin = (grupo: GrupoAdmin) => {
    setSelectedGrupoNombre(grupo.nombre);
    setAdminViewState('detalle_grupo');
  };

  const handleBackAdminView = () => {
    if (adminViewState === 'detalle_grupo' || adminViewState === 'desactivar_protocolo') {
      setAdminViewState('grupos');
    }
  };

  // ==========================================
  // RENDER ROL ADMINISTRADOR
  // ==========================================
  if (role === 'administrador') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Cabecera */}
        <View style={styles.header}>
          {(adminViewState === 'detalle_grupo' || adminViewState === 'desactivar_protocolo') && (
            <Pressable style={styles.backButtonAdmin} onPress={handleBackAdminView}>
              <Ionicons name="chevron-back" size={24} color="#111E38" />
            </Pressable>
          )}
          <Text style={styles.headerTitle}>
            {adminViewState === 'desactivar_protocolo' ? 'Protocolos de Seguridad' : 'Reporte de grupos'}
          </Text>
          {adminViewState !== 'desactivar_protocolo' && (
            <Text style={styles.headerSubtitleAdmin}>Gestión y estado actual de los grupos asignados.</Text>
          )}
        </View>

        {adminViewState === 'grupos' && (
          <>
            {/* Listado de Grupos */}
            <ScrollView
              style={styles.listContainer}
              contentContainerStyle={styles.scrollContentAdmin}
              showsVerticalScrollIndicator={false}
            >
              {gruposAdmin.map((item) => (
                <Pressable
                  key={item.id}
                  style={[
                    styles.cardAdmin,
                    item.estado === 'alerta' && styles.cardAdminAlerta,
                  ]}
                  onPress={() => handleSelectGrupoAdmin(item)}
                >
                  <View style={styles.cardLeftAdmin}>
                    <View style={styles.iconContainerAdmin}>
                      <Ionicons name="people" size={22} color="#000000" />
                    </View>
                    <View style={styles.cardInfoAdmin}>
                      <Text style={styles.cardTitleAdmin}>{item.nombre}</Text>
                      <Text style={styles.cardDescAdmin}>{item.carrera}</Text>
                      <Text style={styles.cardSubDescAdmin}>{item.division}</Text>
                    </View>
                  </View>
                  <View style={styles.statusColAdmin}>
                    {item.estado === 'salvo' ? (
                      <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    ) : (
                      <Ionicons name="warning" size={24} color="#EF4444" />
                    )}
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            {/* Dos bloques de estado abajo */}
            <View style={styles.statsRowAdmin}>
              <View style={styles.statBoxAdminGray}>
                <Ionicons name="clipboard-outline" size={20} color="#111E38" style={{ marginBottom: 8 }} />
                <Text style={styles.statBoxLabelAdmin}>PENDIENTES</Text>
                <Text style={styles.statBoxValueAdmin}>12</Text>
              </View>
              <View style={styles.statBoxAdminBlack}>
                <Ionicons name="people-outline" size={20} color="#ffffff" style={{ marginBottom: 8 }} />
                <Text style={[styles.statBoxLabelAdmin, { color: '#9CA3AF' }]}>TOTAL GRUPOS</Text>
                <Text style={[styles.statBoxValueAdmin, { color: '#ffffff' }]}>24</Text>
              </View>
            </View>

            {/* Botón flotante para ir a desactivar */}
            <Pressable
              style={styles.btnIrDesactivar}
              onPress={() => setAdminViewState('desactivar_protocolo')}
            >
              <Ionicons name="shield-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.btnIrDesactivarText}>DESACTIVAR PROTOCOLO</Text>
            </Pressable>
          </>
        )}

        {adminViewState === 'detalle_grupo' && (
          <>
            {/* Pase de Lista del Grupo para el Admin */}
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>Grupo Asignado: {selectedGrupoNombre}</Text>
                <Text style={styles.summaryDate}>24 de Mayo, 2026</Text>
              </View>
              <View style={styles.badgePresentes}>
                <Text style={styles.badgeValue}>
                  {presentesCount} / {totalCount}
                </Text>
                <Text style={styles.badgeLabel}>Presentes</Text>
              </View>
            </View>

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
            </ScrollView>
          </>
        )}

        {adminViewState === 'desactivar_protocolo' && (
          <View style={styles.desactivarContainer}>
            <Text style={styles.desactivarTitle}>Desactivar{'\n'}protocolo</Text>
            <Text style={styles.desactivarSubtitle}>Confirma que se tiene bajo control el riesgo</Text>

            {/* Deslizador PanResponder */}
            <View style={styles.sliderContainer}>
              <View style={[styles.sliderTrack, { width: sliderWidth }]}>
                <Text style={styles.sliderText}>Desliza para desactivar</Text>
                
                <Animated.View
                  style={[
                    styles.sliderButton,
                    {
                      transform: [{ translateX: pan.x }],
                    },
                  ]}
                  {...panResponder.panHandlers}
                >
                  <Ionicons name="chevron-forward" size={24} color="#ffffff" />
                </Animated.View>
              </View>
            </View>
          </View>
        )}

        {/* MODAL DETALLES DEL ALUMNO PENDIENTE */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedStudent !== null}
          onRequestClose={() => setSelectedStudent(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeaderClose}>
                <View style={styles.tagGrupo}>
                  <Text style={styles.tagGrupoText}>GRUPO {selectedGrupoNombre}</Text>
                </View>
                <Pressable
                  style={styles.modalCloseButton}
                  onPress={() => setSelectedStudent(null)}
                >
                  <Ionicons name="close" size={24} color="#000000" />
                </Pressable>
              </View>

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

              <View style={styles.modalActionsRow}>
                <Pressable
                  style={styles.btnEmitirAlerta}
                  onPress={() => selectedStudent && handleEmitirAlertaBusqueda(selectedStudent)}
                >
                  <Ionicons name="radio-outline" size={22} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.btnEmitirAlertaText}>Emitir Alerta</Text>
                </Pressable>

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

  // ==========================================
  // RENDER ROL DOCENTE (PROFESOR/TUTOR)
  // ==========================================
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
      </ScrollView>

      {/* MODAL DETALLES DEL ALUMNO PENDIENTE */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedStudent !== null}
        onRequestClose={() => setSelectedStudent(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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

            <View style={styles.modalActionsRow}>
              <Pressable
                style={styles.btnEmitirAlerta}
                onPress={() => selectedStudent && handleEmitirAlertaBusqueda(selectedStudent)}
              >
                <Ionicons name="radio-outline" size={22} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.btnEmitirAlertaText}>Emitir Alerta</Text>
              </Pressable>

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
    position: 'relative',
  },
  backButtonAdmin: {
    position: 'absolute',
    left: 16,
    top: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111E38',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 1,
    textAlign: 'center',
  },
  headerSubtitleAdmin: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 10,
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
  scrollContentAdmin: {
    paddingTop: 12,
    paddingBottom: 24,
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
  // ESTILOS EXCLUSIVOS ADMIN
  cardAdmin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  cardAdminAlerta: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  cardLeftAdmin: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainerAdmin: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfoAdmin: {
    flex: 1,
  },
  cardTitleAdmin: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111E38',
    marginBottom: 2,
  },
  cardDescAdmin: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 2,
  },
  cardSubDescAdmin: {
    fontSize: 11,
    color: '#6B7280',
  },
  statusColAdmin: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRowAdmin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  statBoxAdminGray: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    marginRight: 6,
  },
  statBoxAdminBlack: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 16,
    marginLeft: 6,
  },
  statBoxLabelAdmin: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  statBoxValueAdmin: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111E38',
  },
  btnIrDesactivar: {
    height: 52,
    backgroundColor: '#EF4444',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  btnIrDesactivarText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  desactivarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  desactivarTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111E38',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 10,
  },
  desactivarSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
  },
  sliderContainer: {
    width: 280,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4E88E4',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#4E88E4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sliderTrack: {
    height: '100%',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 6,
  },
  sliderText: {
    width: '100%',
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  sliderButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
