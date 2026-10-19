import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';

export const elegantFont =
  Platform.OS === 'ios' ? 'Georgia' : 'serif';

export function ElegantText({ style, ...props }) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: elegantFont }, style]}
    />
  );
}

// Fælles styling til appen
export const GlobalStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F1E8',
  },
  title: {
    fontSize: 24,
    fontFamily: elegantFont,
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
  },
  dressName: {
    fontSize: 20,
    fontFamily: elegantFont,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#8A6A3F',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: elegantFont,
    fontSize: 16,
  },
  dressImage: {
    width: '100%',
    height: 240,
    borderRadius: 10,
    marginBottom: 12,
  },
  detailImage: {
    width: '100%',
    height: 500,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  heroVideoContainer: {
    width: '100%',
    height: 320,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#493B2B',
  },
  heroVideo: {
    width: '100%',
    height: '100%',
  },
});

// Styling til forsiden
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
    letterSpacing: 2,
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
  heroVideoContainer: {
    width: '100%',
    height: 320,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#493B2B',
  },
  heroVideo: {
    width: '100%',
    height: '100%',
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
    backgroundColor: '#FFFFFF',
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

// Styling til billedgalleriet på detaljesiden
export const GalleriStyle = StyleSheet.create({
  sideIndhold: {
    paddingBottom: 40,
  },
  taeller: {
    textAlign: 'center',
    color: '#8A6A3F',
    fontSize: 14,
    marginBottom: 12,
  },
  miniatureListe: {
    gap: 10,
    paddingBottom: 8,
  },
  miniatureKnap: {
    width: 76,
    height: 106,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 3,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  valgtMiniature: {
    borderColor: '#8A6A3F',
  },
  miniatureBillede: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  hjaelpetekst: {
    textAlign: 'center',
    color: '#685740',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 24,
  },
  infoKort: {
    marginTop: 24,
  },
  infoTekst: {
    marginTop: 8,
  },
});