import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { ElegantText as Text, GlobalStyle } from '../styles/GlobalStyle';

export default function DetaljerScreen({ navigation, route }) {
  // Henter den kjole, som brugeren trykkede på på Kjoler-siden
  const kjole = route.params?.kjole;

  // Viser en besked, hvis siden åbnes uden en valgt kjole
  if (!kjole) {
    return (
      <View style={GlobalStyle.container}>
        <Text>Vælg først en kjole i Kjoler-fanen.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={GlobalStyle.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Viser et større billede af den valgte kjole */}
      <Image
        source={kjole.billede}
        recyclingKey={String(kjole.id)}
        contentFit="contain"
        style={GlobalStyle.detailImage}
      />

      {/* Viser kjolens navn, størrelser og lejepris */}
      <Text style={GlobalStyle.title}>{kjole.navn}</Text>
      <Text>Størrelser: {kjole.stoerrelser}</Text>
      <Text>Lejepris: {kjole.pris} kr.</Text>

      {/* Forklarer idéen med at prøve kjolen hjemme først */}
      <View style={[GlobalStyle.card, { marginTop: 24 }]}>
        <Text style={GlobalStyle.dressName}>Prøv den hjemme først</Text>
        <Text style={{ marginTop: 8 }}>
          Du betaler først kun for fragt. Lejebeløbet er tænkt som en
          reservation, indtil du har prøvet kjolen og besluttet dig.
        </Text>
      </View>

      {/* Sender den valgte kjole videre til Bestilling-siden */}
      <Pressable
        onPress={() => navigation.navigate('Bestilling', { kjole })}
        style={GlobalStyle.button}
      >
        <Text style={GlobalStyle.buttonText}>Vælg størrelse og dato</Text>
      </Pressable>
    </ScrollView>
  );
}