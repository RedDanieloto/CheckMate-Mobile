import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Modal,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRole } from '../../context/RoleContext';

interface Justificante {
  id: string;
  materia: string;
  profesor: string;
  correo: string;
  fechaEnvio: string;
  estado: 'revisión' | 'aceptado' | 'rechazado';
  archivo: string;
  mensaje: string;
  motivoRechazo?: string;
  estudiante: string;
  matricula: string;
}

export default function JustificantesScreen() {
  const { showJustificantes, setShowJustificantes, role } = useRole();
  const insets = useSafeAreaInsets();

  // Listado de justificantes reactivo para simular aprobaciones, rechazos y retiros
  const [justificantes, setJustificantes] = useState<Justificante[]>([
    {
      id: '1',
      materia: 'Dispositivos Inteligentes',
      profesor: 'Julian Quiñones',
      correo: 'j.quinones@uttcampus.edu.mx',
      fechaEnvio: '03/06/2026',
      estado: 'revisión',
      archivo: 'JUSTIFICANTE.JPG',
      mensaje: 'Tuve un fuerte dolor de estómago y me tuve que ausentar para ir a la clínica.',
      estudiante: 'Diego Maradona',
      matricula: '20210045',
    },
    {
      id: '2',
      materia: 'Extracción de Datos',
      profesor: 'Igmar Salazar',
      correo: 'igmar.salazar@uttcampus.edu.mx',
      fechaEnvio: '28/05/2026',
      estado: 'aceptado',
      archivo: 'RECETA_MEDICA.PDF',
      mensaje: 'Fui a consulta odontológica urgente por dolor de muelas agudo.',
      estudiante: 'Diego Maradona',
      matricula: '20210045',
    },
    {
      id: '3',
      materia: 'Programación Móvil',
      profesor: 'José Perez',
      correo: 'j.perez@uttcampus.edu.mx',
      fechaEnvio: '15/05/2026',
      estado: 'rechazado',
      archivo: 'JUSTIFICANTE_TRABAJO.PNG',
      mensaje: 'Tuve junta laboral urgente fuera del campus en horario de clase.',
      motivoRechazo: 'El reglamento no contempla ausencias por motivos laborales sin preaviso oficial firmado por la dirección escolar.',
      estudiante: 'Diego Maradona',
      matricula: '20210045',
    },
  ]);

  const [selectedJustificante, setSelectedJustificante] = useState<Justificante | null>(null);

  // Estados para el sub-modal de rechazo
  const [isRechazoModalVisible, setIsRechazoModalVisible] = useState(false);
  const [motivoRechazoInput, setMotivoRechazoInput] = useState('');

  if (!showJustificantes || role === 'profesor') return null;

  // Filtrar justificantes visibles:
  // Administrador, Tutor y Profesor ven todos los del grupo o alumnos. Estudiante solo los propios (en este mock son los mismos)
  const listadoVisible = justificantes;

  // Estadísticas calculadas dinámicamente para la parte inferior
  const totalCount = listadoVisible.length;
  const pendientesCount = listadoVisible.filter(j => j.estado === 'revisión').length;
  const aptosCount = listadoVisible.filter(j => j.estado === 'aceptado').length;

  // Estudiante retira su justificante
  const handleRetirarJustificante = (id: string) => {
    Alert.alert(
      'Retirar Justificación',
      '¿Estás seguro de que deseas retirar este justificante? Esta acción lo eliminará de revisión.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar Retiro',
          style: 'destructive',
          onPress: () => {
            setJustificantes(prev => prev.filter(j => j.id !== id));
            setSelectedJustificante(null);
            Alert.alert('Justificancia Retirada', 'El justificante ha sido removido con éxito.');
          },
        },
      ]
    );
  };

  // Docente aprueba justificante
  const handleAprobarJustificante = (id: string) => {
    Alert.alert(
      'Aprobar Justificante',
      '¿Deseas autorizar esta justificación de inasistencia para el estudiante?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Autorizar',
          onPress: () => {
            setJustificantes(prev =>
              prev.map(j => (j.id === id ? { ...j, estado: 'aceptado' } : j))
            );
            setSelectedJustificante(null);
            Alert.alert('Aprobado', 'Justificante aceptado con éxito.');
          },
        },
      ]
    );
  };

  // Confirmar el rechazo escribiendo el motivo
  const handleConfirmarRechazo = () => {
    if (!motivoRechazoInput.trim()) {
      Alert.alert('Motivo Requerido', 'Por favor, escribe la razón por la que rechazas el justificante.');
      return;
    }

    if (selectedJustificante) {
      const targetId = selectedJustificante.id;
      setJustificantes(prev =>
        prev.map(j =>
          j.id === targetId
            ? { ...j, estado: 'rechazado', motivoRechazo: motivoRechazoInput }
            : j
        )
      );
      setIsRechazoModalVisible(false);
      setMotivoRechazoInput('');
      setSelectedJustificante(null);
      Alert.alert('Rechazado', 'El justificante ha sido marcado como rechazado.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Cabecera superior */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => setShowJustificantes(false)}
        >
          <Ionicons name="arrow-back-outline" size={28} color="#111E38" />
        </Pressable>
      </View>

      <Text style={styles.title}>Historial de Justificaciones</Text>
      <View style={styles.divider} />

      {/* Lista de justificaciones */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {listadoVisible.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => setSelectedJustificante(item)}
          >
            <View style={styles.cardLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="document-text-outline" size={24} color="#6B7280" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardMateria}>{item.materia}</Text>
                {role !== 'estudiante' && (
                  <Text style={styles.cardStudent}>Alum: {item.estudiante}</Text>
                )}
                <Text style={styles.cardDocente}>{item.profesor}</Text>
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={14} color="#8E8E93" />
                  <Text style={styles.cardDate}>{item.fechaEnvio}</Text>
                </View>
              </View>
            </View>

            {/* Tag de Estado */}
            <View
              style={[
                styles.statusTag,
                item.estado === 'revisión'
                  ? styles.statusTagRevision
                  : item.estado === 'aceptado'
                  ? styles.statusTagAceptado
                  : styles.statusTagRechazado,
              ]}
            >
              <Text
                style={[
                  styles.statusTagText,
                  item.estado === 'revisión'
                    ? styles.statusTagTextRevision
                    : item.estado === 'aceptado'
                    ? styles.statusTagTextAceptado
                    : styles.statusTagTextRechazado,
                ]}
              >
                {item.estado === 'revisión'
                  ? 'EN REVISIÓN'
                  : item.estado === 'aceptado'
                  ? 'ACEPTADO'
                  : 'RECHAZADO'}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Resumen Estadístico Inferior (Fiel al diseño) */}
      <View style={[styles.statsWrapper, { paddingBottom: 16 }]}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TOTAL</Text>
          <Text style={styles.statValue}>{totalCount}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>PENDIENTES</Text>
          <Text style={styles.statValue}>{pendientesCount}</Text>
          <View style={[styles.statLine, { backgroundColor: '#F59E0B' }]} />
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>APTOS</Text>
          <Text style={styles.statValue}>{aptosCount}</Text>
          <View style={[styles.statLine, { backgroundColor: '#10B981' }]} />
        </View>
      </View>

      {/* MODAL DETALLES DEL JUSTIFICANTE */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedJustificante !== null}
        onRequestClose={() => setSelectedJustificante(null)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingContainer}
            >
              <View style={styles.modalContent}>
                {/* Cabecera del Modal */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalSubtitle}>JUSTIFICANTE ENVIADO</Text>
                  <Pressable
                    style={styles.modalCloseButton}
                    onPress={() => setSelectedJustificante(null)}
                  >
                    <Ionicons name="close" size={24} color="#000000" />
                  </Pressable>
                </View>

                {/* Título de la materia */}
                <Text style={styles.modalMateriaTitle}>
                  {selectedJustificante?.materia?.toUpperCase()}
                </Text>

                {/* Listado de datos */}
                <View style={styles.detailsList}>
                  {role !== 'estudiante' && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Estudiante</Text>
                      <View style={styles.studentCol}>
                        <Text style={styles.studentName}>{selectedJustificante?.estudiante}</Text>
                        <Text style={styles.studentMatricula}>Mat: {selectedJustificante?.matricula}</Text>
                      </View>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Fecha de Envío</Text>
                    <Text style={styles.detailValue}>Mie • {selectedJustificante?.fechaEnvio}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Profesor</Text>
                    <View style={styles.profesorCol}>
                      <Text style={styles.profesorName}>{selectedJustificante?.profesor}</Text>
                      <Text style={styles.profesorEmail}>{selectedJustificante?.correo}</Text>
                    </View>
                  </View>
                  <View style={[styles.detailRow, styles.noBorder]}>
                    <Text style={styles.detailLabel}>Estado</Text>
                    <View
                      style={[
                        styles.statusTag,
                        selectedJustificante?.estado === 'revisión'
                          ? styles.statusTagRevision
                          : selectedJustificante?.estado === 'aceptado'
                          ? styles.statusTagAceptado
                          : styles.statusTagRechazado,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusTagText,
                          selectedJustificante?.estado === 'revisión'
                            ? styles.statusTagTextRevision
                            : selectedJustificante?.estado === 'aceptado'
                            ? styles.statusTagTextAceptado
                            : styles.statusTagTextRechazado,
                        ]}
                      >
                        {selectedJustificante?.estado?.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Caja de Archivo Adjunto */}
                <Pressable
                  style={styles.fileBox}
                  onPress={() => Alert.alert('Archivo Adjunto', `Visualizando ${selectedJustificante?.archivo}`)}
                >
                  <View style={styles.fileBoxLeft}>
                    <Ionicons name="image-outline" size={24} color="#000000" />
                    <Text style={styles.fileName}>{selectedJustificante?.archivo}</Text>
                  </View>
                  <Text style={styles.fileActionText}>VER</Text>
                </Pressable>

                {/* Caja de Mensaje */}
                <View style={styles.messageBox}>
                  <Text style={styles.messageLabel}>Mensaje</Text>
                  <Text style={styles.messageContentText}>{selectedJustificante?.mensaje}</Text>
                </View>

                {/* Caja de Motivo de Rechazo (Si está rechazado) */}
                {selectedJustificante?.estado === 'rechazado' && (
                  <View style={styles.rechazoBox}>
                    <Text style={styles.rechazoLabel}>Motivo del Rechazo</Text>
                    <Text style={styles.rechazoContentText}>
                      {selectedJustificante?.motivoRechazo || 'Documento no válido.'}
                    </Text>
                  </View>
                )}

                {/* Botones de acción según el Rol */}
                <View style={styles.actionRow}>
                  {/* ESTUDIANTE: Botón de retirar justificante */}
                  {role === 'estudiante' && selectedJustificante?.estado === 'revisión' && (
                    <>
                      <Pressable
                        style={styles.submitButton}
                        onPress={() => selectedJustificante && handleRetirarJustificante(selectedJustificante.id)}
                      >
                        <Text style={styles.submitButtonText}>RETIRAR JUSTIFICACIÓN</Text>
                      </Pressable>
                      <Pressable
                        style={styles.mailButton}
                        onPress={() => Alert.alert('Contacto', `Enviando correo a ${selectedJustificante?.correo}`)}
                      >
                        <Ionicons name="mail-outline" size={24} color="#000000" />
                      </Pressable>
                    </>
                  )}

                  {/* TUTOR: Botón Aceptar y Rechazar */}
                  {role === 'profesor_tutor' && selectedJustificante?.estado === 'revisión' && (
                    <View style={styles.docenteActionsRow}>
                      <Pressable
                        style={[styles.docenteActionButton, styles.btnAprobar]}
                        onPress={() => selectedJustificante && handleAprobarJustificante(selectedJustificante.id)}
                      >
                        <Ionicons name="checkmark-sharp" size={20} color="#ffffff" style={{ marginRight: 6 }} />
                        <Text style={styles.docenteActionText}>APROBAR</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.docenteActionButton, styles.btnRechazar]}
                        onPress={() => setIsRechazoModalVisible(true)}
                      >
                        <Ionicons name="close-sharp" size={20} color="#ffffff" style={{ marginRight: 6 }} />
                        <Text style={styles.docenteActionText}>RECHAZAR</Text>
                      </Pressable>
                    </View>
                  )}

                  {/* ADMINISTRADOR o Justificante ya resuelto: Solo botón de cerrar */}
                  {(role === 'administrador' || selectedJustificante?.estado !== 'revisión') && (
                    <Pressable
                      style={styles.closeModalButton}
                      onPress={() => setSelectedJustificante(null)}
                    >
                      <Text style={styles.closeModalButtonText}>ENTENDIDO</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* SUB-MODAL PARA ESCRIBIR MOTIVO DE RECHAZO (DOCENTES) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isRechazoModalVisible}
        onRequestClose={() => setIsRechazoModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.subModalOverlay}>
            <View style={styles.subModalContent}>
              <View style={styles.subModalHeader}>
                <Text style={styles.subModalTitle}>Motivo del Rechazo</Text>
                <Pressable onPress={() => setIsRechazoModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#000000" />
                </Pressable>
              </View>
              <Text style={styles.subModalSubtitle}>
                Especifica la razón por la cual no se acepta esta justificación médica:
              </Text>
              
              <TextInput
                style={styles.subModalInput}
                placeholder="Escribe el motivo aquí..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                value={motivoRechazoInput}
                onChangeText={setMotivoRechazoInput}
              />

              <View style={styles.subModalActions}>
                <Pressable
                  style={[styles.subModalBtn, styles.subModalBtnCancel]}
                  onPress={() => setIsRechazoModalVisible(false)}
                >
                  <Text style={styles.subModalBtnTextCancel}>CANCELAR</Text>
                </Pressable>
                <Pressable
                  style={[styles.subModalBtn, styles.subModalBtnConfirm]}
                  onPress={handleConfirmarRechazo}
                >
                  <Text style={styles.subModalBtnTextConfirm}>CONFIRMAR</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
    bottom: Platform.OS === 'ios' ? 88 : 68, // Deja libre la barra de pestañas (Bottom TabBar)
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
    paddingBottom: 120,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
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
    flex: 1,
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
    flex: 1,
  },
  cardMateria: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111E38',
    marginBottom: 4,
  },
  cardStudent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 2,
  },
  cardDocente: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    fontWeight: '500',
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTagRevision: {
    backgroundColor: '#FEF3C7',
  },
  statusTagAceptado: {
    backgroundColor: '#D1FAE5',
  },
  statusTagRechazado: {
    backgroundColor: '#FEE2E2',
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusTagTextRevision: {
    color: '#D97706',
  },
  statusTagTextAceptado: {
    color: '#059669',
  },
  statusTagTextRechazado: {
    color: '#DC2626',
  },
  statsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111E38',
  },
  statLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  // MODAL DETALLES DEL JUSTIFICANTE
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  keyboardAvoidingContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6B7280',
    letterSpacing: 1,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalMateriaTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1.5,
    marginBottom: 20,
    marginTop: 4,
  },
  detailsList: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111E38',
  },
  profesorCol: {
    alignItems: 'flex-end',
  },
  profesorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111E38',
  },
  profesorEmail: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 1,
  },
  studentCol: {
    alignItems: 'flex-end',
  },
  studentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111E38',
  },
  studentMatricula: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 1,
  },
  fileBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  fileBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  fileActionText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000000',
  },
  messageBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111E38',
    marginBottom: 6,
  },
  messageContentText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    fontWeight: '500',
  },
  rechazoBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  rechazoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 6,
  },
  rechazoContentText: {
    fontSize: 13,
    color: '#DC2626',
    lineHeight: 18,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  mailButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  closeModalButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  // ACCIONES DEL DOCENTE EN MODAL
  docenteActionsRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  docenteActionButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  btnAprobar: {
    backgroundColor: '#10B981',
  },
  btnRechazar: {
    backgroundColor: '#EF4444',
  },
  docenteActionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  // SUB-MODAL DE RECHAZO
  subModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  subModalContent: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  subModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  subModalSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 14,
  },
  subModalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#111E38',
    height: 80,
    textAlignVertical: 'top',
    backgroundColor: '#F9FAFB',
    marginBottom: 18,
  },
  subModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  subModalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  subModalBtnCancel: {
    backgroundColor: '#F3F4F6',
  },
  subModalBtnConfirm: {
    backgroundColor: '#DC2626',
  },
  subModalBtnTextCancel: {
    color: '#4B5563',
    fontWeight: 'bold',
    fontSize: 12,
  },
  subModalBtnTextConfirm: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
