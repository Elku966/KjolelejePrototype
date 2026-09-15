import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ElegantText as Text } from '../styles/GlobalStyle';

// Farver, der bruges flere steder på siden
const GULD = '#8A6A3F';
const BAGGRUND = '#F7F1E8';

export default function BestillingScreen({ route }) {
  // Henter den kjole, som brugeren valgte på den forrige side
  const kjole = route.params?.kjole;

  // Gemmer brugerens valg, mens siden er åben
  const [stoerrelse, setStoerrelse] = useState('');
  const [dato, setDato] = useState(null);
  const [visKalender, setVisKalender] = useState(false);
  const [beskyttelse, setBeskyttelse] = useState(false);

  // Viser en besked, hvis brugeren åbner siden uden at have valgt en kjole
  if (!kjole) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: BAGGRUND }}>
        <Text>Vælg først en kjole i Kjoler-fanen.</Text>
      </View>
    );
  }

  // Laver størrelserne om fra tekst til en liste, fx "S, M, L" → ["S", "M", "L"]
  const stoerrelser = kjole.stoerrelser.split(', ');

  // Den tidligste mulige dato er 14 dage fra i dag
  const tidligsteDato = new Date();
  tidligsteDato.setHours(0, 0, 0, 0);
  tidligsteDato.setDate(tidligsteDato.getDate() + 14);

  // Gemmer den dato, som brugeren vælger i kalenderen
  function vaelgDato(event, valgtDato) {
    // På Android lukkes datovælgeren efter et valg
    if (Platform.OS === 'android') {
      setVisKalender(false);
    }

    // Hvis brugeren valgte en dato, gemmes den
    if (valgtDato) {
      setDato(valgtDato);
    }
  }

  // Viser brugerens valg i en besked — der gennemføres ingen rigtig bestilling
  function visOpsummering() {
    if (!stoerrelse || !dato) {
      Alert.alert('Mangler oplysninger', 'Vælg størrelse og dato.');
      return;
    }

    Alert.alert(
      'Prøv-hjem-forespørgsel',
      `${kjole.navn}\nStørrelse: ${stoerrelse}\nDato: ${dato.toLocaleDateString('da-DK')}\nBeskyttelse: ${beskyttelse ? 'Ja' : 'Nej'}\n\nDette er kun en demo. Ingen bestilling, betaling eller forsikring er gennemført.`
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: BAGGRUND }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Prøv {kjole.navn} hjemme
      </Text>

      {/* Brugeren vælger en af kjolens tilgængelige størrelser */}
      <Text style={{ marginTop: 24, fontWeight: 'bold' }}>Vælg størrelse</Text>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        {stoerrelser.map((valg) => (
          <Pressable
            key={valg}
            onPress={() => setStoerrelse(valg)}
            style={{
              padding: 12,
              marginRight: 8,
              borderRadius: 8,
              backgroundColor: stoerrelse === valg ? GULD : 'white',
            }}
          >
            <Text style={{ color: stoerrelse === valg ? 'white' : 'black' }}>
              {valg}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Et tryk på feltet åbner kalenderen */}
      <Text style={{ marginTop: 24, fontWeight: 'bold' }}>
        Dato for begivenheden
      </Text>
      <Pressable
        onPress={() => setVisKalender(true)}
        style={{
          marginTop: 8,
          padding: 14,
          backgroundColor: 'white',
          borderRadius: 8,
        }}
      >
        <Text>{dato ? dato.toLocaleDateString('da-DK') : 'Tryk for at vælge dato'}</Text>
      </Pressable>

      {/* Kalenderen vises kun, når visKalender er true */}
      {visKalender && (
        <>
          <DateTimePicker
            value={dato || tidligsteDato}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            minimumDate={tidligsteDato}
            onValueChange={vaelgDato}
            onDismiss={() => setVisKalender(false)}
          />

          {/* På iPhone får brugeren en knap til at lukke kalenderen */}
          {Platform.OS === 'ios' && (
            <Pressable onPress={() => setVisKalender(false)}>
              <Text style={{ color: GULD, fontWeight: 'bold', marginTop: 8 }}>
                Vælg denne dato
              </Text>
            </Pressable>
          )}
        </>
      )}

      {/* Valgfrit tilvalg, som brugeren kan slå til og fra */}
      <Text style={{ marginTop: 24, fontWeight: 'bold' }}>
        Valgfri beskyttelse
      </Text>
      <Text style={{ marginTop: 6 }}>
        Tænkt til mindre, hændelige skader under normal brug. Pris og vilkår
        er ikke fastlagt i prototypen.
      </Text>

      <Pressable
        onPress={() => setBeskyttelse(!beskyttelse)}
        style={{
          marginTop: 12,
          padding: 14,
          borderRadius: 8,
          backgroundColor: beskyttelse ? GULD : 'white',
        }}
      >
        <Text style={{ color: beskyttelse ? 'white' : 'black', fontWeight: 'bold' }}>
          {beskyttelse ? '✓ Beskyttelse valgt' : 'Tilvælg beskyttelse'}
        </Text>
      </Pressable>

      {/* Prisen er kun information; appen beregner ikke fragt eller beskyttelse */}
      <Text style={{ marginTop: 24 }}>
        Lejepris: {kjole.pris} kr. Fragt og beskyttelse er ikke beregnet i
        denne prototype.
      </Text>

      {/* Viser en opsummering af valgene i stedet for at sende en bestilling */}
      <Pressable
        onPress={visOpsummering}
        style={{
          marginTop: 24,
          padding: 14,
          borderRadius: 8,
          backgroundColor: GULD,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Vis min forespørgsel
        </Text>
      </Pressable>
    </ScrollView>
  );
}