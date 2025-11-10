import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import AuthProvider from "./src/contexts/auth";
import AppProvider from "./src/contexts/app";
import Routes from "./src/routes";

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="#000" />
          <Routes />
        </NavigationContainer>
      </AppProvider>
    </AuthProvider>
  );
}