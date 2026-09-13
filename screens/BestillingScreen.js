import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ElegantText as Text } from '../styles/GlobalStyle';

const GULD = '#8A6A3F';
const BAGGRUND = '#F7F1E8';

export default function BestillingScreen({ route }) {
  const kjole = route.params?.kjole;
  const [stoerrelse, setStoerrelse] = useState('');
  const [dato, setDato] = useState(null);
  const [visKalender, setVisKalender] = useState(false);
  const [beskyttelse, setBeskyttelse] = useState(false);

  if (!kjole) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: BAGGRUND }}>
        <Text>Vælg først en kjole i Kjoler-fanen.</Text>
      </View>
    );
  }

  const stoerrelser = kjole.stoerrelser.split(', ');
  const tidligsteDato = new Date();
  tidligsteDato.setHours(0, 0, 0, 0);
  tidligsteDato.setDate(tidligsteDato.getDate() + 14);

  function vaelgDato(event, valgtDato) {
    if (Platform.OS === 'android') {
      setVisKalender(false);
    }

    if (valgtDato) {
      setDato(valgtDato);
    }
  }

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
          {Platform.OS === 'ios' && (
            <Pressable onPress={() => setVisKalender(false)}>
              <Text style={{ color: GULD, fontWeight: 'bold', marginTop: 8 }}>
                Vælg denne dato
              </Text>
            </Pressable>
          )}
        </>
      )}

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

      <Text style={{ marginTop: 24 }}>
        Lejepris: {kjole.pris} kr. Fragt og beskyttelse er ikke beregnet i
        denne prototype.
      </Text>

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
