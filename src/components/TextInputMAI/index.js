import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, AccessibilityInfo } from "react-native";
import theme from "../../theme";
import { Ionicons } from '@expo/vector-icons';
import { styles } from "./styles";

export default function TextInputMAI({ texto, password, style, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility() {
    const newState = !showPassword;
    setShowPassword(newState);

    AccessibilityInfo.announceForAccessibility(
      newState
        ? "Senha visível"
        : "Senha oculta"
    );
  }

  const isRequired = true; // já que tem *

  const fieldLabel = `${texto}${isRequired ? " — obrigatório" : ""}`;

  return (
    <View style={styles.viewtoinput} accessible={false}>
      <Text
        style={styles.textwithinput}
        accessibilityLabel={fieldLabel}
        accessibilityRole="text"
      >
        {texto}
        {isRequired && (
          <Text style={{ color: theme.COLORS.RED1 }}> *</Text>
        )}
      </Text>

      <View
        style={styles.inputContainer}
        accessible={true}
        accessibilityLabel={fieldLabel}
        accessibilityHint={
          password
            ? "Digite sua senha. Toque no ícone para mostrar ou ocultar."
            : "Digite o texto."
        }
      >
        <TextInput
          style={[
            styles.input,
            password && styles.inputWithIcon,
            style
          ]}
          placeholder="Digite aqui"
          placeholderTextColor={theme.COLORS.BLACK1}
          secureTextEntry={password && !showPassword}
          accessibilityLabel={fieldLabel}
          accessibilityRole="text"
          {...props}
        />

        {password && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={togglePasswordVisibility}
            accessibilityRole="button"
            accessibilityLabel={
              showPassword
                ? "Ocultar senha"
                : "Mostrar senha"
            }
            accessibilityHint={
              showPassword
                ? "A senha ficará escondida"
                : "A senha ficará visível"
            }
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color={theme.COLORS.BLACK1}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
