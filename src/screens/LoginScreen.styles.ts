import { StyleSheet, Platform } from 'react-native';
import { COLORS, SPACING } from '../styles/theme'; // Importas tu "marca"

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EC268F',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'serif',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F8BBD0',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F8BBD0',
    marginBottom: 15,
    paddingRight: 10,
  },
  inputPassword: {
    flex: 1,
    height: 55,
    paddingHorizontal: 15,
  },
  icon: {
    padding: 5,
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#EC268F',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linkText: {
    marginTop: 25,
    color: '#EC268F',
    fontWeight: '600',
  }
});