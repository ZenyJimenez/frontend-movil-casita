import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, Dimensions } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

// Calculamos el ancho de la pantalla para que quepan 2 tarjetas perfectas
const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = width / numColumns - 25;

interface Servicio {
  id_servicio: number;
  nombre: string;
  descripcion: string;
  precio: string;
  duracion_minutos: number;
}

export default function CatalogoScreen() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const ip_computadora = "192.168.1.147"; // Casa | 192.168.1.147

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get(`http://${ip_computadora}:3000/api/servicios`);
        setServicios(response.data);
      } catch (error) {
        console.error("Error al cargar:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, []);

  // Generador de imágenes de prueba con los colores de tu marca
  const getPlaceholderImage = (nombre: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=F8BBD0&color=EC268F&size=512`;

  const renderServicio = ({ item }: { item: Servicio }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        // Al tocar, navegamos a la pantalla de detalle pasándole los datos
        router.push({
          pathname: '/servicio/[id]' as any,
          params: {
            id: item.id_servicio,
            nombre: item.nombre,
            descripcion: item.descripcion || '',
            precio: item.precio,
            duracion: item.duracion_minutos
          }
        });
      }}
    >
      <Image source={{ uri: getPlaceholderImage(item.nombre) }} style={styles.cardImage} />
      <View style={styles.cardTitleContainer}>
        <Text style={styles.serviceName} numberOfLines={2}>{item.nombre}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#EC268F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catálogo</Text>
        <Text style={styles.headerSubtitle}>Selecciona una categoría</Text>
      </View>

      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id_servicio.toString()}
        renderItem={renderServicio}
        numColumns={numColumns}
        contentContainerStyle={styles.listPadding}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF5F7' },
  header: { padding: 25, paddingTop: 60, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F8BBD0' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#EC268F' },
  headerSubtitle: { fontSize: 16, color: '#777', marginTop: 5 },
  listPadding: { padding: 15 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 15 },
  card: { width: cardWidth, backgroundColor: '#FFF', borderRadius: 15, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  cardImage: { width: '100%', height: cardWidth },
  cardTitleContainer: { padding: 10, alignItems: 'center', justifyContent: 'center', height: 55 },
  serviceName: { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center' },
});