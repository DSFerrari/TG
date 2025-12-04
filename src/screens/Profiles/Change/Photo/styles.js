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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: theme.COLORS.BLUE3,
  },
  previewBadge: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: theme.COLORS.BLUE3,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewText: {
    color: theme.COLORS.WHITE3,
    fontSize: 12,
    fontWeight: 'bold',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.WHITE2,
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
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.WHITE3,
    padding: 16,
    borderRadius: 12,
    shadowColor: theme.COLORS.BLACK1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  removeButton: {
    backgroundColor: theme.COLORS.WHITE1,
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
  removeTitle: {
    color: theme.COLORS.RED2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: theme.COLORS.BLACK3,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.BLACK3,
  },
  saveButton: {
    flex: 2,
    backgroundColor: theme.COLORS.BLUE3,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.COLORS.WHITE3,
    fontSize: 16,
    fontWeight: 'bold',
  },
});