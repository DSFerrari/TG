import { View, Text } from "react-native";
import { styles } from "./styles";

export default function Campget({ campo, dado }) {
  const valorFinal = dado === null || dado === undefined || dado === ""
    ? "Não informado"
    : dado;

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${campo}: ${valorFinal}`}
    >
      <Text
        style={styles.campo}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        {campo}
      </Text>

      <Text
        style={styles.dado}
        maxFontSizeMultiplier={1.6}
      >
        {valorFinal}
      </Text>
    </View>
  );
}
