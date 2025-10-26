import { StyleSheet } from 'react-native';
import theme from '../../theme';

export const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    flexDirection: 'row',
    backgroundColor:theme.COLORS.WHITE3,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: theme.COLORS.WHITE3,
    borderRadius: 20,
    padding: 4,
    borderColor: theme.COLORS.RED2
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  nome: {
    fontSize: 21,
    fontWeight: '400',
    fontStyle: 'italic',
  },
  distancia: {
    color: theme.COLORS.BLACK3,
    marginVertical: 2,
    fontSize: 18,
    fontWeight: '400',
  },

  categoria: {
    color: theme.COLORS.BLUE1,
    fontWeight: '400',
    marginBottom: 4,
    fontSize: 21
  },
  starsContainer: {
    flexDirection: 'row',
  },
});
