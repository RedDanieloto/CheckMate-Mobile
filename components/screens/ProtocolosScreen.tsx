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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRole } from '../../context/RoleContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_CONTAINER_WIDTH = SCREEN_WIDTH - 80; // Ancho disponible de la tarjeta
const SWIPEABLE_WIDTH = SWIPE_CONTAINER_WIDTH - 64; // Rango de movimiento (descontando el botón de 48px y padding)

interface SwipeButtonProps {
  onActivate: () => void;
  color: string;
  bgBar: string;
  label: string;
}

// Componente interactivo deslizable de la barra
function SwipeButton({ onActivate, color, bgBar, label }: SwipeButtonProps) {
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        // Si se desliza más del 75% del recorrido, se activa el protocolo
        if (gestureState.dx >= SWIPEABLE_WIDTH * 0.75) {
          Animated.timing(pan, {
            toValue: SWIPEABLE_WIDTH,
            duration: 150,
            useNativeDriver: false,
          }).start(() => {
            onActivate();
            // Restablecer después de un pequeño retraso
            setTimeout(() => {
              Animated.spring(pan, {
                toValue: 0,
                useNativeDriver: false,
              }).start();
            }, 800);
          });
        } else {
          // Retroceder elásticamente si no completó el deslizamiento
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Limitar el movimiento del botón para que no se salga de la barra
  const translateX = pan.interpolate({
    inputRange: [0, SWIPEABLE_WIDTH],
    outputRange: [0, SWIPEABLE_WIDTH],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.swipeContainer, { backgroundColor: bgBar }]}>
      <Animated.View
        style={[
          styles.swipeHandle,
          { transform: [{ translateX }] }
        ]}
        {...panResponder.panHandlers}
      >
        <Ionicons name="chevron-forward-outline" size={20} color={color} />
      </Animated.View>
      <Text style={[styles.swipeText, { color }]}>{label}</Text>
    </View>
  );
}

interface Protocolo {
  id: string;
  titulo: string;
  descripcion: string;
  icono: any;
  colorTheme: string;
  bgCard: string;
  borderCard: string;
  bgBar: string;
}

