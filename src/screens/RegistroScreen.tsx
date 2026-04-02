import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './LoginScreen.styles'; // Reutilizamos tus estilos perfectos

export default function RegistroScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleRegistro = async () => {
    if (!nombre || !telefono || !email || !password) {
      Alert.alert("Atención", "Por favor, llena todos los campos");
      return;
    }

    try {
      const ip_computadora = "192.168.1.147";

      const response = await axios.post(`http://${ip_computadora}:3000/api/clientes/registro`, {
        nombre_completo: nombre,
        telefono: telefono,
        correo: email,
        contrasena_hash: password
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert("¡Éxito!", "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.");
        router.back();
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error de Conexión",
        "No se pudo conectar al servidor. Revisa que tu IP sea la correcta y tu backend esté encendido."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Image source={require('../../assets/images/LA-CASITA-DE-UNAS.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Crea tu cuenta</Text>
        <Text style={styles.subtitle}>Únete a La Casita de Uñas</Text>

        <TextInput style={styles.input} placeholder="Nombre Completo" value={nombre} onChangeText={setNombre} />
        <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={24} color="#EC268F" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegistro}>
          <Text style={styles.buttonText}>REGISTRARME</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia Sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}