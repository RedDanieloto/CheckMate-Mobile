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
import { useRole } from '../../context/RoleContext';

interface Siniestro {
  id: string;
  titulo: string;
  ubicacion: string;
  fecha: string;
  diaSemana: string;
  estado: 'FINALIZADO' | 'EN CURSO';
  victimas: number;
  heridos: number;
  mensaje: string;
}

export default function HistorialSiniestrosScreen() {
  const { showHistorialSiniestros, setShowHistorialSiniestros, role } = useRole();
  const insets = useSafeAreaInsets();

  const [siniestros, setSiniestros] = useState<Siniestro[]>([
    {
      id: '1',
      titulo: 'BALACERA ESTUDIANTIL',
      ubicacion: 'Poliforum UTT',
      fecha: '03/06/2026',
      diaSemana: 'Mie',
      estado: 'FINALIZADO',
      victimas: 1,
      heridos: 2,
      mensaje: 'Fuerte balacera',
    },
  ]);

  const [selectedSiniestro, setSelectedSiniestro] = useState<Siniestro | null>(null);

  // Exclusión del módulo para roles que no sean el administrador
  if (!showHistorialSiniestros || role !== 'administrador') return null;

  const handleBackPress = () => {
    setShowHistorialSiniestros(false);
  };

  const handleBorrarSiniestro = (id: string, name: string) => {
    Alert.alert(
      'Borrar Siniestro',
      `¿Estás seguro de que deseas eliminar permanentemente el registro de "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setSiniestros(prev => prev.filter(s => s.id !== id));
            setSelectedSiniestro(null);
            Alert.alert('Eliminado', 'El registro del siniestro ha sido eliminado con éxito.');
          },
        },
      ]
    );
  };

  const totalSiniestros = siniestros.length;
  const enCursoSiniestros = siniestros.filter(s => s.estado === 'EN CURSO').length;
  const finalizadosSiniestros = siniestros.filter(s => s.estado === 'FINALIZADO').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Cabecera */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back-outline" size={28} color="#111E38" />
        </Pressable>
      </View>

      <Text style={styles.title}>Historial de Siniestros</Text>
      <View style={styles.divider} />

      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {siniestros.length > 0 ? (
          siniestros.map((item) => (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={() => setSelectedSiniestro(item)}
            >
              <View style={styles.cardLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name="document-text-outline" size={24} color="#6B7280" />
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.titleBadgeRow}>
                    <Text style={styles.cardTitle}>{item.titulo}</Text>
                    <View style={styles.tagFinalizado}>
                      <Text style={styles.tagFinalizadoText}>{item.estado}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardDesc}>{item.ubicacion}</Text>
                  
                  <View style={styles.dateRow}>
                    <Ionicons name="calendar-outline" size={14} color="#9CA3AF" style={{ marginRight: 4 }} />
                    <Text style={styles.dateText}>{item.fecha}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={56} color="#9CA3AF" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyText}>No hay siniestros registrados en el historial.</Text>
          </View>
        )}
      </ScrollView>

      {/* Barra de Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={[styles.statBox, styles.statBoxTotal]}>
          <Text style={styles.statLabel}>TOTAL</Text>
          <Text style={styles.statValue}>{totalSiniestros}</Text>
        </View>
        
        <View style={[styles.statBox, styles.statBoxCurso]}>
          <Text style={styles.statLabel}>EN CURSO</Text>
          <Text style={styles.statValue}>{enCursoSiniestros}</Text>
        </View>

        <View style={[styles.statBox, styles.statBoxFinalizado]}>
          <Text style={styles.statLabel}>FINALIZADOS</Text>
          <Text style={styles.statValue}>{finalizadosSiniestros}</Text>
        </View>
      </View>

      {/* MODAL DETALLES DEL SINIESTRO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedSiniestro !== null}
        onRequestClose={() => setSelectedSiniestro(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Cabecera del modal */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalSubHeader}>SINIESTRO REGISTRADO</Text>
                <Text style={styles.modalTitle}>{selectedSiniestro?.titulo}</Text>
              </View>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setSelectedSiniestro(null)}
              >
                <Ionicons name="close" size={24} color="#000000" />
              </Pressable>
            </View>

            {/* Fila de campos informativos */}
            <View style={styles.modalInfoList}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha</Text>
                <Text style={styles.infoValue}>
                  {selectedSiniestro?.diaSemana} • {selectedSiniestro?.fecha}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ubicacion</Text>
                <Text style={styles.infoValue}>{selectedSiniestro?.ubicacion}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estado</Text>
                <View style={styles.tagFinalizadoModal}>
                  <Text style={styles.tagFinalizadoModalText}>{selectedSiniestro?.estado}</Text>
                </View>
              </View>
            </View>

            {/* Cajas de Conteo horizontales (Victimas y Heridos) */}
            <View style={styles.conteoRow}>
              <View style={[styles.conteoBox, styles.conteoBoxVictimas]}>
                <Text style={styles.conteoLabel}>VICTIMAS</Text>
                <Text style={styles.conteoValue}>{selectedSiniestro?.victimas}</Text>
                <View style={styles.redBar} />
              </View>

              <View style={[styles.conteoBox, styles.conteoBoxHeridos]}>
                <Text style={styles.conteoLabel}>HERIDOS</Text>
                <Text style={styles.conteoValue}>{selectedSiniestro?.heridos}</Text>
                <View style={styles.yellowBar} />
              </View>
            </View>

            {/* Mensaje descriptivo */}
            <View style={styles.messageBox}>
              <Text style={styles.messageTitle}>Mensaje</Text>
              <Text style={styles.messageContent}>{selectedSiniestro?.mensaje}</Text>
            </View>

            {/* Botón Borrar Siniestro */}
            <Pressable
              style={styles.btnBorrar}
              onPress={() => selectedSiniestro && handleBorrarSiniestro(selectedSiniestro.id, selectedSiniestro.titulo)}
            >
              <Text style={styles.btnBorrarText}>BORRAR SINIESTRO</Text>
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
    position: 'absolute',
    top: 0,
    bottom: Platform.OS === 'ios' ? 88 : 68, // Respeta el TabBar inferior
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
    paddingBottom: 24,
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
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111E38',
    flex: 1,
    marginRight: 8,
  },
  tagFinalizado: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagFinalizadoText: {
    color: '#16A34A',
    fontSize: 9,
    fontWeight: 'bold',
  },
  cardDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    borderBottomWidth: 3,
  },
  statBoxTotal: {
    borderBottomColor: '#6B7280',
  },
  statBoxCurso: {
    borderBottomColor: '#F59E0B',
  },
  statBoxFinalizado: {
    borderBottomColor: '#10B981',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111E38',
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
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalSubHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111E38',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInfoList: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 13,
    color: '#111E38',
    fontWeight: '600',
  },
  tagFinalizadoModal: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagFinalizadoModalText: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: 'bold',
  },
  conteoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  conteoBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  conteoBoxVictimas: {
    //
  },
  conteoBoxHeridos: {
    //
  },
  conteoLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 4,
  },
  conteoValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111E38',
    marginBottom: 4,
  },
  redBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#EF4444',
  },
  yellowBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FBBF24',
  },
  messageBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  messageTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 6,
  },
  messageContent: {
    fontSize: 13,
    color: '#111E38',
    lineHeight: 18,
  },
  btnBorrar: {
    height: 48,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBorrarText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
