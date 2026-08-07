import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Platform, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useRole } from '@/context/RoleContext';
import { studentService } from '@/services/studentService';
import { nfcService } from '@/services/nfcService';
import { StudentProfile } from '@/types/student';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { role, setIsSidebarOpen, setShowNotifications } = useRole();
  const [showCredencial, setShowCredencial] = useState(false);
  // const [viewMode, setViewMode] = useState<'card' | 'qr'>('card'); // Comentado temporalmente
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNfcSupported, setIsNfcSupported] = useState<boolean>(true);
  const [isNfcEnabled, setIsNfcEnabled] = useState<boolean>(true);

  const fetchProfile = useCallback(async () => {
    if (role !== 'estudiante') return;
    setIsLoading(true);
    try {
      const data = await studentService.getProfile();
      if (data) {
        setStudentProfile(data);
      }
    } catch (error) {
      console.warn('Error al obtener perfil para credencial:', error);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  const checkNfcStatus = useCallback(async () => {
    const supported = await nfcService.isSupported();
    setIsNfcSupported(supported);
    if (supported) {
      await nfcService.init();
      const enabled = await nfcService.isEnabled();
      setIsNfcEnabled(enabled);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      checkNfcStatus();
    }, [fetchProfile, checkNfcStatus])
  );

  const handleNfcAction = async () => {
    if (!isNfcEnabled && Platform.OS === 'android') {
      await nfcService.goToNfcSettings();
      // Re-verificar tras volver de ajustes
      setTimeout(checkNfcStatus, 1500);
    }
  };

  const getStudentFullName = (): string => {
    if (!studentProfile) return 'WALTER BROWN';
    return [studentProfile.first_name, studentProfile.second_name, studentProfile.first_surname, studentProfile.second_surname]
      .filter(Boolean)
      .join(' ')
      .toUpperCase();
  };

  const getStudentGroup = (): string => {
    if (!studentProfile?.group) return '1° "A"';
    return `${studentProfile.group.grade}° "${studentProfile.group.section}"`;
  };

  const getStudentCareer = (): string => {
    return studentProfile?.career?.name || 'Ingeniería en Tecnologías de la Información';
  };

  // Si está en modo de ver credencial (estudiante, profesor o tutor)
  if (showCredencial && (role === 'estudiante' || role === 'profesor' || role === 'profesor_tutor')) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerWithBack, { paddingTop: insets.top }]}>
          <Pressable style={styles.menuButtonLeft} onPress={() => setShowCredencial(false)}>
            <Ionicons name="arrow-back-outline" size={30} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>Credencial Digital NFC</Text>
          <Pressable style={styles.menuButton} onPress={() => setIsSidebarOpen(true)}>
            <Ionicons name="menu-outline" size={32} color="#000000" />
          </Pressable>
        </View>

        {/* Diseñó de la Tarjeta Credencial NFC Estilo Wallet */}
        <View style={styles.credencialContent}>
          <View style={styles.nfcCard}>
            {/* Banda Header de la Tarjeta */}
            <View style={styles.cardHeader}>
              <View style={styles.brandRow}>
                <Ionicons name="school" size={22} color="#ffffff" />
                <Text style={styles.cardBrandTitle}>CHECKMATE ID</Text>
              </View>
              <View style={[styles.nfcBadgeHeader, !isNfcEnabled && styles.nfcBadgeHeaderDisabled]}>
                <Ionicons
                  name="wifi-outline"
                  size={18}
                  color={isNfcEnabled ? '#00BCFF' : '#FF9800'}
                  style={{ transform: [{ rotate: '90deg' }] }}
                />
                <Text style={[styles.nfcHeaderLabel, !isNfcEnabled && { color: '#FF9800' }]}>
                  {Platform.OS === 'android' ? (isNfcEnabled ? 'NFC HCE ACTIVE' : 'NFC OFF') : 'NFC READY'}
                </Text>
              </View>
            </View>

            {/* Cuerpo de la Tarjeta */}
            <View style={styles.cardBody}>
              <View style={styles.avatarSection}>
                {studentProfile?.photo && (studentProfile.photo.startsWith('http') || studentProfile.photo.startsWith('file')) ? (
                  <Image source={{ uri: studentProfile.photo }} style={styles.cardAvatarImage} />
                ) : (
                  <View style={styles.cardAvatarFallback}>
                    <Text style={styles.cardAvatarEmoji}>👨‍🎓</Text>
                  </View>
                )}
                <View style={styles.chipGraphic}>
                  <Ionicons name="hardware-chip-outline" size={32} color="#D4AF37" />
                </View>
              </View>

              <View style={styles.infoSection}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" style={{ marginVertical: 8 }} />
                ) : (
                  <Text style={styles.studentNameText} numberOfLines={2}>
                    {getStudentFullName()}
                  </Text>
                )}

                <View style={styles.metaRow}>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>GRUPO</Text>
                    <Text style={styles.metaValue}>{getStudentGroup()}</Text>
                  </View>
                  <View style={styles.metaColRight}>
                    <Text style={styles.metaLabel}>ESTADO</Text>
                    <Text style={styles.metaValueActive}>ACTIVO</Text>
                  </View>
                </View>

                <View style={styles.careerRow}>
                  <Text style={styles.metaLabel}>CARRERA</Text>
                  <Text style={styles.careerValue} numberOfLines={1}>
                    {getStudentCareer()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Pie de Tarjeta NFC */}
            <Pressable
              style={[styles.cardFooter, !isNfcEnabled && styles.cardFooterWarning]}
              onPress={handleNfcAction}
            >
              <Ionicons
                name={isNfcEnabled ? 'radio-outline' : 'warning-outline'}
                size={20}
                color={isNfcEnabled ? '#00BCFF' : '#FF9800'}
              />
              <Text style={[styles.nfcFooterText, !isNfcEnabled && { color: '#FF9800' }]}>
                {Platform.OS === 'android'
                  ? isNfcEnabled
                    ? 'NFC Activo — Acerca tu teléfono al lector del profesor'
                    : 'NFC Desactivado — Toca aquí para activarlo en ajustes'
                  : 'NFC listo para escaneo de asistencia'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 
        ============================================================
        BOTÓN FLOTANTE CÓDIGO QR (COMENTADO TEMPORALMENTE)
        ============================================================
        <View style={styles.qrContainer}>
          <Pressable style={styles.qrButton} onPress={() => setViewMode(viewMode === 'card' ? 'qr' : 'card')}>
            <Ionicons name={viewMode === 'card' ? 'qr-code-outline' : 'card-outline'} size={36} color="#000000" />
          </Pressable>
        </View>
        */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con notificaciones a la izquierda y hamburguesa a la derecha */}
      <View style={[styles.headerWithNotifications, { paddingTop: insets.top }]}>
        <Pressable style={styles.notificationButton} onPress={() => setShowNotifications(true)}>
          <Ionicons name="notifications-outline" size={32} color="#000000" />
        </Pressable>
        <Pressable style={styles.menuButton} onPress={() => setIsSidebarOpen(true)}>
          <Ionicons name="menu-outline" size={36} color="#000000" />
        </Pressable>
      </View>

      {/* Contenido Principal Centrado */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Bienvenido a{'\n'}CheckMate
        </Text>
      </View>

      {/* Botón flotante para credencial de alumno */}
      {(role === 'estudiante' || role === 'profesor' || role === 'profesor_tutor') && (
        <View style={styles.credencialContainer}>
          <Pressable style={styles.credencialButton} onPress={() => setShowCredencial(true)}>
            <Ionicons name="card-outline" size={36} color="#000000" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerWithBack: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 90,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerWithNotifications: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 100,
    alignItems: 'center',
  },
  menuButtonLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  notificationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: -80,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 42,
  },
  credencialContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 150,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  credencialButton: {
    borderRadius: 35,
    width: 70,
    height: 70,
    backgroundColor: '#00BCFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  credencialContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -40,
  },
  nfcCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#161922',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#2A2E3D',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2E3D',
    paddingBottom: 14,
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBrandTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
    letterSpacing: 1,
  },
  nfcBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D2738',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00BCFF44',
  },
  nfcBadgeHeaderDisabled: {
    backgroundColor: '#2A1F0D',
    borderColor: '#FF980044',
  },
  nfcHeaderLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00BCFF',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginRight: 16,
  },
  cardAvatarImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: '#00BCFF',
  },
  cardAvatarFallback: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#FDF1BA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#00BCFF',
  },
  cardAvatarEmoji: {
    fontSize: 44,
  },
  chipGraphic: {
    marginTop: 8,
  },
  infoSection: {
    flex: 1,
  },
  studentNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaCol: {
    flex: 1,
  },
  metaColRight: {
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7E8494',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 2,
  },
  metaValueActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
    marginTop: 2,
  },
  careerRow: {
    marginTop: 2,
  },
  careerValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#E0E1E6',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D2232',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#00BCFF33',
  },
  cardFooterWarning: {
    backgroundColor: '#2A1F0D',
    borderColor: '#FF980044',
  },
  nfcFooterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00BCFF',
    marginLeft: 8,
    textAlign: 'center',
  },
  /* 
  ============================================================
  ESTILOS BOTÓN QR (COMENTADOS TEMPORALMENTE)
  ============================================================
  qrContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 150,
    alignSelf: 'center',
    zIndex: 1000,
  },
  qrButton: {
    borderRadius: 35,
    width: 70,
    height: 70,
    backgroundColor: '#00BCFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  */
});

