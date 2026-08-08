import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useRole } from '@/context/RoleContext';
import { studentService } from '@/services/studentService';
import { teacherService } from '@/services/teacherService';
import { StudentProfile } from '@/types/student';

type Role = 'estudiante' | 'administrador' | 'profesor_tutor' | 'profesor';

interface ProfileField {
  label: string;
  value: string;
  subValue?: string;
  isLast?: boolean;
}

interface RoleInfo {
  name: string;
  avatar: string;
  fields: ProfileField[];
  stats: {
    leftLabel: string;
    leftValue: string;
    rightLabel: string;
    rightValue: string;
  };
}

interface FieldRowProps {
  label: string;
  value: string;
  subValue?: string;
  isLast?: boolean;
}

const FieldRow = ({ label, value, subValue, isLast }: FieldRowProps) => {
  return (
    <View style={[styles.fieldRow, isLast && styles.noBorder]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValueContainer}>
        <Text style={styles.fieldValue}>{value}</Text>
        {subValue && <Text style={styles.fieldSubValue}>{subValue}</Text>}
      </View>
    </View>
  );
};

export default function ProfileScreen() {
  const { role: currentRole, userProfile, setIsSidebarOpen, setShowNotifications } = useRole();
  const insets = useSafeAreaInsets();

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [teacherGroupsCount, setTeacherGroupsCount] = useState<number>(0);
  const [generalAttendancePercent, setGeneralAttendancePercent] = useState<number>(96);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      if (currentRole === 'estudiante' || (currentRole as string) === 'alumno') {
        const data = await studentService.getProfile();
        if (data) {
          setStudentProfile(data);
          if (data.photo && (data.photo.startsWith('http') || data.photo.startsWith('file'))) {
            setProfilePhotoUri(data.photo);
          }
        }
        const subjects = await studentService.getSubjects();
        if (Array.isArray(subjects) && subjects.length > 0) {
          let totalOnTime = 0;
          let totalAll = 0;
          for (const sub of subjects) {
            try {
              const detail = await studentService.getSubjectDetail(sub.id);
              if (detail && detail.attendance_summary) {
                const { on_time, late, absent } = detail.attendance_summary;
                totalOnTime += (on_time + late);
                totalAll += (on_time + late + absent);
              }
            } catch {}
          }
          if (totalAll > 0) {
            setGeneralAttendancePercent(Math.round((totalOnTime / totalAll) * 100));
          }
        }
      } else if (currentRole === 'profesor' || currentRole === 'profesor_tutor') {
        const groups = await teacherService.getGroups();
        if (Array.isArray(groups)) {
          setTeacherGroupsCount(groups.length);
          let totalStudentsCount = 0;
          let sumAttendancePercent = 0;
          for (const g of groups) {
            try {
              const students = await teacherService.getGroupStudents(g.id);
              if (Array.isArray(students) && students.length > 0) {
                totalStudentsCount += students.length;
                const groupAvg = students.reduce((acc: number, curr: any) => acc + (curr.attendance_percentage || 95), 0) / students.length;
                sumAttendancePercent += groupAvg * students.length;
              }
            } catch {}
          }
          if (totalStudentsCount > 0) {
            setGeneralAttendancePercent(Math.round(sumAttendancePercent / totalStudentsCount));
          }
        }
      }
    } catch (error) {
      console.warn('Error al cargar perfil de la API:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [currentRole]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permiso requerido', 'Se requiere acceso a la galería para cambiar tu foto de perfil.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets[0]?.uri) {
        setProfilePhotoUri(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.warn('Error al seleccionar la imagen:', error);
    }
  };

  // Construir información dinámica si viene de la API de Alumno
  const buildStudentDataFromApi = (profile: StudentProfile): RoleInfo => {
    const fullName = [profile.first_name, profile.second_name, profile.first_surname, profile.second_surname]
      .filter(Boolean)
      .join(' ')
      .toUpperCase();

    const grupoText = profile.group
      ? `${profile.group.grade}° "${profile.group.section}"`
      : 'Sin grupo';

    const carreraText = profile.career?.name || 'Sin carrera';

    return {
      name: fullName,
      avatar: '👨‍🎓',
      fields: [
        { label: 'CORREO', value: profile.email },
        { label: 'GRUPO', value: grupoText },
        { label: 'CARRERA', value: carreraText },
        { label: 'TELÉFONO', value: profile.phone || 'No registrado' },
        { label: 'FECHA NAC.', value: profile.birth_date || 'No registrada', isLast: true },
      ],
      stats: {
        leftLabel: 'Faltas en Total',
        leftValue: '0',
        rightLabel: 'Asistencia General',
        rightValue: `${generalAttendancePercent}%`,
      },
    };
  };

  // Datos mock por rol (fallback)
  const roleData: Record<Role, RoleInfo> = {
    estudiante: studentProfile
      ? buildStudentDataFromApi(studentProfile)
      : {
          name: 'WALTER BROWN JR',
          avatar: '👨‍🎓',
          fields: [
            { label: 'MATRICULA', value: '23170049' },
            { label: 'GRUPO', value: '1° "A"' },
            { label: 'TUTOR', value: 'Igmar Salazar', subValue: 'igmar.salazar@uttcampus.edu.mx' },
            { label: 'TUTOR ASIGNADO', value: 'Walter B.', isLast: true },
          ],
          stats: {
            leftLabel: 'Faltas en Total',
            leftValue: '2',
            rightLabel: 'Porcentaje de Asistencias',
            rightValue: `${generalAttendancePercent}%`,
          },
        },
    administrador: {
      name: userProfile?.name?.toUpperCase() || 'ADMINISTRADOR',
      avatar: '👨‍💼',
      fields: [
        { label: 'CORREO', value: userProfile?.email || 'admin@checkmate.test' },
        { label: 'INSTITUCION', value: 'UTT', isLast: true },
      ],
      stats: {
        leftLabel: 'Alumnos Totales',
        leftValue: '2123',
        rightLabel: 'Asistencia General',
        rightValue: `${generalAttendancePercent}%`,
      },
    },
    profesor_tutor: {
      name: userProfile?.name?.toUpperCase() || 'PROFESOR TUTOR',
      avatar: '👨‍🏫',
      fields: [
        { label: 'CORREO', value: userProfile?.email || 'tutor@checkmate.test' },
        { label: 'INSTITUCION', value: 'UTT' },
        { label: 'GRUPO TUTADO', value: '1° "A"' },
        { label: 'ROL', value: 'Profesor y Tutor', isLast: true },
      ],
      stats: {
        leftLabel: 'Alumnos Tutados',
        leftValue: '31',
        rightLabel: 'Asistencia General',
        rightValue: `${generalAttendancePercent}%`,
      },
    },
    profesor: {
      name: userProfile?.name?.toUpperCase() || 'CARLOS RAMIREZ LOPEZ',
      avatar: '👨‍🏫',
      fields: [
        { label: 'CORREO', value: userProfile?.email || 'teacher@checkmate.test' },
        { label: 'INSTITUCION', value: 'UTT' },
        { label: 'ROL', value: 'Profesor Docente', isLast: true },
      ],
      stats: {
        leftLabel: 'Grupos Asignados',
        leftValue: String(teacherGroupsCount),
        rightLabel: 'Asistencia General',
        rightValue: `${generalAttendancePercent}%`,
      },
    },
  };

  const data =
    studentProfile && (currentRole === 'estudiante' || (currentRole as string) === 'alumno')
      ? buildStudentDataFromApi(studentProfile)
      : (roleData[currentRole] || (studentProfile ? buildStudentDataFromApi(studentProfile) : roleData.estudiante));

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        bounces={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000000" />
        }
      >
        {/* Cabecera Blanca superior */}
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
          {/* Botón de Menú y Notificaciones */}
          <View style={styles.topRow}>
            <Pressable style={styles.notificationButton} onPress={() => setShowNotifications(true)}>
              <Ionicons name="notifications-outline" size={32} color="#000000" />
            </Pressable>
            <Pressable style={styles.menuButton} onPress={() => setIsSidebarOpen(true)}>
              <Ionicons name="menu-outline" size={32} color="#000000" />
            </Pressable>
          </View>

          {/* Nombre y Avatar */}
          <View style={styles.profileHeaderContent}>
            {isLoading && !studentProfile ? (
              <ActivityIndicator size="small" color="#000000" style={{ marginBottom: 16 }} />
            ) : (
              <Text style={styles.userName}>{data.name}</Text>
            )}
            <Pressable style={styles.avatarWrapper} onPress={handlePickImage}>
              {profilePhotoUri ? (
                <Image source={{ uri: profilePhotoUri }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarEmoji}>{data.avatar}</Text>
              )}
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={18} color="#ffffff" />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Contenido Inferior Gris */}
        <View style={styles.detailsContainer}>
          {/* Tarjeta de Datos del Perfil */}
          <View style={styles.infoCard}>
            {data.fields.map((field, idx) => (
              <FieldRow
                key={`${field.label}-${idx}`}
                label={field.label}
                value={field.value}
                subValue={field.subValue}
                isLast={field.isLast}
              />
            ))}
          </View>

          {/* Widgets Estadísticos Inferiores */}
          <View style={styles.statsRow}>
            <View style={styles.statBoxLeft}>
              <Text style={styles.statLabelLeft}>{data.stats.leftLabel}</Text>
              <Text style={styles.statValueLeft}>{data.stats.leftValue}</Text>
            </View>
            <View style={styles.statBoxRight}>
              <Text style={styles.statLabelRight}>{data.stats.rightLabel}</Text>
              <Text style={styles.statValueRight}>{data.stats.rightValue}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F3',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 48,
    alignItems: 'center',
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  roleSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F3',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    justifyContent: 'space-between',
  },
  roleTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  roleTabActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  roleTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8e8e93',
  },
  roleTabTextActive: {
    color: '#000000',
  },
  profileHeaderContent: {
    alignItems: 'center',
    marginTop: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  avatarWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FDF1BA',
    borderWidth: 6,
    borderColor: '#E0E1E6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarEmoji: {
    fontSize: 80,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#000000',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  detailsContainer: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F3',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#60646C',
    letterSpacing: 0.5,
  },
  fieldValueContainer: {
    alignItems: 'flex-end',
    maxWidth: '70%',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'right',
  },
  fieldSubValue: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 2,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  statBoxLeft: {
    width: '47%',
    backgroundColor: '#EBEBEF',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    minHeight: 90,
  },
  statBoxRight: {
    width: '47%',
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    minHeight: 90,
  },
  statLabelLeft: {
    fontSize: 11,
    fontWeight: '600',
    color: '#60646C',
  },
  statLabelRight: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B0B4BA',
  },
  statValueLeft: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
  },
  statValueRight: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
  },
    notificationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
});
