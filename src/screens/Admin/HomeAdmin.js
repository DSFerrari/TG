import { View, Text } from "react-native";
import theme from "../../theme";

export default function HomeAdmin() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.COLORS.WHITE1,
      }}
    >
      <Text style={{ fontSize: 22, color: theme.COLORS.BLUE1, fontWeight: "600" }}>
        Painel Administrativo
      </Text>
      <Text style={{ marginTop: 10, fontSize: 16, color: theme.COLORS.GRAY1 }}>
        Gerencie usuários e estabelecimentos
      </Text>
    </View>
  );
}