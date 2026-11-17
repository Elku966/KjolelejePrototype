import React, { useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';

import {
  ElegantText as Text,
  GlobalStyle,
  GalleriStyle,
} from '../styles/GlobalStyle';

// Vejledende kropsmål i cm for hver almindelig bogstavstørrelse.
// Det er kropsomkreds (ikke tøjets bredde målt fladt).
const kropsStoerrelser = {
  XS: { bryst: 76, talje: 60, hofte: 84 },
  S: { bryst: 80, talje: 64, hofte: 88 },
  M: { bryst: 84, talje: 68, hofte: 92 },
  L: { bryst: 88, talje: 72, hofte: 96 },
  XL: { bryst: 92, talje: 76, hofte: 100 },
  '2XL': { bryst: 96, talje: 80, hofte: 104 },
  XXL: { bryst: 96, talje: 80, hofte: 104 },
  '3XL': { bryst: 100, talje: 84, hofte: 108 },
  '4XL': { bryst: 104, talje: 88, hofte: 112 },
};

function KjoleGalleri({ kjole }) {
  //holder styr på fotoet og måler visningsbredden til swipe-siderne.
  const [valgtIndex, setValgtIndex] = useState(0);
  const [bredde, setBredde] = useState(0);
  const galleriRef = useRef(null);

  const billeder = kjole.billeder?.length
    ? kjole.billeder
    : [kjole.billede];

  //skifter til det billede, brugeren trykker på.
  function visBillede(index) {
    setValgtIndex(index);

    galleriRef.current?.scrollTo({
      x: index * bredde,
      animated: true,
    });
  }

  //opdaterer tælleren, når brugeren swiper.
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
          //billedets bredde bruges til at beregne, hvor langt et swipe flytter.
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
  const [visStoerrelsesguide, setVisStoerrelsesguide] = useState(false);

  //skærmen får den valgte kjole sendt med fra kjolekortet.
  const kjole = route.params?.kjole;

  //vises, hvis brugeren åbner fanen uden at vælge en kjole.
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

  const tilgaengeligeStoerrelser = kjole.stoerrelser
    .split(',')
    .map((stoerrelse) => stoerrelse.trim())
    .filter(Boolean);

  const kjoleMaal = kjole.maal || {};
  const harKjoleMaal = Object.values(kjoleMaal).some(
    (maal) => typeof maal === 'number'
  );

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

      <Text style={GalleriStyle.materiale}>
        Materiale: {kjole.materiale || 'Oplysninger mangler'}
      </Text>

      <Text>Størrelser: {kjole.stoerrelser}</Text>
      <Text>Lejepris: {kjole.pris} kr.</Text>

      <View style={[GlobalStyle.card, GalleriStyle.infoKort]}>
        <Text style={GlobalStyle.dressName}>Pasform og mål</Text>

        <Text style={GalleriStyle.infoTekst}>
          {kjole.pasform || 'Pasform er endnu ikke oplyst.'}
        </Text>

        <Text style={GalleriStyle.maaltitel}>Kjolens mål</Text>

        {harKjoleMaal ? (
          [
            ['Bryst', kjoleMaal.bryst],
            ['Talje', kjoleMaal.talje],
            ['Hofte', kjoleMaal.hofte],
            ['Kjolelængde', kjoleMaal.kjoleLaengde],
          ].map(([label, maal]) => (
            <Text key={label} style={GalleriStyle.maallinje}>
              {label}: {typeof maal === 'number' ? `${maal} cm` : '—'}
            </Text>
          ))
        ) : (
          <Text style={GalleriStyle.infoTekst}>
            Mål din krop med guiden nedenfor. De præcise mål på selve kjolen
            er endnu ikke registreret.
          </Text>
        )}

        <Pressable
          accessibilityRole="button"
          onPress={() => setVisStoerrelsesguide(true)}
          style={GalleriStyle.guideKnap}
        >
          <Text style={GalleriStyle.guideKnapTekst}>
            Åbn størrelsesguide
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={visStoerrelsesguide}
        animationType="slide"
        transparent
        onRequestClose={() => setVisStoerrelsesguide(false)}
      >
        <View style={GalleriStyle.modalBaggrund}>
          <View style={GalleriStyle.modalKort}>
            <ScrollView
              style={GalleriStyle.modalIndhold}
              contentContainerStyle={GalleriStyle.modalIndholdContainer}
              showsVerticalScrollIndicator
            >
            <Text style={GalleriStyle.modalTitel}>
              Størrelsesguide til {kjole.navn}
            </Text>

            <Text style={GalleriStyle.maaltitel}>
              Vejledende kropsmål (cm)
            </Text>
            <Text style={GalleriStyle.modalTekst}>
              Målene er omkreds rundt om kroppen. Tabellen viser kun de
              størrelser, der er tilgængelige i denne kjole.
            </Text>

            <View style={GalleriStyle.stoerrelsesListe}>
              <View style={GalleriStyle.stoerrelsesRae}>
                <Text style={GalleriStyle.guideKolonneTitel}>Størrelse</Text>
                <Text style={GalleriStyle.guideKolonneTitel}>Bryst</Text>
                <Text style={GalleriStyle.guideKolonneTitel}>Talje</Text>
                <Text style={GalleriStyle.guideKolonneTitel}>Hofte</Text>
              </View>
              {tilgaengeligeStoerrelser.map((stoerrelse) => {
                const maal = kropsStoerrelser[stoerrelse.toUpperCase()];

                return (
                  <View
                    key={`${kjole.id}-guide-${stoerrelse}`}
                    style={GalleriStyle.stoerrelsesRae}
                  >
                    <Text style={GalleriStyle.guideMaelTekst}>
                      {stoerrelse}
                    </Text>
                    <Text style={GalleriStyle.guideMaelTekst}>
                      {maal ? `${maal.bryst} cm` : '—'}
                    </Text>
                    <Text style={GalleriStyle.guideMaelTekst}>
                      {maal ? `${maal.talje} cm` : '—'}
                    </Text>
                    <Text style={GalleriStyle.guideMaelTekst}>
                      {maal ? `${maal.hofte} cm` : '—'}
                    </Text>
                  </View>
                );
              })}
            </View>

            <Text style={GalleriStyle.maaltitel}>Sådan måler du dig</Text>

            <Text style={GalleriStyle.modalTekst}>
              Bryst: Mål rundt om det bredeste sted på brystet.{'\n'}
              Talje: Mål rundt om det smalleste sted på maven.{'\n'}
              Hofte: Mål rundt om det bredeste sted over hofterne.{'\n'}
              Hold målebåndet vandret og tæt ind til kroppen uden at stramme.
            </Text>

            <Text style={GalleriStyle.guideNote}>
              Dette er en generel størrelsesreference for kropsmål, ikke en
              fysisk opmåling af kjolerne. Pasformen kan variere efter kjolens
              snit og materiale. Hvis dine mål ligger mellem to størrelser,
              anbefaler vi, at du kontakter os.
            </Text>
            </ScrollView>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Luk størrelsesguide"
              onPress={() => setVisStoerrelsesguide(false)}
              style={GalleriStyle.modalLukKnap}
            >
              <Text style={GlobalStyle.buttonText}>Luk guide</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
