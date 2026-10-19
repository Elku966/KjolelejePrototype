import { StyleSheet } from 'react-native';

export const KjolerStyle = StyleSheet.create({
  billedRamme: {
    width: '100%',
    height: 420,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F7F1E8',
  },

  galleri: {
    flex: 1,
  },

  billede: {
    height: 420,
  },

  prikker: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 6,
  },

  prikKnap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  prik: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DED1BF',
  },

  aktivPrik: {
    backgroundColor: '#8A6A3F',
  },

  billedTekst: {
    color: '#685740',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
});