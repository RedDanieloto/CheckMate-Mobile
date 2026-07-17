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
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRole } from '../../context/RoleContext';

interface Alumno {
  id: string;
  nombre: string;
  matricula: string;
  email: string;
  estadoAcademico: 'REGULAR' | 'CONDICIONAL';
  incidencias: {
    materia: string;
    tipo: 'Inasistencia justificada' | 'Inasistencia injustificada';
    fecha: string;
  }[];
}

interface Grupo {
  id: string;
  nombre: string;
  carrera: string;
  alumnos: Alumno[];
}

export default function GruposTuteadosScreen() {
  const { showGruposTuteados, setShowGruposTuteados, role } = useRole();
  const insets = useSafeAreaInsets();

  const [viewState, setViewState] = useState<'grupos' | 'alumnos'>('grupos');
  const [selectedGrupo, setSelectedGrupo] = useState<Grupo | null>(null);
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);

  // Exclusión del módulo para roles que no sean el tutor
  if (!showGruposTuteados || role !== 'profesor_tutor') return null;

  // Datos mock de los grupos tuteados del profesor tutor
  const gruposTuteados: Grupo[] = [
    {
      id: '1',
      nombre: '9no "A"',
      carrera: 'Tecnologias de la Informacion',
      alumnos: [
        {
          id: '1',
          nombre: 'Jose Papito Lopez',
          matricula: '23170049',
          email: 'j.papito@uttcampus.edu.mx',
          estadoAcademico: 'REGULAR',
          incidencias: [
            { materia: 'Falta en ingles', tipo: 'Inasistencia justificada', fecha: '20-06-2026' },
            { materia: 'Falta en ingles', tipo: 'Inasistencia injustificada', fecha: '19-06-2026' },
          ],
        },
        {
          id: '2',
          nombre: 'Maria Garcia Rojas',
          matricula: '23170052',
          email: 'm.garcia@uttcampus.edu.mx',
          estadoAcademico: 'REGULAR',
          incidencias: [
            { materia: 'Dispositivos Inteligentes', tipo: 'Inasistencia justificada', fecha: '12-06-2026' },
          ],
        },
        {
          id: '3',
          nombre: 'Carlos Eduardo Mendez',
          matricula: '23170088',
          email: 'c.mendez@uttcampus.edu.mx',
          estadoAcademico: 'CONDICIONAL',
          incidencias: [
            { materia: 'Programación Móvil', tipo: 'Inasistencia injustificada', fecha: '15-06-2026' },
            { materia: 'Programación Móvil', tipo: 'Inasistencia injustificada', fecha: '10-06-2026' },
            { materia: 'Extracción de Datos', tipo: 'Inasistencia injustificada', fecha: '08-06-2026' },
          ],
        },
        {
          id: '4',
          nombre: 'Ana Victoria Solis',
          matricula: '23170102',
          email: 'a.solis@uttcampus.edu.mx',
          estadoAcademico: 'REGULAR',
          incidencias: [],
        },
        {
          id: '5',
          nombre: 'Roberto Ruiz Ortiz',
          matricula: '23170115',
          email: 'r.ruiz@uttcampus.edu.mx',
          estadoAcademico: 'REGULAR',
          incidencias: [
            { materia: 'Inglés', tipo: 'Inasistencia justificada', fecha: '02-06-2026' },
          ],
        },
        {
          id: '6',
          nombre: 'Elena Sofia Castro',
          matricula: '23170129',
          email: 'e.castro@uttcampus.edu.mx',
          estadoAcademico: 'REGULAR',
          incidencias: [],
        },
      ],
    },
  ];

  const handleBackPress = () => {
    if (viewState === 'alumnos') {
      setViewState('grupos');
      setSelectedGrupo(null);
    } else {
      setShowGruposTuteados(false);
    }
  };

  const handleSelectGrupo = (grupo: Grupo) => {
    setSelectedGrupo(grupo);
    setViewState('alumnos');
  };

  const handleSendMail = (email: string, name: string) => {
    const url = `mailto:${email}?subject=Reporte de Asistencias - CheckMate`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo redirigir al cliente de correo.');
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Cabecera */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back-outline" size={28} color="#111E38" />
        </Pressable>
      </View>

      {viewState === 'grupos' ? (
        <>
          <Text style={styles.title}>Grupos Tutados</Text>
          <View style={styles.divider} />
          
          <ScrollView
            style={styles.listContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {gruposTuteados.map((item) => (
              <Pressable
                key={item.id}
                style={styles.card}
                onPress={() => handleSelectGrupo(item)}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="people-outline" size={26} color="#6B7280" />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.nombre}</Text>
                    <Text style={styles.cardDesc}>{item.carrera}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          <Text style={styles.title}>Grupo {selectedGrupo?.nombre}</Text>
          <View style={styles.divider} />
          
          <ScrollView
            style={styles.listContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {selectedGrupo?.alumnos.map((student) => (
              <Pressable
                key={student.id}
                style={styles.alumnoCard}
                onPress={() => setSelectedAlumno(student)}
              >
                <View style={styles.alumnoCardLeft}>
                  {/* Foto de perfil / Avatar */}
                  <View style={styles.alumnoAvatar}>
                    <Ionicons name="person" size={18} color="#6B7280" />
                  </View>
                  <View>
                    <Text style={styles.alumnoName}>{student.nombre}</Text>
                    <Text style={styles.alumnoMatricula}>{student.matricula}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
              </Pressable>
            ))}

            <Pressable
              style={styles.btnVerTodos}
              onPress={() => Alert.alert('Alumnos', 'Mostrando la lista completa del grupo 9A')}
            >
              <Text style={styles.btnVerTodosText}>Ver todos</Text>
            </Pressable>
          </ScrollView>
        </>
      )}

      {/* MODAL DETALLES DEL EXPEDIENTE DEL ALUMNO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedAlumno !== null}
        onRequestClose={() => setSelectedAlumno(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Cabecera Negra del Modal */}
            <View style={styles.modalHeaderDark}>
              <View style={styles.modalCloseRow}>
                <Pressable
                  style={styles.modalCloseButtonDark}
                  onPress={() => setSelectedAlumno(null)}
                >
                  <Ionicons name="close" size={24} color="#ffffff" />
                </Pressable>
              </View>

              {/* Avatar circular grande */}
              <View style={styles.largeAvatarCircle}>
                <Ionicons name="person" size={50} color="#111E38" />
              </View>

              <Text style={styles.modalStudentName}>{selectedAlumno?.nombre}</Text>
              <Text style={styles.modalStudentSub}>Estudiante • Grupo {selectedGrupo?.nombre}</Text>
            </View>

            {/* Contenido Blanco del Modal */}
            <View style={styles.modalBody}>
              {/* Estado Académico */}
              <View style={styles.estadoRow}>
                <Text style={styles.bodyLabel}>Estado Académico</Text>
                <View style={styles.tagRegular}>
                  <Text style={styles.tagRegularText}>{selectedAlumno?.estadoAcademico}</Text>
                </View>
              </View>

              {/* Incidencias Recientes */}
              <View style={styles.incidenciasHeader}>
                <Ionicons name="alert-circle-outline" size={18} color="#000000" style={{ marginRight: 6 }} />
                <Text style={styles.incidenciasTitle}>Incidencias recientes</Text>
              </View>

              <ScrollView style={styles.incidenciasScroll} showsVerticalScrollIndicator={true}>
                {selectedAlumno?.incidencias && selectedAlumno.incidencias.length > 0 ? (
                  selectedAlumno.incidencias.map((inc, index) => (
                    <View key={index} style={styles.incidenciaRow}>
                      <View>
                        <Text style={styles.incidenciaMateria}>{inc.materia}</Text>
                        <Text style={styles.incidenciaTipo}>{inc.tipo}</Text>
                      </View>
                      <Text style={styles.incidenciaFecha}>{inc.fecha}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noIncidenciasText}>No se registran incidencias recientes.</Text>
                )}
              </ScrollView>

              {/* Fila de Botones */}
              <View style={styles.modalActionsRow}>
                <Pressable
                  style={styles.btnVerExpediente}
                  onPress={() => Alert.alert('Expediente Escolar', `Redirigiendo al expediente completo de ${selectedAlumno?.nombre}`)}
                >
                  <Text style={styles.btnVerExpedienteText}>Ver Expediente</Text>
                </Pressable>
                <Pressable
                  style={styles.mailButton}
                  onPress={() => selectedAlumno && handleSendMail(selectedAlumno.email, selectedAlumno.nombre)}
                >
                  <Ionicons name="mail-outline" size={24} color="#000000" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 0,
    bottom: Platform.OS === 'ios' ? 88 : 68, // Respeta el TabBar
    left: 0,
    right: 0,
    zIndex: 998,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111E38',
    paddingHorizontal: 24,
    marginTop: 16,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 24,
    marginTop: 14,
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardInfo: {
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111E38',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#6B7280',
  },
  alumnoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  alumnoCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alumnoAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alumnoName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111E38',
  },
  alumnoMatricula: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  btnVerTodos: {
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    paddingHorizontal: 36,
  },
  btnVerTodosText: {
    color: '#000000',
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
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeaderDark: {
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  modalCloseRow: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  modalCloseButtonDark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeAvatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  modalStudentName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalStudentSub: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  modalBody: {
    padding: 24,
  },
  estadoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 16,
  },
  bodyLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
  tagRegular: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  tagRegularText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  incidenciasHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  incidenciasTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
  incidenciasScroll: {
    maxHeight: 140,
    marginBottom: 20,
  },
  incidenciaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  incidenciaMateria: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111E38',
    marginBottom: 2,
  },
  incidenciaTipo: {
    fontSize: 11,
    color: '#6B7280',
  },
  incidenciaFecha: {
    fontSize: 12,
    color: '#111E38',
    fontWeight: '600',
  },
  noIncidenciasText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 12,
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnVerExpediente: {
    flex: 1,
    height: 48,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  btnVerExpedienteText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mailButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
