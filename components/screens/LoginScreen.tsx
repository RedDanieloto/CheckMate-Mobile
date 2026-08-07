import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authService } from '@/services/authService';
import { useRole } from '@/context/RoleContext';


interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setRole } = useRole();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atención', 'Por favor, ingresa tu correo electrónico y contraseña.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await authService.login({
        email: email.trim(),
        password: password.trim(),
        device_name: 'checkmate-mobile',
      });

      // Asignar el rol del usuario automáticamente en el contexto
      const userRole = (response as any)?.data?.user?.role || response.user?.role;
      if (userRole === 'alumno' || userRole === 'estudiante') {
        setRole('estudiante');
      } else if (userRole === 'administrator' || userRole === 'career_director') {
        setRole('administrador');
      } else if (userRole === 'profesor_tutor' || userRole === 'tutor_academico') {
        setRole('profesor_tutor');
      } else if (userRole === 'profesor') {
        setRole('profesor');
      }

      onLogin();
    } catch (error: any) {
      const msg = error?.message || 'Error al conectar con la API de autenticación.';
      setErrorMessage(msg);
      Alert.alert('Error de inicio de sesión', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Sección de la Imagen con Altura Dinámica */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/school_entrance.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Tarjeta de Formulario de Login */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Ingresa tus datos para continuar.</Text>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={18} color="#D32F2F" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Input de Correo / Matrícula */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#60646C" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#B0B4BA"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* Input de Contraseña */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#60646C" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#B0B4BA"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* Botón Iniciar Sesión */}
          <Pressable
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    width: '100%',
    height: screenHeight * 0.60,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerButtonContainer: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32, // Solapa sobre la imagen
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 32,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#60646C',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    width: '100%',
    maxWidth: 340,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E1E6',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#000000',
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    maxWidth: 340,
    height: 50,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonDisabled: {
    backgroundColor: '#666666',
    opacity: 0.8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

