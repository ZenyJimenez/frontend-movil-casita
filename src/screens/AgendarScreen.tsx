import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AgendarScreen() {
  const router = useRouter();
  const { id, nombre } = useLocalSearchParams(); // Recibimos el servicio elegido

  // Estados para guardar lo que la clienta va seleccionando
  const [empleadaSeleccionada, setEmpleadaSeleccionada] = useState<number | null>(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);

  // Datos simulados (Luego los traeremos de tu base de datos)
  const empleadas = [
    { id: 1, nombre: 'Ana (Tú)' },
    { id: 2, nombre: 'Sofía' },
    { id: 3, nombre: 'Cualquiera' }
  ];

  const diasDisponibles = ['Lun 15', 'Mar 16', 'Mié 17', 'Jue 18', 'Vie 19', 'Sáb 20'];
  const horasDisponibles = ['10:00', '11:00', '12:30', '14:00', '16:00', '17:30'];

  const handleConfirmar = () => {
    if (!empleadaSeleccionada || !diaSeleccionado || !horaSeleccionada) {
      Alert.alert('Atención', 'Por favor selecciona especialista, día y hora.');
      return;
    }
    // Aquí irá la petición axios.post a tu backend en el futuro
    Alert.alert('¡Cita Lista!', `Agendaste ${nombre} el ${diaSeleccionado} a las ${horaSeleccionada}.`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#EC268F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Cita</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.serviceName}>{nombre}</Text>

        {/* Sección: Empleadas */}
        <Text style={styles.sectionTitle}>1. Elige tu especialista</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {empleadas.map((emp) => (
            <TouchableOpacity
              key={emp.id}
              style={[styles.chip, empleadaSeleccionada === emp.id && styles.chipActive]}
              onPress={() => setEmpleadaSeleccionada(emp.id)}
            >
              <Text style={[styles.chipText, empleadaSeleccionada === emp.id && styles.chipTextActive]}>
                {emp.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sección: Fechas */}
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

        {/* Sección: Horas (Grid) */}
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

      {/* Botón Flotante */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bookButton} onPress={handleConfirmar}>
          <Text style={styles.bookButtonText}>CONFIRMAR CITA</Text>
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