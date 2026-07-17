import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRole } from '../../context/RoleContext';

interface Contacto {
  id: string;
  nombre: string;
  iniciales: string;
  cargo: string;
  email: string;
}

export default function ContactosScreen() {
  const { showContactos, setShowContactos } = useRole();
  const insets = useSafeAreaInsets();

  if (!showContactos) return null;

  // Directorio de contactos del campus
  const contactos: Contacto[] = [
    {
      id: '1',
      nombre: 'Igmar Salazar',
      iniciales: 'IS',
      cargo: 'Tutor Escolar / Docente de Extracción de Datos',
      email: 'igmar.salazar@uttcampus.edu.mx',
    },
    {
      id: '2',
      nombre: 'Julian Quiñones',
      iniciales: 'JQ',
      cargo: 'Docente de Dispositivos Inteligentes',
      email: 'j.quinones@uttcampus.edu.mx',
    },
    {
      id: '3',
      nombre: 'José Perez',
      iniciales: 'JP',
      cargo: 'Docente de Programación Móvil',
      email: 'j.perez@uttcampus.edu.mx',
    },
    {
      id: '4',
      nombre: 'Mónica Beltrán',
      iniciales: 'MB',
      cargo: 'Coordinadora de Carrera e Idiomas',
      email: 'm.beltran@uttcampus.edu.mx',
    },
    {
      id: '5',
      nombre: 'Administración CheckMate',
      iniciales: 'AC',
      cargo: 'Soporte y Control Escolar General',
      email: 'soporte.checkmate@uttcampus.edu.mx',
    },
  ];

  const handleSendEmail = (email: string, name: string) => {
    const url = `mailto:${email}?subject=Consulta CheckMate Student`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert(
            'Servicio no disponible',
            `No hay una aplicación de correo configurada para enviar correos de forma automática.\n\nPor favor escribe a: ${email}`
          );
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => {
        Alert.alert('Error', 'No se pudo redirigir a la aplicación de correo.');
      });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Cabecera */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => setShowContactos(false)}
        >
          <Ionicons name="arrow-back-outline" size={28} color="#111E38" />
        </Pressable>
      </View>

      <Text style={styles.title}>Contactos</Text>
      <View style={styles.divider} />

      {/* Listado de Contactos */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {contactos.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardLeft}>
              {/* Avatar circular con Iniciales */}
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{item.iniciales}</Text>
              </View>
              
              {/* Información */}
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.nombre}</Text>
                <Text style={styles.cardCargo}>{item.cargo}</Text>
                <Text style={styles.cardEmail}>{item.email}</Text>
              </View>
            </View>

            {/* Botón de Correo Directo */}
            <Pressable
              style={styles.mailButton}
              onPress={() => handleSendEmail(item.email, item.nombre)}
            >
              <Ionicons name="mail-outline" size={20} color="#111E38" />
            </Pressable>
          </View>
        ))}
      </ScrollView>
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
    marginRight: 10,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111E38', // Fondo marino corporativo
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111E38',
    marginBottom: 4,
  },
  cardCargo: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 16,
  },
  cardEmail: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  mailButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
