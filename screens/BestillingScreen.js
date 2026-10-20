import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { ElegantText as Text } from '../styles/GlobalStyle';
import beskyttelseConfig from '../Data/Beskyttelse.json';

const GULD = '#8A6A3F';
const BAGGRUND = '#F7F1E8';
const BESKYTTELSE_PROCENT = Number(beskyttelseConfig.procent) / 100;

function formaterPris(beloeb) {
  const afrundet = Math.round(Number(beloeb) * 100) / 100;
  return afrundet % 1 === 0
    ? `${afrundet}`
    : afrundet.toFixed(2).replace('.', ',');
}

export default function BestillingScreen({
  route,
  navigation,
  tilfoejTilKurv,
}) {
  //kjolen sendes med navigationen fra kjoleoversigten eller detaljesiden.
  const kjole = route.params?.kjole;

  const [stoerrelse, setStoerrelse] = useState('');
  const [dato, setDato] = useState(null);
  const [visKalender, setVisKalender] = useState(false);
  const [beskyttelse, setBeskyttelse] = useState(false);

  //forhindrer i prototypen, at kunden vælger en dato mindre end 14 dage væk.
  const tidligsteDato = new Date();
  tidligsteDato.setHours(0, 0, 0, 0);
  tidligsteDato.setDate(tidligsteDato.getDate() + 14);

  function vaelgDato(event, valgtDato) {
    //android lukker datovælgeren med det samme; iOS har en separat knap.
    if (Platform.OS === 'android') {
      setVisKalender(false);
    }

    if (event.type === 'dismissed') {
      return;
    }

    if (valgtDato) {
      setDato(valgtDato);
    }
  }

  function sendTilKurv() {
    //kræver størrelsen og datoen, så kurven indeholder det, der skal bestilles.
    if (!stoerrelse || !dato) {
      Alert.alert(
        'Mangler oplysninger',
        'Vælg venligst både størrelse og dato, før du tilføjer kjolen til kurven.'
      );
      return;
    }

    if (!kjole) {
      Alert.alert(
        'Ingen kjole valgt',
        'Gå tilbage til Kjoler og vælg en kjole først.'
      );
      return;
    }

    const vare = {
      kjole,
      stoerrelse,
      dato: dato.toLocaleDateString('da-DK'),
      beskyttelse,
    };

    //gemmer kjolevalg og lejevalg samlet som én linje i appens kurv.
    tilfoejTilKurv(vare);

    setStoerrelse('');
    setDato(null);
    setBeskyttelse(false);
    setVisKalender(false);

    navigation.navigate('Kurv');
  }

  if (!kjole) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 20,
          backgroundColor: BAGGRUND,
        }}
      >
        <Text>Vælg først en kjole i Kjoler-fanen.</Text>

        <Pressable
          onPress={() => navigation.navigate('Kjoler')}
          style={{
            marginTop: 20,
            padding: 14,
            borderRadius: 8,
            backgroundColor: GULD,
          }}
        >
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            Se kjoler
          </Text>
        </Pressable>
      </View>
    );
  }

  const stoerrelser = kjole.stoerrelser
    .split(',')
    .map((stoerrelse) => stoerrelse.trim());

  //viser gebyret med ørepræcision; backend beregner også beløbet ved betaling.
  const beskyttelsesgebyr = beskyttelse
    ? Math.round(
        Number(kjole.pris) * BESKYTTELSE_PROCENT * 100
      ) / 100
    : 0;

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: BAGGRUND,
      }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        Prøv {kjole.navn} hjemme
      </Text>

      <Text
        style={{
          marginTop: 24,
          fontWeight: 'bold',
        }}
      >
        Vælg størrelse
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: 8,
        }}
      >
        {stoerrelser.map((valg) => (
          <Pressable
            key={valg}
            onPress={() => setStoerrelse(valg)}
            style={{
              padding: 12,
              marginRight: 8,
              marginBottom: 8,
              borderRadius: 8,
              backgroundColor: stoerrelse === valg ? GULD : 'white',
            }}
          >
            <Text
              style={{
                color: stoerrelse === valg ? 'white' : 'black',
              }}
            >
              {valg}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text
        style={{
          marginTop: 24,
          fontWeight: 'bold',
        }}
      >
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
        <Text>
          {dato
            ? dato.toLocaleDateString('da-DK')
            : 'Tryk for at vælge dato'}
        </Text>
      </Pressable>

      {visKalender && (
        <>
          <DateTimePicker
            value={dato || tidligsteDato}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            minimumDate={tidligsteDato}
            onChange={vaelgDato}
          />

          {Platform.OS === 'ios' && (
            <Pressable
              onPress={() => setVisKalender(false)}
              style={{ marginTop: 12 }}
            >
              <Text
                style={{
                  color: GULD,
                  fontWeight: 'bold',
                }}
              >
                Vælg denne dato
              </Text>
            </Pressable>
          )}
        </>
      )}

      <Text
        style={{
          marginTop: 24,
          fontWeight: 'bold',
        }}
      >
        Valgfri beskyttelse
      </Text>

      <Text style={{ marginTop: 6 }}>
        Valgfri beskyttelse koster {beskyttelseConfig.procent} % af
        lejeprisen. Vilkårene for beskyttelsen skal aftales separat.
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
        <Text
          style={{
            color: beskyttelse ? 'white' : 'black',
            fontWeight: 'bold',
          }}
        >
          {beskyttelse ? '✓ Beskyttelse valgt' : 'Tilvælg beskyttelse'}
        </Text>
      </Pressable>

      {beskyttelse && (
        <Text
          style={{
            marginTop: 8,
            color: GULD,
            fontWeight: 'bold',
          }}
        >
          Beskyttelsesgebyr: {formaterPris(beskyttelsesgebyr)} kr.
        </Text>
      )}

      <View
        style={{
          marginTop: 24,
          padding: 16,
          backgroundColor: 'white',
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: GULD,
          }}
        >
          Lejepris: {kjole.pris} kr.
        </Text>

        {beskyttelse && (
          <Text
            style={{
              marginTop: 8,
              color: GULD,
              fontWeight: 'bold',
            }}
          >
            Beskyttelse ({beskyttelseConfig.procent} %):{' '}
            {formaterPris(beskyttelsesgebyr)} kr.
          </Text>
        )}

        <Text
          style={{
            marginTop: 8,
            fontSize: 13,
          }}
        >
          Fragt er ikke medregnet. Beskyttelse koster{' '}
          {beskyttelseConfig.procent} % af lejeprisen.
        </Text>
      </View>

      <Pressable
        onPress={sendTilKurv}
        style={{
          marginTop: 24,
          padding: 14,
          borderRadius: 8,
          backgroundColor: GULD,
        }}
      >
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          Tilføj til kurv
        </Text>
      </Pressable>
    </ScrollView>
  );
}
