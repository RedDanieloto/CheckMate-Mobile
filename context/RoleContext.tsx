import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'estudiante' | 'administrador' | 'profesor_tutor' | 'profesor';

export interface EstudianteEmergencia {
  id: string;
  nombre: string;
  matricula: string;
  estado: 'a_salvo' | 'pendiente' | 'en_busqueda';
  horaUltimaVez: string;
  zonaRegistro: string;
  foto: string;
}

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showJustificantes: boolean;
  setShowJustificantes: (show: boolean) => void;
  showReclamos: boolean;
  setShowReclamos: (show: boolean) => void;
  showContactos: boolean;
  setShowContactos: (show: boolean) => void;
  showProtocolos: boolean;
  setShowProtocolos: (show: boolean) => void;
  // Estados de Emergencia
  isEmergenciaActiva: boolean;
  setIsEmergenciaActiva: (activa: boolean) => void;
  nombreProtocoloActivo: string;
  setNombreProtocoloActivo: (nombre: string) => void;
  alertaBusqueda: string | null;
  setAlertaBusqueda: (alerta: string | null) => void;
  estudiantesEmergencia: EstudianteEmergencia[];
  setEstudiantesEmergencia: React.Dispatch<React.SetStateAction<EstudianteEmergencia[]>>;
  marcarEstudianteASalvo: (id: string) => void;
  marcarEstudianteEnBusqueda: (id: string) => void;
  finalizarEmergencia: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const estudiantesIniciales: EstudianteEmergencia[] = [
  {
    id: '1',
    nombre: 'Jose Papito Lopez',
    matricula: '23170049',
    estado: 'pendiente',
    horaUltimaVez: '09:14 AM',
    zonaRegistro: 'Ala Norte',
    foto: '',
  },
  {
    id: '2',
    nombre: 'Maria Fernanda Ruiz',
    matricula: '23170051',
    estado: 'a_salvo',
    horaUltimaVez: '09:10 AM',
    zonaRegistro: 'Explanada',
    foto: '',
  },
  {
    id: '3',
    nombre: 'Carlos Mendez Ortiz',
    matricula: '23170112',
    estado: 'pendiente',
    horaUltimaVez: '09:08 AM',
    zonaRegistro: 'Edificio A',
    foto: '',
  },
  {
    id: '4',
    nombre: 'Luis Enrique Gomez',
    matricula: '23170088',
    estado: 'a_salvo',
    horaUltimaVez: '09:12 AM',
    zonaRegistro: 'Explanada',
    foto: '',
  },
  {
    id: '5',
    nombre: 'Ana Victoria Salazar',
    matricula: '23170154',
    estado: 'pendiente',
    horaUltimaVez: '09:05 AM',
    zonaRegistro: 'Laboratorio',
    foto: '',
  },
  {
    id: '6',
    nombre: 'Diego Maradona',
    matricula: '20210045',
    estado: 'pendiente',
    horaUltimaVez: '09:15 AM',
    zonaRegistro: 'Biblioteca',
    foto: '',
  },
];

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('estudiante');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showJustificantes, setShowJustificantes] = useState(false);
  const [showReclamos, setShowReclamos] = useState(false);
  const [showContactos, setShowContactos] = useState(false);
  const [showProtocolos, setShowProtocolos] = useState(false);

  // Estados de Emergencia
  const [isEmergenciaActiva, setIsEmergenciaActiva] = useState(false);
  const [nombreProtocoloActivo, setNombreProtocoloActivo] = useState('');
  const [alertaBusqueda, setAlertaBusqueda] = useState<string | null>(null);
  const [estudiantesEmergencia, setEstudiantesEmergencia] = useState<EstudianteEmergencia[]>(estudiantesIniciales);

  const marcarEstudianteASalvo = (id: string) => {
    setEstudiantesEmergencia(prev =>
      prev.map(e => (e.id === id ? { ...e, estado: 'a_salvo' } : e))
    );
  };

  const marcarEstudianteEnBusqueda = (id: string) => {
    setEstudiantesEmergencia(prev =>
      prev.map(e => (e.id === id ? { ...e, estado: 'en_busqueda' } : e))
    );
  };

  const finalizarEmergencia = () => {
    setIsEmergenciaActiva(false);
    setNombreProtocoloActivo('');
    setAlertaBusqueda(null);
    setEstudiantesEmergencia(estudiantesIniciales);
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isSidebarOpen,
        setIsSidebarOpen,
        showSettings,
        setShowSettings,
        showNotifications,
        setShowNotifications,
        showJustificantes,
        setShowJustificantes,
        showReclamos,
        setShowReclamos,
        showContactos,
        setShowContactos,
        showProtocolos,
        setShowProtocolos,
        isEmergenciaActiva,
        setIsEmergenciaActiva,
        nombreProtocoloActivo,
        setNombreProtocoloActivo,
        alertaBusqueda,
        setAlertaBusqueda,
        estudiantesEmergencia,
        setEstudiantesEmergencia,
        marcarEstudianteASalvo,
        marcarEstudianteEnBusqueda,
        finalizarEmergencia,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole debe usarse dentro de un RoleProvider');
  }
  return context;
}
