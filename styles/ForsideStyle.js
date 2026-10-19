import { StyleSheet } from 'react-native';

// Skrifttypen kommer fra ElegantText i GlobalStyle.
export const ForsideStyle = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F1E8',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  brand: {
    color: '#8A6A3F',
    fontSize: 26,
    letterSpacing: 4,
    textAlign: 'center',
    marginTop: 8,
  },
  tagline: {
    color: '#493B2B',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 0.78,
    borderRadius: 12,
    backgroundColor: '#E6DED2',
  },
  intro: {
    paddingTop: 24,
    paddingBottom: 28,
  },
  title: {
    color: '#493B2B',
    fontSize: 32,
    marginBottom: 12,
  },
  body: {
    color: '#493B2B',
    fontSize: 16,
    lineHeight: 25,
  },
  button: {
    minHeight: 48,
    justifyContent: 'center',
    marginTop: 20,
  },
  pressed: {
    opacity: 0.75,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: '#DED1BF',
    paddingTop: 26,
    paddingBottom: 28,
  },
  eyebrow: {
    color: '#8A6A3F',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 12,
  },
  heading: {
    color: '#493B2B',
    fontSize: 24,
    lineHeight: 31,
    marginBottom: 14,
  },
  gallery: {
    gap: 14,
    paddingBottom: 4,
  },
  dressCard: {
    width: 190,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  dressImage: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    marginBottom: 12,
  },
  dressName: {
    color: '#493B2B',
    fontSize: 17,
    paddingBottom: 4,
  },
  galleryHint: {
    color: '#685740',
    fontSize: 13,
    marginTop: 12,
  },
  footer: {
    color: '#8A6A3F',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
  },
});