export default function ProtocolosScreen() {
  const { showProtocolos, setShowProtocolos } = useRole();
  const insets = useSafeAreaInsets();
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(true);

  if (!showProtocolos) return null;

  const protocolos: Protocolo[] = [
    {
      id: '1',
      titulo: 'EMERGENCIA MÉDICA',
      descripcion: 'Atención inmediata requerida en el campus.',
      icono: 'medical-outline',
      colorTheme: '#4B5563',
      bgCard: '#F9FAFB',
      borderCard: '#E5E7EB',
      bgBar: '#E5E7EB',
    },
    {
      id: '2',
      titulo: 'ALERTA GENERAL',
      descripcion: 'Notificación de urgencia a toda la institución.',
      icono: 'warning-outline',
      colorTheme: '#1F2937',
      bgCard: '#F3F4F6',
      borderCard: '#D1D5DB',
      bgBar: '#D1D5DB',
    },
    {
      id: '3',
      titulo: 'TSUNAMI (Evacuación)',
      descripcion: 'Alerta de tsunami, evacuar a zonas altas de inmediato.',
      icono: 'water-outline',
      colorTheme: '#1D4ED8',
      bgCard: '#EFF6FF',
      borderCard: '#DBEAFE',
      bgBar: '#DBEAFE',
    },
    {
      id: '4',
      titulo: 'FUGA QUÍMICA (Resguardo)',
      descripcion: 'Nube tóxica detectada, resguardarse en aulas cerradas.',
      icono: 'skull-outline',
      colorTheme: '#B45309',
      bgCard: '#FEF9C3',
      borderCard: '#FEF08A',
      bgBar: '#FEF08A',
    },
    {
      id: '5',
      titulo: 'TERREMOTO (Protección)',
      descripcion: 'Sismo detectado, aplicar protocolo de repliegue.',
      icono: 'pulse-outline',
      colorTheme: '#047857',
      bgCard: '#F0FDF4',
      borderCard: '#DCFCE7',
      bgBar: '#DCFCE7',
    },
    {
      id: '6',
      titulo: 'INCENDIO (Evacuación)',
      descripcion: 'Fuego detectado, evacuar por las rutas seguras señaladas.',
      icono: 'flame-outline',
      colorTheme: '#B91C1C',
      bgCard: '#FEF2F2',
      borderCard: '#FEE2E2',
      bgBar: '#FEE2E2',
    },
  ];

  const handleActivarProtocolo = (titulo: string) => {
    Alert.alert(
      'Protocolo Activado',
      `La alerta de "${titulo}" ha sido transmitida de inmediato al Centro de Coordinación y a las brigadas de emergencia del campus.\n\nPor favor, mantén la calma y sigue las instrucciones del personal oficial.`,
      [{ text: 'ENTENDIDO', style: 'default' }]
    );
  };

  const handleCloseDisclaimer = () => {
    setIsDisclaimerVisible(false);
  };

  const handleCancelDisclaimer = () => {
    setIsDisclaimerVisible(false);
    setShowProtocolos(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Cabecera */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => setShowProtocolos(false)}
        >
          <Ionicons name="arrow-back-outline" size={28} color="#111E38" />
        </Pressable>
      </View>

      <Text style={styles.title}>Protocolos de Seguridad</Text>
      <View style={styles.divider} />

      {/* Listado de protocolos */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {protocolos.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              { backgroundColor: item.bgCard, borderColor: item.borderCard }
            ]}
          >
            {/* Cabecera de tarjeta */}
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icono} size={28} color={item.colorTheme} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, { color: item.colorTheme }]}>
                  {item.titulo}
                </Text>
                <Text style={styles.cardDesc}>{item.descripcion}</Text>
              </View>
            </View>

            {/* Slider de activación */}
            <SwipeButton
              color={item.colorTheme}
              bgBar={item.bgBar}
              label="DESLIZAR PARA ACTIVAR"
              onActivate={() => handleActivarProtocolo(item.titulo)}
            />
          </View>
        ))}
      </ScrollView>

      {/* MODAL DE DISCLAIMER INICIAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDisclaimerVisible}
        onRequestClose={handleCancelDisclaimer}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Cabecera del modal */}
            <View style={styles.modalHeaderClose}>
              <Text style={styles.modalSubtitle}>PROTOCOLO</Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={handleCancelDisclaimer}
              >
                <Ionicons name="close" size={24} color="#000000" />
              </Pressable>
            </View>

            <Text style={styles.modalTitleLarge}>Disclaimer</Text>

            {/* Caja de advertencia */}
            <ScrollView style={styles.disclaimerBox} showsVerticalScrollIndicator={true}>
              <Text style={styles.disclaimerText}>
                ATENCIÓN: Este módulo de protocolos de seguridad está diseñado exclusivamente para reportar y coordinar situaciones de emergencia reales dentro del campus escolar.
                {'\n\n'}
                La activación falsa, negligente o el uso indebido de estas alertas constituye una falta grave a los reglamentos de convivencia de la institución y será motivo de sanción administrativa y escolar por parte de las autoridades competentes.
                {'\n\n'}
                Al presionar CONTINUAR, declaras bajo tu total responsabilidad que comprendes el propósito de esta herramienta, te comprometes a hacer uso de ella únicamente ante incidentes severos comprobados y aceptas las políticas disciplinarias vigentes.
              </Text>
            </ScrollView>

            {/* Botón de Continuar */}
            <Pressable
              style={styles.submitButton}
              onPress={handleCloseDisclaimer}
            >
              <Text style={styles.submitButtonText}>CONTINUAR</Text>
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
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
  },
  swipeContainer: {
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    position: 'relative',
    justifyContent: 'center',
  },
  swipeHandle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 4,
    zIndex: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  swipeText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
    maxHeight: '80%',
  },
  modalHeaderClose: {
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
  modalTitleLarge: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111E38',
    marginBottom: 16,
  },
  disclaimerBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  disclaimerText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  submitButton: {
    height: 48,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
