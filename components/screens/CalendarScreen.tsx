import React, { useState, useRef, useEffect } from 'react';
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
import { useRole, Role } from '../../context/RoleContext';

interface CalendarDay {
  dayName: string;
  dayNumber: string;
  month: string;
  fullDate: string; // Identificador en formato AAAA-MM-DD
}

interface ClassItem {
  id: string;
  time: string;
  title: string;
  location: string;
  status: 'completed' | 'pending' | 'absent';
  profesor?: string;
  correo?: string;
  resumen?: string;
  agendaText?: string;
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { role } = useRole();

  // Fecha base inicial (3 de junio de 2026 para coincidir con el mockup inicial por defecto)
  const [baseDate, setBaseDate] = useState<Date>(new Date('2026-06-03T12:00:00'));
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-03');

  // Estados para los modales
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  // Estados para simular el envío del justificante
  const [justificanteAdjunto, setJustificanteAdjunto] = useState<string | null>(null);
  const [mensajeJustificante, setMensajeJustificante] = useState('');

  // Estados para el buscador de fecha modal
  const [searchDay, setSearchDay] = useState('03');
  const [searchMonth, setSearchMonth] = useState('06');
  const [searchYear, setSearchYear] = useState('2026');

  const scrollViewRef = useRef<ScrollView>(null);

  // Genera dinámicamente un rango de 31 días (15 antes y 15 después de la baseDate)
  const generateDays = (centerDate: Date): CalendarDay[] => {
    const result: CalendarDay[] = [];
    for (let i = -15; i <= 15; i++) {
      const d = new Date(centerDate.getTime());
      d.setDate(centerDate.getDate() + i);
      const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
      const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
      
      const year = d.getFullYear();
      const monthStr = String(d.getMonth() + 1).padStart(2, '0');
      const dayStr = String(d.getDate()).padStart(2, '0');
      const fullDate = `${year}-${monthStr}-${dayStr}`;

      result.push({
        dayName: dayNames[d.getDay()],
        dayNumber: dayStr,
        month: months[d.getMonth()],
        fullDate,
      });
    }
    return result;
  };

  const daysList = generateDays(baseDate);

