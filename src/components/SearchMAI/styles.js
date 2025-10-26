import { StyleSheet } from "react-native";
import theme from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.COLORS.WHITE2,
    borderRadius: 25,
    height: 40,
    width: "90%",
    alignSelf: "center",
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: "#3C3C3C",
    fontSize: 16,
  },
});