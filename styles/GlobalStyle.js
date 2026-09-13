import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';

export const elegantFont = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export function ElegantText({ style, ...props }) {
  return <Text {...props} style={[{ fontFamily: elegantFont }, style]} />;
}

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
});
