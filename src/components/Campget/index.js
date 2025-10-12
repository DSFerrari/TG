import { View,Text } from "react-native";
import { styles } from "./styles";

export default function Campget({campo,dado}){
 return(
 <View style={styles.container}>
            <Text style={styles.campo}>{campo}</Text>
            <Text style={styles.dado}>{dado}</Text>
        </View>
 )
}