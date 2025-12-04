import { StyleSheet } from "react-native";
import theme from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.COLORS.WHITE3,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.WHITE1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.COLORS.BLACK1,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userInfo: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.COLORS.BLACK1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: theme.COLORS.BLACK3,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: theme.COLORS.WHITE3,
    borderRadius: 12,
    padding: 16,
    shadowColor: theme.COLORS.BLACK1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.BLACK1,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 13,
    color: theme.COLORS.BLACK3,
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 12,
    color: theme.COLORS.BLACK3,
    fontStyle: 'italic',
  },
});