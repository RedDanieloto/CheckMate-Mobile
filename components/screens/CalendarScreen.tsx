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
  status: 'completed' | 'pending';
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { role } = useRole();

  // Fecha base inicial (3 de junio de 2026 para coincidir con el mockup inicial por defecto)
  const [baseDate, setBaseDate] = useState<Date>(new Date('2026-06-03T12:00:00'));
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-03');

  // Estados para el buscador de fecha modal
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
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
      // Cada item del día mide aproximadamente 64px de ancho (ancho del botón + margen)
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

  // Datos mock de clases por rol y fecha
  const getClasses = (currentRole: Role, date: string): ClassItem[] => {
    if (currentRole === 'administrador') return [];

    // Clases del miércoles 3 de junio de 2026 (Mock principal de diseño)
    if (date === '2026-06-03') {
      if (currentRole === 'estudiante') {
        return [
          {
            id: '1',
            time: '07:00 - 09:00',
            title: 'Extracción de Datos',
            location: 'Aula 17 • Edificio B',
            status: 'completed',
          },
          {
            id: '2',
            time: '09:00 - 11:00',
            title: 'Extracción de Datos',
            location: 'Aula 13 • Edificio B',
            status: 'completed',
          },
          {
            id: '3',
            time: '13:00 - 15:00',
            title: 'Extracción de Datos',
            location: 'Aula 14 • Edificio B',
            status: 'pending',
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
          },
          {
            id: '2',
            time: '09:00 - 11:00',
            title: 'Extracción de Datos - Gpo B',
            location: 'Aula 13 • Edificio B',
            status: 'completed',
          },
          {
            id: '3',
            time: '11:00 - 13:00',
            title: 'Asesoría / Tutoría Individual',
            location: 'Cubículo 4 • Edificio A',
            status: 'completed',
          },
          {
            id: '4',
            time: '13:00 - 15:00',
            title: 'Programación Móvil - Gpo A',
            location: 'Laboratorio de Cómputo 3',
            status: 'pending',
          },
        ];
      }
    }

    // Para cualquier otro día, retornamos vacío indicando que no hay clases
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
            <View key={item.id} style={styles.classCard}>
              {/* Barra lateral de estado */}
              <View
                style={[
                  styles.cardStatusBar,
                  { backgroundColor: item.status === 'completed' ? '#000000' : '#CCCCCC' },
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
                  {item.status === 'completed' ? (
                    <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
                  ) : (
                    <Ionicons name="time-outline" size={32} color="#CCCCCC" />
                  )}
                </View>
              </View>
            </View>
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
    bottom: Platform.OS === 'ios' ? 100 : 80, // Ubicado estratégicamente arriba del selector de roles
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
});
