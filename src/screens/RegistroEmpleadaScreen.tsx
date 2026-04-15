import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RegistroEmpleadaScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const ip_computadora = "192.168.1.147"; // Casa | 192.168.1.147

  const handleRegistro = async () => {
    if (!nombre || !telefono || !correo || !contrasena) {
      Alert.alert('Atención', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await axios.post(`http://${ip_computadora}:3000/api/empleadas`, {
        nombre_completo: nombre.trim(),
        telefono: telefono.trim(),
        correo: correo.trim().toLowerCase(),
        contrasena: contrasena.trim()
      });

      if (response.status === 201) {
        Alert.alert('¡Éxito!', 'Comisionista registrada correctamente.');
        // Limpiamos los campos por si quieres registrar a otra
        setNombre('');
        setTelefono('');
        setCorreo('');
        setContrasena('');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo registrar. Verifica tu conexión o si el correo ya existe.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#EC268F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alta de Especialista</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Ingresa los datos de la nueva integrante del equipo</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput style={styles.input} placeholder="Ej. Sofía Martínez" value={nombre} onChangeText={setNombre} />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput style={styles.input} placeholder="Ej. 6861234567" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />

          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput style={styles.input} placeholder="sofia@ejemplo.com" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />

          <Text style={styles.label}>Contraseña Temporal</Text>
          <TextInput style={styles.input} placeholder="Contraseña de acceso" value={contrasena} onChangeText={setContrasena} secureTextEntry />

          <TouchableOpacity style={styles.submitButton} onPress={handleRegistro}>
            <Text style={styles.submitButtonText}>REGISTRAR COMISIONISTA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F8BBD0' },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#EC268F' },
  scrollContent: { padding: 25 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 25, textAlign: 'center' },
  form: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#F8BBD0', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 20 },
  submitButton: { backgroundColor: '#EC268F', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});