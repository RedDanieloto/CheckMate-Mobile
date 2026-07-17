import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRole } from '@/context/RoleContext';

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
  const { role: currentRole, setIsSidebarOpen } = useRole();
  const insets = useSafeAreaInsets();

  // Datos mock por rol
  const roleData: Record<Role, RoleInfo> = {
    estudiante: {
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
        rightValue: '98%',
      },
    },
    administrador: {
      name: 'DIEGO MARADONA',
      avatar: '👨‍💼',
      fields: [
        { label: 'MATRICULA', value: '23170049' },
        { label: 'INSTITUCION', value: 'UTT', isLast: true },
      ],
      stats: {
        leftLabel: 'Alumnos Totales',
        leftValue: '2123',
        rightLabel: 'Asistencia General',
        rightValue: '98%',
      },
    },
    profesor_tutor: {
      name: 'DIEGO MARADONA',
      avatar: '👨‍🏫',
      fields: [
        { label: 'MATRICULA', value: '23170049' },
        { label: 'INSTITUCION', value: 'UTT' },
        { label: 'GRUPO TUTADO', value: '9no "A"' },
        { label: 'JEFA DIRECTA', value: 'Maria Becerra', isLast: true },
      ],
      stats: {
        leftLabel: 'Alumnos Tutados',
        leftValue: '31',
        rightLabel: 'Asistencia General',
        rightValue: '98%',
      },
    },
    profesor: {
      name: 'DIEGO MARADONA',
      avatar: '👨‍🏫',
      fields: [
        { label: 'MATRICULA', value: '23170049' },
        { label: 'INSTITUCION', value: 'UTT' },
        { label: 'JEFA DIRECTA', value: 'Maria Becerra', isLast: true },
      ],
      stats: {
        leftLabel: 'Grupos Asignados',
        leftValue: '5',
        rightLabel: 'Asistencia General',
        rightValue: '98%',
      },
    },
  };

  const data = roleData[currentRole];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
      >
        {/* Cabecera Blanca superior */}
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
          {/* Botón de Menú */}
          <View style={styles.topRow}>
            <Pressable style={styles.menuButton} onPress={() => setIsSidebarOpen(true)}>
              <Ionicons name="menu-outline" size={32} color="#000000" />
            </Pressable>
          </View>


          {/* Nombre y Avatar */}
          <View style={styles.profileHeaderContent}>
            <Text style={styles.userName}>{data.name}</Text>
            <View style={styles.avatarWrapper}>
              <Text style={styles.avatarEmoji}>{data.avatar}</Text>
            </View>
          </View>
        </View>

        {/* Contenido Inferior Gris */}
        <View style={styles.detailsContainer}>
          {/* Tarjeta de Datos del Perfil */}
          <View style={styles.infoCard}>
            {data.fields.map((field, idx) => (
              <FieldRow
                key={field.label}
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
    justifyContent: 'flex-end',
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
});
