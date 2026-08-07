import { Platform } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

export const nfcService = {
  /**
   * Inicializa el módulo de NFC en dispositivos compatibles
   */
  async init(): Promise<boolean> {
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
    try {
      return await NfcManager.isSupported();
    } catch {
      return false;
    }
  },

  /**
   * Verifica si el NFC está activo en la configuración del teléfono (especialmente en Android)
   */
  async isEnabled(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        return await NfcManager.isEnabled();
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Abre los ajustes de NFC de Android si está desactivado
   */
  async goToNfcSettings(): Promise<void> {
    if (Platform.OS === 'android') {
      try {
        await NfcManager.goToNfcSetting();
      } catch (error) {
        console.warn('No se pudo abrir la configuración de NFC:', error);
      }
    }
  },

  /**
   * Transmite el NDEF / UID del estudiante por NFC (Optimizado para Android HCE / Tag emulación)
   */
  async startNfcTransmission(payloadData: string): Promise<boolean> {
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
    try {
      await NfcManager.cancelTechnologyRequest();
    } catch {
      // Ignorar errores al cancelar
    }
  },
};
