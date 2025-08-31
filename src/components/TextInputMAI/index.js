import { styles } from "./styles";
import { View,TextInput,Text } from "react-native";
import theme from "../../theme";

export default function TextInputMAI({texto, ...props}){
    return(
        <View style={styles.viewtoinput}>
              <Text style={styles.textwithinput}>{texto}
                <Text style={{color:'red'}}> *</Text>
              </Text>
            <TextInput
                 style={styles.input}
                  placeholder="Digite aqui"
                  placeholderTextColor={theme.COLORS.BLACK1}
                {...props}
            />
            </View>
    )
}