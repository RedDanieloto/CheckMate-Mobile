import { Platform } from 'react-native';

// Importar dinámicamente únicamente en Android para evitar que Expo Go o iOS tiren error de NativeModule inexistente
let NfcManager: any = null;
let NfcTech: any = null;
let Ndef: any = null;

if (Platform.OS === 'android') {
  try {
    const nfcModule = require('react-native-nfc-manager');
    NfcManager = nfcModule.default || nfcModule;
    NfcTech = nfcModule.NfcTech;
    Ndef = nfcModule.Ndef;
  } catch (e) {
    // Si se ejecuta en Expo Go sin binario nativo compiliado
    NfcManager = null;
  }
}

export const nfcService = {
  /**
   * Inicializa el módulo de NFC en dispositivos compatibles (Android)
   */
  async init(): Promise<boolean> {
    if (Platform.OS !== 'android' || !NfcManager) return false;
    try {
      const isSupported = await NfcManager.isSupported();
      if (isSupported) {
        await NfcManager.start();
        return true;
      }
    } catch (error) {
      console.warn('NFC no soportado o deshabilitado en este dispositivo:', error);
    }
    return false;
  },

  /**
   * Verifica si el dispositivo soporta tecnología NFC
   */
  async isSupported(): Promise<boolean> {
    if (Platform.OS !== 'android' || !NfcManager) return false;
    try {
      return await NfcManager.isSupported();
    } catch {
      return false;
    }
  },

  /**
   * Verifica si el NFC está activo en la configuración del teléfono (Android)
   */
  async isEnabled(): Promise<boolean> {
    if (Platform.OS !== 'android' || !NfcManager) return false;
    try {
      return await NfcManager.isEnabled();
    } catch {
      return false;
    }
  },

  /**
   * Abre los ajustes de NFC de Android si está desactivado
   */
  async goToNfcSettings(): Promise<void> {
    if (Platform.OS !== 'android' || !NfcManager) return;
    try {
      await NfcManager.goToNfcSetting();
    } catch (error) {
      console.warn('No se pudo abrir la configuración de NFC:', error);
    }
  },

  /**
   * Transmite el NDEF / UID del estudiante por NFC (Android HCE / Tag emulación)
   */
  async startNfcTransmission(payloadData: string): Promise<boolean> {
    if (Platform.OS !== 'android' || !NfcManager) return false;
    try {
      await NfcManager.cancelTechnologyRequest().catch(() => {});
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const bytes = Ndef.encodeMessage([
        Ndef.textRecord(payloadData),
      ]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        return true;
      }
    } catch (error) {
      console.warn('Error durante la transmisión NFC:', error);
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
    return false;
  },

  /**
   * Detiene las operaciones activas de NFC
   */
  async stopNfc(): Promise<void> {
    if (Platform.OS !== 'android' || !NfcManager) return;
    try {
      await NfcManager.cancelTechnologyRequest();
    } catch {
      // Ignorar errores al cancelar
    }
  },
};
