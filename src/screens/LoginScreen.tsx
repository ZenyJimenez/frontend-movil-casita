import React, { useState } from 'react';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { styles } from './LoginScreen.styles';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atención", "Por favor, llena todos los campos");
      return;
    }

    try {
      // 1. Limpiamos espacios accidentales del teclado
      const correoLimpio = email.trim().toLowerCase();
      const passwordLimpia = password.trim();

      // 2. Usamos tu IP confirmada
      const ip_computadora = "192.168.1.147";

      const response = await axios.post(`http://${ip_computadora}:3000/api/login`, {
        correo: correoLimpio,
        contrasena: passwordLimpia
      });

      if (response.data && response.data.usuario) {
        const usuarioLogueado = response.data.usuario;
        Alert.alert(`Bienvenida, ${usuarioLogueado.nombre_completo}!`);

        // Redirección inteligente según el rol
        if (usuarioLogueado.rol === 'cliente') {
          router.replace('/catalogo');
        } else {
          router.replace('/agenda');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error de acceso", "Correo o contraseña incorrectos");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Image
          source={require('../../assets/images/LA-CASITA-DE-UNAS.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>La Casita de Uñas</Text>
        <Text style={styles.subtitle}>Elegancia en cada detalle</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={24}
              color="#EC268F"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/registro')}>
          <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
