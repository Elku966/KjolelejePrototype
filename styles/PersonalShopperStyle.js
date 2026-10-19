import { StyleSheet } from 'react-native';
import { elegantFont } from './GlobalStyle';

export const PersonalShopperStyle = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F1E8',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    color: '#493B2B',
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#493B2B',
    marginBottom: 16,
  },
  examples: {
    gap: 10,
    marginBottom: 20,
  },
  example: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#DED1BF',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  exampleText: {
    color: '#8A6A3F',
    fontSize: 15,
  },
  input: {
    minHeight: 110,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CDBB9F',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    color: '#493B2B',
    fontFamily: elegantFont,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  disabled: {
    opacity: 0.5,
  },
  loading: {
    marginTop: 20,
    alignItems: 'center',
    gap: 10,
  },
  error: {
    color: '#9A3030',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 16,
  },
  answer: {
    marginTop: 24,
    marginBottom: 20,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  answerText: {
    color: '#493B2B',
    fontSize: 16,
    lineHeight: 25,
  },
  image: {
    width: '100%',
    height: 320,
    borderRadius: 10,
    marginBottom: 12,
  },
  reason: {
    fontSize: 15,
    color: '#685740',
    lineHeight: 23,
    marginTop: 10,
  },
});