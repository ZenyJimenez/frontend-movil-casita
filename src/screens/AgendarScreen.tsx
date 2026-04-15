import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// 1. Definimos la estructura exacta que nos manda MySQL
interface Empleada {
  id_usuario: number;
  nombre_completo: string;
}

export default function AgendarScreen() {
  const router = useRouter();
  const { id, nombre } = useLocalSearchParams();

  // Estados de selección del cliente
  const [empleadaSeleccionada, setEmpleadaSeleccionada] = useState<number | null>(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);

  // 2. Estados para guardar los datos reales de la base de datos
  const [empleadas, setEmpleadas] = useState<Empleada[]>([]);
  const [loadingEmpleadas, setLoadingEmpleadas] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Tu IP actual
  const ip_computadora = "192.168.1.147"; // Casa | 192.168.1.147

  // 3. Vamos por la lista de empleadas al servidor en cuanto abre la pantalla
  useEffect(() => {
    const fetchEmpleadas = async () => {
      try {
        const response = await axios.get(`http://${ip_computadora}:3000/api/empleadas`);
        setEmpleadas(response.data);
      } catch (error) {
        console.error("Error al cargar empleadas:", error);
      } finally {
        setLoadingEmpleadas(false);
      }
    };
    fetchEmpleadas();
  }, []);

  // Fechas y horas (Aún simuladas, las conectaremos más adelante)
  const diasDisponibles = ['Lun 15', 'Mar 16', 'Mié 17', 'Jue 18', 'Vie 19', 'Sáb 20'];
  const horasDisponibles = ['10:00', '11:00', '12:30', '14:00', '16:00', '17:30'];

const handleConfirmar = async () => {
    if (!empleadaSeleccionada || !diaSeleccionado || !horaSeleccionada) {
      Alert.alert('Atención', 'Por favor selecciona especialista, día y hora.');
      return;
    }

    setGuardando(true);

    try {
      // ⚠️ TRUCO TEMPORAL: Como nuestros botones dicen "Lun 15",
      // extraeremos el número "15" y armaremos una fecha real para que MySQL la acepte.
      const numeroDia = diaSeleccionado.split(' ')[1]; // Saca el "15"
      const fechaParaMySQL = `2024-05-${numeroDia}`; // Quedaría "2024-05-15"

      // A la hora le agregamos los segundos para que sea formato TIME
      const horaParaMySQL = `${horaSeleccionada}:00`;

      const response = await axios.post(`http://${ip_computadora}:3000/api/citas`, {
        id_cliente: 1, // Suponiendo que el usuario con ID 1 existe en tu BD
        id_empleada: empleadaSeleccionada,
        id_servicio: Number(id),
        fecha: fechaParaMySQL,
        hora_inicio: horaParaMySQL
      });

      if (response.status === 201) {
        // Le agregamos un botón a la alerta que contiene la redirección
        Alert.alert(
          '¡Cita Lista!', '\nTu cita se agendó exitosamente.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/') // Hasta que den clic, regresamos al menú
            }
          ]
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
      Alert.alert('Horario Ocupado', '\nEsa especialista ya tiene una cita a esa hora. Por favor elige otra.');
    } else {
      Alert.alert('Error', 'No se pudo guardar la cita.');
    }
  } finally {
    setGuardando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#EC268F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Cita</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.serviceName}>{nombre}</Text>

        {/* Sección: Empleadas (AHORA CON DATOS REALES) */}
        <Text style={styles.sectionTitle}>1. Elige tu especialista</Text>
        {loadingEmpleadas ? (
            <ActivityIndicator size="small" color="#EC268F" />
        ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {empleadas.map((emp) => (
                <TouchableOpacity
                  key={emp.id_usuario}
                  style={[styles.chip, empleadaSeleccionada === emp.id_usuario && styles.chipActive]}
                  onPress={() => setEmpleadaSeleccionada(emp.id_usuario)}
                >
                  <Text style={[styles.chipText, empleadaSeleccionada === emp.id_usuario && styles.chipTextActive]}>
                    {emp.nombre_completo}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
        )}

        <Text style={styles.sectionTitle}>2. Elige el día</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {diasDisponibles.map((dia, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.chip, diaSeleccionado === dia && styles.chipActive]}
              onPress={() => setDiaSeleccionado(dia)}
            >
              <Text style={[styles.chipText, diaSeleccionado === dia && styles.chipTextActive]}>
                {dia}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>3. Elige la hora</Text>
        <View style={styles.gridContainer}>
          {horasDisponibles.map((hora, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.timeChip, horaSeleccionada === hora && styles.timeChipActive]}
              onPress={() => setHoraSeleccionada(hora)}
            >
              <Text style={[styles.timeChipText, horaSeleccionada === hora && styles.chipTextActive]}>
                {hora}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.bookButton, guardando && { backgroundColor: '#ccc' }]} onPress={handleConfirmar} disabled={guardando}>
          <Text style={styles.bookButtonText}> {guardando ? 'GUARDANDO...' : 'CONFIRMAR CITA'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F8BBD0' },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#EC268F' },
  content: { padding: 20 },
  serviceName: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 25, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 15 },
  horizontalScroll: { marginBottom: 30, paddingBottom: 5 },
  chip: { backgroundColor: '#FFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#F8BBD0' },
  chipActive: { backgroundColor: '#EC268F', borderColor: '#EC268F' },
  chipText: { color: '#EC268F', fontWeight: 'bold' },
  chipTextActive: { color: '#FFF' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 40 },
  timeChip: { backgroundColor: '#FFF', width: '30%', paddingVertical: 12, borderRadius: 10, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: '#F8BBD0' },
  timeChipActive: { backgroundColor: '#EC268F', borderColor: '#EC268F' },
  timeChipText: { color: '#EC268F', fontWeight: 'bold', fontSize: 16 },
  bottomBar: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F8BBD0' },
  bookButton: { backgroundColor: '#EC268F', paddingVertical: 18, borderRadius: 30, alignItems: 'center', shadowColor: '#EC268F', shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  bookButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 }
});