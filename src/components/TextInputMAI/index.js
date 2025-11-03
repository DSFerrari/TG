import { useState,useEffect } from "react";
import { styles } from "./styles";
import { View,TextInput,Text, TouchableOpacity } from "react-native";
import theme from "../../theme";
import { Ionicons } from '@expo/vector-icons';

export default function TextInputMAI({texto,password,style, ...props}){
  const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return(
        <View style={styles.viewtoinput}>
              <Text style={styles.textwithinput}>{texto}
                <Text style={{color: theme.COLORS.RED1}}> *</Text>
              </Text>
          <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, password && styles.inputWithIcon,style]}
                    placeholder="Digite aqui"
                    placeholderTextColor={theme.COLORS.BLACK1}
                    secureTextEntry={password && !showPassword}
                    {...props}
                />
                {password && (
                    <TouchableOpacity 
                        style={styles.eyeIcon}
                        onPress={togglePasswordVisibility}
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
    )
}