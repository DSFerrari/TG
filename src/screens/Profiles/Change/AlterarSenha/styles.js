import { StyleSheet } from "react-native";
import theme from "../../../../theme";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE3,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: theme.COLORS.BLUE3,
    marginLeft: 12,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
});