  // Autoscroll del ScrollView horizontal para que el día seleccionado esté centrado
  useEffect(() => {
    const index = daysList.findIndex(d => d.fullDate === selectedDate);
    if (index !== -1 && scrollViewRef.current) {
      const itemWidth = 64;
      const screenWidth = Platform.OS === 'web' ? 500 : 375; // Aproximación
      const scrollPosition = (index * itemWidth) - (screenWidth / 2) + (itemWidth / 2);
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: Math.max(0, scrollPosition), animated: true });
      }, 200);
    }
  }, [selectedDate, baseDate]);

  // Manejar el salto a una fecha específica desde el modal
  const handleSearchDate = () => {
    const day = parseInt(searchDay);
    const month = parseInt(searchMonth) - 1; // 0-11
    const year = parseInt(searchYear);

    if (isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || day > 31 || month < 0 || month > 11 || year < 2000 || year > 2100) {
      Alert.alert('Fecha inválida', 'Por favor, ingresa una fecha válida en formato numérico.');
      return;
    }

    const newDate = new Date(year, month, day, 12, 0, 0);
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const fullDateStr = `${year}-${monthStr}-${dayStr}`;

    setBaseDate(newDate);
    setSelectedDate(fullDateStr);
    setIsSearchModalVisible(false);
  };

  // Ir al día de hoy rápidamente
  const handleGoToToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const monthStr = String(today.getMonth() + 1).padStart(2, '0');
    const dayStr = String(today.getDate()).padStart(2, '0');
    const fullDateStr = `${year}-${monthStr}-${dayStr}`;

    setBaseDate(today);
    setSelectedDate(fullDateStr);
    setIsSearchModalVisible(false);
  };

  // Simular la carga de un archivo justificante
  const handleAdjuntarJustificante = () => {
    if (justificanteAdjunto) {
      // Si ya hay uno, lo removemos
      setJustificanteAdjunto(null);
    } else {
      // Simulamos que cargó un pdf
      setJustificanteAdjunto('justificante_medico_imss.pdf');
    }
  };

  // Simular envío de justificante
  const handleEnviarJustificante = () => {
    if (!justificanteAdjunto) {
      Alert.alert('Archivo Requerido', 'Por favor, adjunta un documento de justificante antes de enviar.');
      return;
    }
    Alert.alert(
      'Justificante Enviado',
      'Tu justificante y mensaje han sido enviados con éxito para la revisión del profesor tutor.',
      [
        {
          text: 'Entendido',
          onPress: () => {
            setJustificanteAdjunto(null);
            setMensajeJustificante('');
            setSelectedClass(null);
          },
        },
      ]
    );
  };

  // Datos mock de clases por rol y fecha
  const getClasses = (currentRole: Role, date: string): ClassItem[] => {
    if (currentRole === 'administrador') return [];

    // Clases del miércoles 3 de junio de 2026 (Mock principal de diseño con los 3 estados)
    if (date === '2026-06-03') {
      if (currentRole === 'estudiante') {
        return [
          {
            id: '1',
            time: '07:00 - 09:00',
            title: 'Extracción de Datos',
            location: 'Aula 17 • Edificio B',
            status: 'completed',
            profesor: 'Igmar Salazar',
            correo: 'igmar.salazar@uttcampus.edu.mx',
            agendaText: 'Mie • 07:00 - 09:00',
          },
          {
            id: '2',
            time: '09:00 - 11:00',
            title: 'Extracción de Datos',
            location: 'Aula 13 • Edificio B',
            status: 'completed',
            profesor: 'Igmar Salazar',
            correo: 'igmar.salazar@uttcampus.edu.mx',
            agendaText: 'Mie • 09:00 - 11:00',
          },
          {
            id: '3',
            time: '11:00 - 13:00',
            title: 'Dispositivos Inteligentes',
            location: 'Pesado 5',
            status: 'absent', // Falta para adjuntar justificante (Captura Derecha)
            profesor: 'Julian Quiñones',
            correo: 'j.quinones@uttcampus.edu.mx',
            agendaText: 'Mie • 11:00 - 13:00',
          },
          {
            id: '4',
            time: '13:00 - 15:00',
            title: 'Ingles',
            location: 'CADI',
            status: 'pending', // Aún no pasa con resumen (Captura Izquierda)
            profesor: 'Xochitl Galvez',
            correo: 'xxxtentacion.galvez@uttcampus.edu.mx',
            agendaText: 'Mie • 13:00 - 15:00',
            resumen: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pellentesque suscipit eros, quis aliquam enim malesuada quis. Phasellus facilisis volutpat nunc, sed bibendum nunc tempor sed. Morbi tempus ex sit amet aliquam consequat. Etiam nec mollis eros.',
          },
        ];
      } else {
        // Profesores y profesores tutores
        return [
          {
            id: '1',
            time: '07:00 - 09:00',
            title: 'Extracción de Datos - Gpo A',
            location: 'Aula 17 • Edificio B',
            status: 'completed',
            profesor: 'Diego Maradona (Tú)',
            correo: 'd.maradona@uttcampus.edu.mx',
            agendaText: 'Mie • 07:00 - 09:00',
          },
          {
            id: '2',
            time: '09:00 - 11:00',
            title: 'Extracción de Datos - Gpo B',
            location: 'Aula 13 • Edificio B',
            status: 'completed',
            profesor: 'Diego Maradona (Tú)',
            correo: 'd.maradona@uttcampus.edu.mx',
            agendaText: 'Mie • 09:00 - 11:00',
          },
          {
            id: '3',
            time: '11:00 - 13:00',
            title: 'Dispositivos Inteligentes - Gpo A',
            location: 'Pesado 5',
            status: 'absent',
            profesor: 'Julian Quiñones',
            correo: 'j.quinones@uttcampus.edu.mx',
            agendaText: 'Mie • 11:00 - 13:00',
          },
          {
            id: '4',
            time: '13:00 - 15:00',
            title: 'Ingles Avanzado - Gpo B',
            location: 'CADI',
            status: 'pending',
            profesor: 'Xochitl Galvez',
            correo: 'xxxtentacion.galvez@uttcampus.edu.mx',
            agendaText: 'Mie • 13:00 - 15:00',
            resumen: 'Clase avanzada de inglés técnico enfocado al desarrollo de vocabulario de ingeniería en sistemas y protocolos de telecomunicación.',
          },
        ];
      }
    }

    return [];
  };

  const classes = getClasses(role, selectedDate);

  if (role === 'administrador') {
    return (
      <View style={[styles.container, styles.adminContainer, { paddingTop: insets.top }]}>
        <Ionicons name="calendar-outline" size={100} color="#8E8E93" style={styles.adminIcon} />
        <Text style={styles.adminTitle}>Acceso No Disponible</Text>
        <Text style={styles.adminSubtitle}>
          El rol de Administrador no requiere la gestión ni visualización de horarios de clases.
        </Text>
      </View>
    );
  }

  // Helper para formatear el título de la fecha activa en la barra superior
  const formatHeaderDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';
    const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    const monthIndex = parseInt(parts[1]) - 1;
    return `${parts[2]} de ${months[monthIndex]} de ${parts[0]}`;
  };

  return (
    <View style={styles.container}>
      {/* Selector semanal horizontal deslizable (Fondo Negro) con soporte para insets.top */}
      <View style={[styles.weekSelectorWrapper, { paddingTop: insets.top + 16 }]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekSelectorScrollContent}
        >
          {daysList.map((day) => {
            const isSelected = day.fullDate === selectedDate;
            return (
              <Pressable
                key={day.fullDate}
                style={[
                  styles.dayButton,
                  isSelected && styles.dayButtonSelected,
                ]}
                onPress={() => setSelectedDate(day.fullDate)}
              >
                <Text
                  style={[
                    styles.dayNameText,
                    isSelected ? styles.textSelected : styles.textUnselected,
                  ]}
                >
                  {day.dayName}
                </Text>
                <Text
                  style={[
                    styles.dayNumberText,
                    isSelected ? styles.textSelected : styles.textUnselected,
                  ]}
                >
                  {day.dayNumber}
                </Text>
                <Text
                  style={[
                    styles.monthText,
                    isSelected ? styles.textSelected : styles.textUnselected,
                  ]}
                >
                  {day.month}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Listado de Clases / Horario */}
      <ScrollView
        style={styles.classList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {classes.length > 0 ? (
          classes.map((item) => (
            <Pressable
              key={item.id}
              style={styles.classCard}
              onPress={() => setSelectedClass(item)}
            >
              {/* Barra lateral de estado */}
              <View
                style={[
                  styles.cardStatusBar,
                  {
                    backgroundColor:
                      role !== 'estudiante'
                        ? '#111E38' // Barra lateral corporativa para profesores/tutores
                        : item.status === 'completed'
                        ? '#000000'
                        : item.status === 'absent'
                        ? '#EF4444'
                        : '#CCCCCC',
                  },
                ]}
              />
              {/* Contenido principal de la tarjeta */}
              <View style={styles.cardContent}>
                <View style={styles.cardInfo}>
                  <Text style={styles.classTime}>{item.time}</Text>
                  <Text style={styles.classTitle}>{item.title}</Text>
                  <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={14} color="#8E8E93" />
                    <Text style={styles.classLocation}>{item.location}</Text>
                  </View>
                </View>
                {/* Icono indicador del estado */}
                <View style={styles.statusIconContainer}>
                  {role !== 'estudiante' ? (
                    <Ionicons name="chevron-forward-outline" size={24} color="#8E8E93" />
                  ) : item.status === 'completed' ? (
                    <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
                  ) : item.status === 'absent' ? (
                    <Ionicons name="close-circle" size={32} color="#EF4444" />
                  ) : (
                    <Ionicons name="time-outline" size={32} color="#CCCCCC" />
                  )}
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Ionicons name="cafe-outline" size={70} color="#8E8E93" />
            </View>
            <Text style={styles.emptyTitle}>Día Libre / Sin Clases</Text>
            <Text style={styles.emptyText}>No hay asignaturas programadas en tu agenda para esta fecha.</Text>
          </View>
        )}
      </ScrollView>

      {/* Botón flotante para buscar fecha específica */}
      <Pressable
        style={styles.floatingSearchButton}
        onPress={() => setIsSearchModalVisible(true)}
      >
        <Ionicons name="search" size={28} color="#ffffff" />
      </Pressable>

      {/* Modal de búsqueda/salto a fecha específica */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSearchModalVisible}
        onRequestClose={() => setIsSearchModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buscar Fecha Específica</Text>
              <Pressable onPress={() => setIsSearchModalVisible(false)}>
                <Ionicons name="close" size={28} color="#111E38" />
              </Pressable>
            </View>
            <Text style={styles.modalSubtitle}>Ingresa la fecha a la que deseas saltar:</Text>
            
            {/* Input de Fecha estilo casillas */}
            <View style={styles.inputsRow}>
              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>Día</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={searchDay}
                  onChangeText={setSearchDay}
                  placeholder="DD"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>Mes</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={searchMonth}
                  onChangeText={setSearchMonth}
                  placeholder="MM"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>Año</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="number-pad"
                  maxLength={4}
                  value={searchYear}
                  onChangeText={setSearchYear}
                  placeholder="AAAA"
                />
              </View>
            </View>

            {/* Acciones de búsqueda */}
            <Pressable style={styles.modalSearchButton} onPress={handleSearchDate}>
              <Text style={styles.modalSearchButtonText}>Saltar a Fecha</Text>
            </Pressable>

            <Pressable style={styles.modalTodayButton} onPress={handleGoToToday}>
              <Text style={styles.modalTodayButtonText}>Ir al Día de Hoy</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MODAL DETALLES DE CLASE / MATERIA (INTERACTIVO POR CLASE SELECCIONADA) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedClass !== null}
        onRequestClose={() => setSelectedClass(null)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingContainer}
            >
              <View style={styles.classModalContent}>
                {/* Cabecera del Modal */}
                <View style={styles.classModalHeader}>
                  <Text style={styles.classModalSubtitle}>
                    {role !== 'estudiante'
                      ? 'DETALLES DE LA MATERIA'
                      : selectedClass?.status === 'absent'
                      ? 'INASISTENCIA REGISTRADA'
                      : selectedClass?.status === 'completed'
                      ? 'ASISTENCIA CONFIRMADA'
                      : 'DETALLES DE LA MATERIA'}
                  </Text>
                  <Pressable
                    style={styles.classModalCloseButton}
                    onPress={() => setSelectedClass(null)}
                  >
                    <Ionicons name="close" size={24} color="#000000" />
                  </Pressable>
                </View>

                {/* Nombre de la materia (Grande, se ajusta dinámicamente) */}
                <Text
                  style={[
                    styles.classModalTitle,
                    selectedClass && selectedClass.title.length > 12 && styles.classModalTitleSmall,
                  ]}
                >
                  {selectedClass?.title?.toUpperCase()}
                </Text>

                {/* Datos detallados estructurados */}
                <View style={styles.classDetailsList}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Agendado</Text>
                    <Text style={styles.detailValue}>{selectedClass?.agendaText}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Ubicación</Text>
                    <Text style={styles.detailValue}>{selectedClass?.location}</Text>
                  </View>
                  <View style={[styles.detailRow, styles.noBorder]}>
                    <Text style={styles.detailLabel}>Profesor</Text>
                    <View style={styles.profesorCol}>
                      <Text style={styles.profesorName}>{selectedClass?.profesor}</Text>
                      <Text style={styles.profesorEmail}>{selectedClass?.correo}</Text>
                    </View>
                  </View>
                </View>

                {/* VARIACIÓN 1: ASISTENCIA REGISTRADA (Completado - Solo Estudiante) */}
                {role === 'estudiante' && selectedClass?.status === 'completed' && (
                  <View style={styles.successBox}>
                    <Ionicons name="checkmark-circle-outline" size={36} color="#4CAF50" />
                    <Text style={styles.successBoxText}>
                      Asistencia registrada correctamente el día {selectedDate.split('-')[2]} de Junio de 2026.
                    </Text>
                  </View>
                )}

                {/* VARIACIÓN 2: MATERIA QUE AÚN NO PASA / DETALLES DE MATERIA (Para Docentes o Pendientes de Alumno) */}
                {(role !== 'estudiante' || selectedClass?.status === 'pending') && (
                  <View style={styles.summaryBox}>
                    <Text style={styles.summaryTitle}>Resumen General de la Materia</Text>
                    <Text style={styles.summaryText}>
                      {selectedClass?.resumen ||
                        'Información general de la clase. Los alumnos inscritos en este horario deberán presentarse en la ubicación asignada.'}
                    </Text>
                  </View>
                )}

                {/* VARIACIÓN 3: INASISTENCIA (Solo Estudiante) */}
                {role === 'estudiante' && selectedClass?.status === 'absent' && (
                  <View style={styles.justificanteWrapper}>
                    {/* Caja de adjuntar justificante */}
                    <Pressable
                      style={[
                        styles.attachmentBox,
                        justificanteAdjunto !== null && styles.attachmentBoxActive,
                      ]}
                      onPress={handleAdjuntarJustificante}
                    >
                      {justificanteAdjunto ? (
                        <View style={styles.fileSelectedContainer}>
                          <Ionicons name="document-text-sharp" size={32} color="#111E38" />
                          <Text style={styles.fileSelectedText}>{justificanteAdjunto}</Text>
                          <Text style={styles.removeFileText}>Toca para quitar</Text>
                        </View>
                      ) : (
                        <>
                          <Ionicons name="image-outline" size={48} color="#000000" />
                          <Text style={styles.attachmentTitle}>ADJUNTAR JUSTIFICANTE</Text>
                        </>
                      )}
                    </Pressable>

                    {/* Caja para mensaje */}
                    <View style={styles.messageBox}>
                      <Text style={styles.messageLabel}>Mensaje</Text>
                      <TextInput
                        style={styles.messageInput}
                        placeholder="ADJUNTAR MENSAJE..."
                        placeholderTextColor="#9CA3AF"
                        value={mensajeJustificante}
                        onChangeText={setMensajeJustificante}
                        multiline
                      />
                    </View>

                    {/* Botones de acción */}
                    <View style={styles.actionRow}>
                      <Pressable
                        style={styles.submitJustificanteButton}
                        onPress={handleEnviarJustificante}
                      >
                        <Text style={styles.submitJustificanteText}>ENVIAR JUSTIFICANTE</Text>
                      </Pressable>
                      <Pressable
                        style={styles.mailButton}
                        onPress={() => Alert.alert('Correo del Profesor', `Abriendo correo hacia ${selectedClass?.correo}`)}
                      >
                        <Ionicons name="mail-outline" size={24} color="#000000" />
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            </KeyboardAvoidingView>
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
  },
  adminContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  adminIcon: {
    marginBottom: 24,
    opacity: 0.8,
  },
  adminTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111E38',
    marginBottom: 12,
    textAlign: 'center',
  },
  adminSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  headerTextGroup: {
    flex: 1,
  },
  calendarTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111E38',
    letterSpacing: 0.5,
  },
  calendarSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  searchIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekSelectorWrapper: {
    backgroundColor: '#000000',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    paddingVertical: 16,
  },
  weekSelectorScrollContent: {
    paddingHorizontal: 12,
  },
  dayButton: {
    width: 58,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 16,
    marginHorizontal: 3,
  },
  dayButtonSelected: {
    backgroundColor: '#ffffff',
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  monthText: {
    fontSize: 9,
    fontWeight: '600',
  },
  textSelected: {
    color: '#000000',
  },
  textUnselected: {
    color: '#8E8E93',
  },
  classList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  classCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardStatusBar: {
    width: 6,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  classTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 6,
  },
  classTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111E38',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  statusIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111E38',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111E38',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  inputCol: {
    flex: 1,
    marginHorizontal: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    height: 48,
    fontSize: 16,
    textAlign: 'center',
    color: '#111E38',
    fontWeight: '600',
    backgroundColor: '#F9FAFB',
  },
  modalSearchButton: {
    backgroundColor: '#000000',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalSearchButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalTodayButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTodayButtonText: {
    color: '#4B5563',
    fontSize: 15,
    fontWeight: '600',
  },
  floatingSearchButton: {
    position: 'absolute',
    right: 24,
    bottom: Platform.OS === 'ios' ? 100 : 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 1000,
  },
  // ESTILOS DE MODALES DE CLASE / MATERIA
  classModalContent: {
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
  classModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  classModalSubtitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6B7280',
    letterSpacing: 1,
  },
  classModalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  classModalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 2,
    marginBottom: 20,
    marginTop: 4,
  },
  classModalTitleSmall: {
    fontSize: 16,
    letterSpacing: 1,
    lineHeight: 22,
  },
  keyboardAvoidingContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  classDetailsList: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111E38',
  },
  profesorCol: {
    alignItems: 'flex-end',
  },
  profesorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111E38',
  },
  profesorEmail: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  successBoxText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 12,
    lineHeight: 18,
  },
  summaryBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111E38',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  justificanteWrapper: {
    marginTop: 8,
  },
  attachmentBox: {
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    borderRadius: 16,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  attachmentBoxActive: {
    borderStyle: 'solid',
    borderColor: '#111E38',
    backgroundColor: '#F3F4F6',
  },
  attachmentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  fileSelectedContainer: {
    alignItems: 'center',
  },
  fileSelectedText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111E38',
    marginTop: 6,
  },
  removeFileText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '600',
  },
  messageBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#FAFAFA',
    marginBottom: 20,
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  messageInput: {
    fontSize: 13,
    color: '#000000',
    height: 48,
    textAlignVertical: 'top',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  submitJustificanteButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  submitJustificanteText: {
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
});
