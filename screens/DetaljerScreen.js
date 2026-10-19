import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';

import {
  ElegantText as Text,
  GlobalStyle,
  GalleriStyle,
} from '../styles/GlobalStyle';

function KjoleGalleri({ kjole }) {
  const [valgtIndex, setValgtIndex] = useState(0);
  const [bredde, setBredde] = useState(0);
  const galleriRef = useRef(null);

  const billeder = kjole.billeder?.length
    ? kjole.billeder
    : [kjole.billede];

  // Skifter til det billede, brugeren trykker på.
  function visBillede(index) {
    setValgtIndex(index);

    galleriRef.current?.scrollTo({
      x: index * bredde,
      animated: true,
    });
  }

  // Opdaterer tælleren, når brugeren swiper.
  function opdaterBillede(event) {
    if (bredde <= 0) return;

    const position = event.nativeEvent.contentOffset.x;
    const index = Math.round(position / bredde);

    setValgtIndex(
      Math.max(0, Math.min(index, billeder.length - 1))
    );
  }

  return (
    <View>
      <View
        style={GlobalStyle.detailImage}
        onLayout={(event) => {
          const nyBredde = event.nativeEvent.layout.width;

          if (nyBredde !== bredde) {
            setBredde(nyBredde);
          }
        }}
      >
        {bredde > 0 && (
          <ScrollView
            key={bredde}
            ref={galleriRef}
            horizontal
            pagingEnabled
            directionalLockEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={opdaterBillede}
            contentOffset={{
              x: valgtIndex * bredde,
              y: 0,
            }}
          >
            {billeder.map((billede, index) => (
              <Image
                key={`${kjole.id}-stor-${index}`}
                source={billede}
                contentFit="contain"
                style={[
                  GlobalStyle.detailImage,
                  {
                    width: bredde,
                    marginBottom: 0,
                  },
                ]}
                accessibilityLabel={
                  `${kjole.navn}, billede ${index + 1} af ${billeder.length}`
                }
              />
            ))}
          </ScrollView>
        )}
      </View>

      <Text style={GalleriStyle.taeller}>
        Billede {valgtIndex + 1} af {billeder.length}
      </Text>

      <Text style={GalleriStyle.hjaelpetekst}>
        Swipe på billedet for at se flere
      </Text>

      {/* Små billeder kan også bruges til at skifte billede. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={GalleriStyle.miniatureListe}
      >
        {billeder.map((billede, index) => (
          <Pressable
            key={`${kjole.id}-lille-${index}`}
            onPress={() => visBillede(index)}
            accessibilityRole="button"
            accessibilityLabel={`Vis billede ${index + 1}`}
            accessibilityState={{
              selected: valgtIndex === index,
            }}
            style={[
              GalleriStyle.miniatureKnap,
              valgtIndex === index &&
                GalleriStyle.valgtMiniature,
            ]}
          >
            <Image
              source={billede}
              contentFit="cover"
              style={GalleriStyle.miniatureBillede}
            />
          </Pressable>
        ))}
      </ScrollView>

      <Text style={GalleriStyle.hjaelpetekst}>
        Du kan også trykke på de små billeder
      </Text>
    </View>
  );
}

export default function DetaljerScreen({ navigation, route }) {
  const kjole = route.params?.kjole;

  // Vises, hvis brugeren åbner fanen uden at vælge en kjole.
  if (!kjole) {
    return (
      <View style={GlobalStyle.container}>
        <Text>Vælg først en kjole i Kjoler-fanen.</Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Kjoler')}
          style={GlobalStyle.button}
        >
          <Text style={GlobalStyle.buttonText}>
            Se kjoler
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={GlobalStyle.container}
      contentContainerStyle={GalleriStyle.sideIndhold}
    >
      {/* Starter på første billede, når en anden kjole vælges. */}
      <KjoleGalleri key={kjole.id} kjole={kjole} />

      <Text
        accessibilityRole="header"
        style={GlobalStyle.title}
      >
        {kjole.navn}
      </Text>

      <Text>Størrelser: {kjole.stoerrelser}</Text>
      <Text>Lejepris: {kjole.pris} kr.</Text>

      <View style={[GlobalStyle.card, GalleriStyle.infoKort]}>
        <Text style={GlobalStyle.dressName}>
          Prøv den hjemme først
        </Text>

        <Text style={GalleriStyle.infoTekst}>
          Du betaler først kun for fragt. Lejebeløbet er tænkt
          som en reservation, indtil du har prøvet kjolen og
          besluttet dig.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() =>
          navigation.navigate('Bestilling', { kjole })
        }
        style={GlobalStyle.button}
      >
        <Text style={GlobalStyle.buttonText}>
          Vælg størrelse og dato
        </Text>
      </Pressable>
    </ScrollView>
  );
}