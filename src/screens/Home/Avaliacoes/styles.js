import { StyleSheet } from 'react-native';
import theme from '../../../theme';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE3,
    paddingHorizontal: 24
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  nome: {
    fontWeight: 'bold',
    color: theme.COLORS.BLACK1,
    fontSize: 15,
  },
  titulo: {
    fontWeight: '500',
    fontSize: 15,
    marginTop: 8,
    color: theme.COLORS.BLACK1,
  },
  data: {
    color: theme.COLORS.GRAY1,
    fontSize: 12,
    marginVertical: 6,
  },
  texto: {
    color: theme.COLORS.BLACK2,
    fontSize: 14,
  },
  emptyText: {
    color: theme.COLORS.GRAY1,
    textAlign: 'center',
    marginTop: 40,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.COLORS.GRAY3,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  inputNota: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.COLORS.GRAY3,
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    marginBottom: 14,
  },
  inputArea: {
    borderWidth: 1,
    borderColor: theme.COLORS.GRAY3,
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 15,
    marginBottom: 14,
  },
  label: {
    fontWeight: '500',
    marginBottom: 6,
    color: theme.COLORS.BLACK1,
    marginTop:20
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:25,
    marginBottom: 20,
  },
  switchLabel: {
    marginLeft: 10,
    color: theme.COLORS.BLACK1,
  },
  });