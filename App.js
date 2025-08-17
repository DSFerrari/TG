import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AuthProvider from './src/contexts/auth';
import Routes from './src/routes';

export default function App() {
  return (
<NavigationContainer>
<AuthProvider>
  <Routes/>
</AuthProvider>
</NavigationContainer>
  );
}
