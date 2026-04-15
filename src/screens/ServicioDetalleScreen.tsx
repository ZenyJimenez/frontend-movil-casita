import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ServicioDetalleScreen() {
  // Recibimos los datos que nos mandó la pantalla anterior
  const { nombre, descripcion, precio, duracion, id } = useLocalSearchParams();
  const router = useRouter();

  // Simulamos 3 imágenes para el carrusel
  const images = [
    `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre as string)}&background=F8BBD0&color=EC268F&size=512`,
    `https://ui-avatars.com/api/?name=Foto+2&background=FFF5F7&color=EC268F&size=512`,
    `https://ui-avatars.com/api/?name=Foto+3&background=FFF&color=EC268F&size=512`
  ];

  return (
    <View style={styles.container}>
      {/* Encabezado con botón de regresar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#EC268F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{nombre}</Text>
      </View>

      <ScrollView>
        {/* Carrusel de Imágenes */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.carouselContainer}>
          {images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.carouselImage} />
          ))}
        </ScrollView>

        {/* Información del Servicio */}
        <View style={styles.detailsContainer}>
          <Text style={styles.priceText}>Desde ${precio}</Text>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={18} color="#777" />
            <Text style={styles.timeText}> {duracion} minutos</Text>
          </View>

          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>
            {descripcion && descripcion !== 'null' ? descripcion : `Disfruta de nuestro excelente servicio de ${nombre}. Usamos los mejores productos para asegurar un acabado perfecto y un momento de relajación total en La Casita de Uñas.`}
          </Text>
        </View>
      </ScrollView>

      {/* Botón Flotante Abajo */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bookButton} onPress={() => router.push({ pathname: '/agendar/[id]' as any, params: { id, nombre }})}>
          <Text style={styles.bookButtonText}>AGENDAR AHORA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F8BBD0' },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#EC268F', flex: 1 },
  carouselContainer: { height: 300 },
  carouselImage: { width: width, height: 300, resizeMode: 'cover' },
  detailsContainer: { padding: 25 },
  priceText: { fontSize: 28, fontWeight: 'bold', color: '#EC268F', marginBottom: 10 },
  timeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  timeText: { fontSize: 16, color: '#777', fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  descriptionText: { fontSize: 16, color: '#555', lineHeight: 24 },
  bottomBar: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F8BBD0' },
  bookButton: { backgroundColor: '#EC268F', paddingVertical: 18, borderRadius: 30, alignItems: 'center', shadowColor: '#EC268F', shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  bookButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 }
});