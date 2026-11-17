import { StyleSheet } from 'react-native';
import { elegantFont } from './GlobalStyle';

export const KontaktStyle = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F1E8',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: '#493B2B',
    fontSize: 28,
    marginBottom: 10,
  },
  intro: {
    color: '#493B2B',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 22,
  },
  label: {
    color: '#493B2B',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 8,
  },
  valgRae: {
    flexDirection: 'row',
    gap: 10,
  },
  valgKnap: {
    flex: 1,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CDBB9F',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  valgKnapAktiv: {
    borderColor: '#8A6A3F',
    backgroundColor: '#8A6A3F',
  },
  valgTekst: {
    color: '#8A6A3F',
    fontFamily: elegantFont,
    fontSize: 14,
    textAlign: 'center',
  },
  valgTekstAktiv: {
    color: '#FFFFFF',
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#CDBB9F',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    color: '#493B2B',
    fontFamily: elegantFont,
    fontSize: 16,
  },
  sporgsmaalInput: {
    minHeight: 150,
    paddingTop: 14,
  },
  sendKnap: {
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#8A6A3F',
  },
  sendKnapTekst: {
    color: '#FFFFFF',
    fontFamily: elegantFont,
    fontSize: 17,
  },
  disabled: {
    opacity: 0.6,
  },
  error: {
    color: '#9A3030',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  success: {
    color: '#416B42',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  note: {
    color: '#685740',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
    textAlign: 'center',
  },
});
