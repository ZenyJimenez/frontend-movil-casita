import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { COLORS } from '../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface Cita {
  id_cita: number;
  hora: string;
  estado: string;
  cliente_nombre: string;
  servicio_nombre: string;
  empleada_nombre: string;
}

export default function AgendaScreen() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  const ip_computadora = "192.168.1.147";

  const fetchCitas = async () => {
    try {
      const response = await axios.get(`http://${ip_computadora}:3000/api/agenda/citas`);
      setCitas(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudieron cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

 const renderCita = ({ item }: { item: Cita }) => (
  <View style={styles.card}>
    <View style={styles.timeContainer}>
      <Text style={styles.timeText}>{item.hora}</Text>
    </View>
    <View style={styles.infoContainer}>
      <Text style={styles.clientText}>Cliente: {item.cliente_nombre}</Text>

      <Text style={styles.serviceText}>{item.servicio_nombre}</Text>

      <Text style={{ fontSize: 12, color: '#EC268F', marginTop: 4 }}>
        Atiende: {item.empleada_nombre}
      </Text>
    </View>
    <View style={[styles.statusBadge, { backgroundColor: item.estado === 'pendiente' ? '#FFE082' : '#C8E6C9' }]}>
      <Text style={styles.statusText}>{item.estado}</Text>
    </View>
  </View>
);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Agenda de Hoy</Text>
      <FlatList
        data={citas}
        keyExtractor={(item) => item.id_cita.toString()}
        renderItem={renderCita}
        contentContainerStyle={styles.listPadding}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay citas para hoy ✨</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => Alert.alert("Prueba, Prueba!", "Aquí ira el formulario")}
      >
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', paddingTop: 60 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginLeft: 20, marginBottom: 20 },
  listPadding: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  timeContainer: { borderRightWidth: 2, borderRightColor: COLORS.secondary, paddingRight: 15, marginRight: 15 },
  timeText: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  infoContainer: { flex: 1 },
  clientText: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  serviceText: { fontSize: 14, color: '#777' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
  fab: {
    position: 'absolute',
    zIndex: 10,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 30,
    backgroundColor: '#EC268F',
    borderRadius: 30,
    elevation: 5,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)', // Sombra moderna para Web
      },
      default: {
        shadowColor: '#000', // Sombras clásicas para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  }
});