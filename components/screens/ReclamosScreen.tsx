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

interface Reclamo {
  id: string;
  titulo: string;
  tutor: string;
  correo: string;
  fechaEnvio: string;
  estado: 'revisión' | 'aceptado' | 'rechazado';
  archivo: string;
  mensaje: string;
  motivoRechazo?: string;
  estudiante: string;
  matricula: string;
}

export default function ReclamosScreen() {
  const { showReclamos, setShowReclamos, role } = useRole();
  const insets = useSafeAreaInsets();

  // Listado reactivo de reclamos
  const [reclamos, setReclamos] = useState<Reclamo[]>([
    {
      id: '1',
      titulo: 'ROBO DE COMPUTADORA',
      tutor: 'Igmar Salazar',
      correo: 'igmar.salazar@uttcampus.edu.mx',
      fechaEnvio: '03/06/2026',
      estado: 'revisión',
      archivo: 'RECLAMO.JPG',
      mensaje: 'Se dejo una computadora en el salon 12 del edificio B.',
      estudiante: 'Diego Maradona',
      matricula: '20210045',
    },
    {
      id: '2',
      titulo: 'COBRO DE BECA DUPLICADO',
      tutor: 'Igmar Salazar',
      correo: 'igmar.salazar@uttcampus.edu.mx',
      fechaEnvio: '20/05/2026',
      estado: 'aceptado',
      archivo: 'CAPTURAS_BANCO.PDF',
      mensaje: 'El sistema me cobró dos veces la solicitud de renovación de beca alimenticia.',
      estudiante: 'Diego Maradona',
      matricula: '20210045',
    },
  ]);

  const [selectedReclamo, setSelectedReclamo] = useState<Reclamo | null>(null);

  // Estados para crear reclamo
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [archivoAdjunto, setArchivoAdjunto] = useState('');

  // Estados para el submodal de rechazo
  const [isRechazoModalVisible, setIsRechazoModalVisible] = useState(false);
  const [motivoRechazoInput, setMotivoRechazoInput] = useState('');

  // Exclusión absoluta del Profesor Común
  if (!showReclamos || role === 'profesor') return null;

  const listadoVisible = reclamos;

  // Estadísticas del pie de página
  const totalCount = listadoVisible.length;
  const pendientesCount = listadoVisible.filter(r => r.estado === 'revisión').length;
  const aptosCount = listadoVisible.filter(r => r.estado === 'aceptado').length;

  const handleSimularAdjuntar = () => {
    Alert.alert(
      'Adjuntar Evidencia',
      'Selecciona el formato de archivo:',
      [
        { text: 'Imagen (JPG/PNG)', onPress: () => setArchivoAdjunto('RECLAMO_ADJUNTO.JPG') },
        { text: 'Documento (PDF)', onPress: () => setArchivoAdjunto('RECLAMO_EVIDENCIA.PDF') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleCrearReclamo = () => {
    if (!nuevoTitulo.trim()) {
      Alert.alert('Título Requerido', 'Por favor ingresa un título para el reclamo.');
      return;
    }
    if (!nuevoMensaje.trim()) {
      Alert.alert('Mensaje Requerido', 'Por favor ingresa el mensaje explicativo.');
      return;
    }

    const nuevo: Reclamo = {
      id: String(reclamos.length + 1),
      titulo: nuevoTitulo.toUpperCase(),
      tutor: 'Igmar Salazar',
      correo: 'igmar.salazar@uttcampus.edu.mx',
      fechaEnvio: '03/06/2026',
      estado: 'revisión',
      archivo: archivoAdjunto || 'SIN_EVIDENCIA.JPG',
      mensaje: nuevoMensaje,
      estudiante: 'Diego Maradona',
      matricula: '20210045',
    };

    setReclamos(prev => [nuevo, ...prev]);
    setIsCreateModalVisible(false);
    setNuevoTitulo('');
    setNuevoMensaje('');
    setArchivoAdjunto('');
    Alert.alert('Éxito', 'El reclamo ha sido creado y enviado para su revisión.');
  };

  const handleRetirarReclamo = (id: string) => {
    Alert.alert(
      'Retirar Reclamo',
      '¿Estás seguro de que deseas retirar este reclamo? Esta acción lo eliminará de revisión.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar Retiro',
          style: 'destructive',
          onPress: () => {
            setReclamos(prev => prev.filter(r => r.id !== id));
            setSelectedReclamo(null);
            Alert.alert('Reclamo Retirado', 'El reclamo ha sido removido con éxito.');
          },
        },
      ]
    );
  };

  const handleAprobarReclamo = (id: string) => {
    Alert.alert(
      'Aprobar Reclamo',
      '¿Deseas marcar este reclamo como resuelto/aceptado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar Reclamo',
          onPress: () => {
            setReclamos(prev =>
              prev.map(r => (r.id === id ? { ...r, estado: 'aceptado' } : r))
            );
            setSelectedReclamo(null);
            Alert.alert('Aprobado', 'El reclamo ha sido marcado como aceptado.');
          },
        },
      ]
    );
  };

  const handleConfirmarRechazo = () => {
    if (!motivoRechazoInput.trim()) {
      Alert.alert('Motivo Requerido', 'Por favor, escribe la razón por la que rechazas el reclamo.');
      return;
    }

    if (selectedReclamo) {
      const targetId = selectedReclamo.id;
      setReclamos(prev =>
        prev.map(r =>
          r.id === targetId
            ? { ...r, estado: 'rechazado', motivoRechazo: motivoRechazoInput }
            : r
        )
      );
      setIsRechazoModalVisible(false);
      setMotivoRechazoInput('');
      setSelectedReclamo(null);
      Alert.alert('Rechazado', 'El reclamo ha sido marcado como rechazado.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Cabecera */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => setShowReclamos(false)}
        >
          <Ionicons name="arrow-back-outline" size={28} color="#111E38" />
        </Pressable>
      </View>

      <Text style={styles.title}>Historial de Reclamos</Text>
      <View style={styles.divider} />

      {/* Listado */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {listadoVisible.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => setSelectedReclamo(item)}
          >
            <View style={styles.cardLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="document-outline" size={24} color="#6B7280" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitulo}>{item.titulo}</Text>
                {role !== 'estudiante' && (
                  <Text style={styles.cardStudent}>Alum: {item.estudiante}</Text>
                )}
                <Text style={styles.cardTutor}>Tutor: {item.tutor}</Text>
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

      {/* Botón flotante "+" para estudiante */}
      {role === 'estudiante' && (
        <Pressable
          style={styles.floatingAddButton}
          onPress={() => setIsCreateModalVisible(true)}
        >
          <Ionicons name="add" size={32} color="#ffffff" />
        </Pressable>
      )}

      {/* Resumen Estadístico Inferior */}
      <View style={styles.statsWrapper}>
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

      {/* MODAL DETALLES DEL RECLAMO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedReclamo !== null}
        onRequestClose={() => setSelectedReclamo(null)}
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
                  <Text style={styles.modalSubtitle}>RECLAMO ENVIADO</Text>
                  <Pressable
                    style={styles.modalCloseButton}
                    onPress={() => setSelectedReclamo(null)}
                  >
                    <Ionicons name="close" size={24} color="#000000" />
                  </Pressable>
                </View>

                {/* Título */}
                <Text style={styles.modalTituloText}>
                  {selectedReclamo?.titulo}
                </Text>

                {/* Tabla de datos */}
                <View style={styles.detailsList}>
                  {role !== 'estudiante' && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Estudiante</Text>
                      <View style={styles.studentCol}>
                        <Text style={styles.studentName}>{selectedReclamo?.estudiante}</Text>
                        <Text style={styles.studentMatricula}>Mat: {selectedReclamo?.matricula}</Text>
                      </View>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Fecha de Envío</Text>
                    <Text style={styles.detailValue}>Mie • {selectedReclamo?.fechaEnvio}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tutor</Text>
                    <View style={styles.profesorCol}>
                      <Text style={styles.profesorName}>{selectedReclamo?.tutor}</Text>
                      <Text style={styles.profesorEmail}>{selectedReclamo?.correo}</Text>
                    </View>
                  </View>
                  <View style={[styles.detailRow, styles.noBorder]}>
                    <Text style={styles.detailLabel}>Estado</Text>
                    <View
                      style={[
                        styles.statusTag,
                        selectedReclamo?.estado === 'revisión'
                          ? styles.statusTagRevision
                          : selectedReclamo?.estado === 'aceptado'
                          ? styles.statusTagAceptado
                          : styles.statusTagRechazado,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusTagText,
                          selectedReclamo?.estado === 'revisión'
                            ? styles.statusTagTextRevision
                            : selectedReclamo?.estado === 'aceptado'
                            ? styles.statusTagTextAceptado
                            : styles.statusTagTextRechazado,
                        ]}
                      >
                        {selectedReclamo?.estado?.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Caja de Archivo Adjunto */}
                <Pressable
                  style={styles.fileBox}
                  onPress={() => Alert.alert('Evidencia Adjunta', `Visualizando ${selectedReclamo?.archivo}`)}
                >
                  <View style={styles.fileBoxLeft}>
                    <Ionicons name="image-outline" size={24} color="#000000" />
                    <Text style={styles.fileName}>{selectedReclamo?.archivo}</Text>
                  </View>
                  <Text style={styles.fileActionText}>VER</Text>
                </Pressable>

                {/* Caja de Mensaje */}
                <View style={styles.messageBox}>
                  <Text style={styles.messageLabel}>Mensaje</Text>
                  <Text style={styles.messageContentText}>{selectedReclamo?.mensaje}</Text>
                </View>

                {/* Motivo de Rechazo */}
                {selectedReclamo?.estado === 'rechazado' && (
                  <View style={styles.rechazoBox}>
                    <Text style={styles.rechazoLabel}>Motivo del Rechazo</Text>
                    <Text style={styles.rechazoContentText}>
                      {selectedReclamo?.motivoRechazo || 'Evidencia insuficiente.'}
                    </Text>
                  </View>
                )}

                {/* Botones de acción */}
                <View style={styles.actionRow}>
                  {/* Estudiante en revisión */}
                  {role === 'estudiante' && selectedReclamo?.estado === 'revisión' && (
                    <>
                      <Pressable
                        style={styles.submitButton}
                        onPress={() => selectedReclamo && handleRetirarReclamo(selectedReclamo.id)}
                      >
                        <Text style={styles.submitButtonText}>RETIRAR RECLAMO</Text>
                      </Pressable>
                      <Pressable
                        style={styles.mailButton}
                        onPress={() => Alert.alert('Contacto', `Enviando correo a ${selectedReclamo?.correo}`)}
                      >
                        <Ionicons name="mail-outline" size={24} color="#000000" />
                      </Pressable>
                    </>
                  )}

                  {/* Tutor en revisión */}
                  {role === 'profesor_tutor' && selectedReclamo?.estado === 'revisión' && (
                    <View style={styles.docenteActionsRow}>
                      <Pressable
                        style={[styles.docenteActionButton, styles.btnAprobar]}
                        onPress={() => selectedReclamo && handleAprobarReclamo(selectedReclamo.id)}
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

                  {/* Admin o Resueltos */}
                  {(role === 'administrador' || selectedReclamo?.estado !== 'revisión') && (
                    <Pressable
                      style={styles.closeModalButton}
                      onPress={() => setSelectedReclamo(null)}
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

      {/* MODAL CREAR RECLAMO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCreateModalVisible}
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingContainer}
            >
              <View style={styles.modalContent}>
                {/* Cabecera del modal */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalSubtitle}>TUTOR: IGMAR SALAZAR</Text>
                  <Pressable
                    style={styles.modalCloseButton}
                    onPress={() => setIsCreateModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#000000" />
                  </Pressable>
                </View>

                <Text style={styles.modalTitleLarge}>Crear Reclamo</Text>

                {/* Zona de adjuntar */}
                <Pressable
                  style={[styles.dashedBox, archivoAdjunto ? styles.dashedBoxActive : null]}
                  onPress={handleSimularAdjuntar}
                >
                  <Ionicons name="image-outline" size={42} color={archivoAdjunto ? "#10B981" : "#9CA3AF"} />
                  <Text style={[styles.dashedBoxText, archivoAdjunto ? styles.dashedBoxTextActive : null]}>
                    {archivoAdjunto ? `EVIDENCIA ADJUNTADA: ${archivoAdjunto}` : 'ADJUNTAR JUSTIFICANTE'}
                  </Text>
                </Pressable>

                {/* Formulario */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Título del Reclamo</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Robo de Computadora"
                    placeholderTextColor="#9CA3AF"
                    value={nuevoTitulo}
                    onChangeText={setNuevoTitulo}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Mensaje</Text>
                  <TextInput
                    style={[styles.formInput, styles.formInputMultiline]}
                    placeholder="Se dejo una computadora en el salon 12 del edificio B"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    value={nuevoMensaje}
                    onChangeText={setNuevoMensaje}
                  />
                </View>

                {/* Botones de acción */}
                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.submitButton}
                    onPress={handleCrearReclamo}
                  >
                    <Text style={styles.submitButtonText}>CREAR RECLAMO</Text>
                  </Pressable>
                  <Pressable
                    style={styles.mailButton}
                    onPress={() => Alert.alert('Contacto', 'Enviando correo a tutor escolar...')}
                  >
                    <Ionicons name="mail-outline" size={24} color="#000000" />
                  </Pressable>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* SUB-MODAL RECHAZAR RECLAMO */}
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
                Especifica la razón por la cual no se acepta este reclamo:
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
    bottom: Platform.OS === 'ios' ? 88 : 68, // Respeta la barra de pestañas
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
  cardTitulo: {
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
  cardTutor: {
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
  floatingAddButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 999,
  },
  statsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111E38',
  },
  statLine: {
    height: 3,
    width: 24,
    borderRadius: 1.5,
    marginTop: 6,
  },
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
    marginBottom: 12,
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
  modalTituloText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111E38',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  modalTitleLarge: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111E38',
    marginBottom: 16,
  },
  detailsList: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
    fontWeight: 'bold',
    color: '#111E38',
  },
  studentCol: {
    alignItems: 'flex-end',
  },
  studentName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111E38',
  },
  studentMatricula: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  profesorCol: {
    alignItems: 'flex-end',
  },
  profesorName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111E38',
  },
  profesorEmail: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  fileBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  fileBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111E38',
    marginLeft: 10,
  },
  fileActionText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111E38',
    marginRight: 4,
  },
  messageBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  messageLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  messageContentText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  rechazoBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  rechazoLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  rechazoContentText: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  submitButtonText: {
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
  closeModalButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#111E38',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  docenteActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  docenteActionButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAprobar: {
    backgroundColor: '#10B981',
    marginRight: 10,
  },
  btnRechazar: {
    backgroundColor: '#EF4444',
    marginLeft: 10,
  },
  docenteActionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  dashedBox: {
    height: 120,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  dashedBoxActive: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  dashedBoxText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 8,
  },
  dashedBoxTextActive: {
    color: '#059669',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  formInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#111E38',
    backgroundColor: '#F9FAFB',
  },
  formInputMultiline: {
    height: 90,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  subModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  subModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
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
    color: '#111E38',
  },
  subModalSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 14,
  },
  subModalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 13,
    color: '#111E38',
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  subModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subModalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subModalBtnCancel: {
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  subModalBtnConfirm: {
    backgroundColor: '#EF4444',
    marginLeft: 8,
  },
  subModalBtnTextCancel: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: 'bold',
  },
  subModalBtnTextConfirm: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
