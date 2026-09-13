import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { ElegantText as Text, GlobalStyle } from '../styles/GlobalStyle';

export default function DetaljerScreen({ navigation, route }) {
  const kjole = route.params?.kjole;

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
      <Image
        source={kjole.billede}
        recyclingKey={String(kjole.id)}
        contentFit="contain"
        style={GlobalStyle.detailImage}
      />

      <Text style={GlobalStyle.title}>{kjole.navn}</Text>
      <Text>Størrelser: {kjole.stoerrelser}</Text>
      <Text>Lejepris: {kjole.pris} kr.</Text>

      <View style={[GlobalStyle.card, { marginTop: 24 }]}>
        <Text style={GlobalStyle.dressName}>Prøv den hjemme først</Text>
        <Text style={{ marginTop: 8 }}>
          Du betaler først kun for fragt. Lejebeløbet er tænkt som en
          reservation, indtil du har prøvet kjolen og besluttet dig.
        </Text>
      </View>

      <Pressable
        onPress={() => navigation.navigate('Bestilling', { kjole })}
        style={GlobalStyle.button}
      >
        <Text style={GlobalStyle.buttonText}>Vælg størrelse og dato</Text>
      </Pressable>
    </ScrollView>
  );
}
