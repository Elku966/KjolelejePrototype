import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { ElegantText as Text } from '../styles/GlobalStyle';
import beskyttelseConfig from '../Data/Beskyttelse.json';
import prisConfig from '../Data/PrisKonfiguration.json';

const GULD = '#8A6A3F';
const BAGGRUND = '#F7F1E8';
const BESKYTTELSE_PROCENT = Number(beskyttelseConfig.procent) / 100;
const FRAGT_PR_ORDRE = Number(prisConfig.fragtPrOrdre);
const SERVER_URL = process.env.EXPO_PUBLIC_API_URL;

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
  const [ledighedStatus, setLedighedStatus] = useState('idle');
  const [ledighedBesked, setLedighedBesked] = useState('');
  const ledighedRequest = useRef(0);
  const ledighedTimer = useRef(null);
  const ledighedAbort = useRef(null);

  useEffect(() => () => {
    clearTimeout(ledighedTimer.current);
    ledighedAbort.current?.abort();
  }, []);

  //forhindrer i prototypen, at kunden vælger en dato mindre end 14 dage væk.
  const tidligsteDato = new Date();
  tidligsteDato.setHours(0, 0, 0, 0);
  tidligsteDato.setDate(tidligsteDato.getDate() + 14);

  function datoTilISO(vaelgtDato) {
    const aar = vaelgtDato.getFullYear();
    const maaned = String(vaelgtDato.getMonth() + 1).padStart(2, '0');
    const dag = String(vaelgtDato.getDate()).padStart(2, '0');
    return `${aar}-${maaned}-${dag}`;
  }

  async function kontrollerLedighed(valgtStoerrelse, valgtDato) {
    clearTimeout(ledighedTimer.current);
    ledighedAbort.current?.abort();
    const requestId = ++ledighedRequest.current;

    if (!valgtStoerrelse || !valgtDato) {
      setLedighedStatus('idle');
      setLedighedBesked('Vælg både størrelse og dato for at kontrollere ledighed.');
      return;
    }

    if (!SERVER_URL) {
      setLedighedStatus('error');
      setLedighedBesked('Serveradressen mangler. Genstart appen med npm run start:all.');
      return;
    }

    setLedighedStatus('checking');
    setLedighedBesked('Kontrollerer ledighed…');
    const controller = new AbortController();
    ledighedAbort.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${SERVER_URL}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kjoleId: String(kjole.id),
          stoerrelse: valgtStoerrelse,
          dato: datoTilISO(valgtDato),
        }),
        signal: controller.signal,
      });

      const resultat = await response.json();

      if (!response.ok) {
        throw new Error(resultat.error || 'Kunne ikke kontrollere ledighed.');
      }

      if (requestId !== ledighedRequest.current) return;

      if (resultat.ledig) {
        setLedighedStatus('available');
        setLedighedBesked('Kjolen og størrelsen er ledig i hele lejeperioden.');
      } else {
        setLedighedStatus('unavailable');
        setLedighedBesked('Kjolen i denne størrelse er optaget i en del af lejeperioden.');
      }
    } catch (error) {
      if (requestId !== ledighedRequest.current) return;
      setLedighedStatus('error');
      setLedighedBesked(
        error.name === 'AbortError'
          ? 'Ledighedstjekket tog for lang tid. Kontrollér forbindelsen, og prøv igen.'
          : error.message || 'Ledighed kunne ikke kontrolleres. Prøv igen.'
      );
    } finally {
      clearTimeout(timeoutId);
      if (ledighedAbort.current === controller) {
        ledighedAbort.current = null;
      }
    }
  }

  function planlaegLedighedstjek(valgtStoerrelse, valgtDato) {
    clearTimeout(ledighedTimer.current);
    ledighedAbort.current?.abort();
    // Ignorerer straks svar fra et tidligere valg, mens kunden ændrer dato.
    ledighedRequest.current += 1;
    setLedighedStatus('checking');
    setLedighedBesked('Kontrollerer ledighed…');
    ledighedTimer.current = setTimeout(() => {
      kontrollerLedighed(valgtStoerrelse, valgtDato);
    }, 350);
  }

  function vaelgStoerrelse(valg) {
    setStoerrelse(valg);
    if (dato) {
      planlaegLedighedstjek(valg, dato);
    }
  }

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
      if (stoerrelse) {
        planlaegLedighedstjek(stoerrelse, valgtDato);
      } else {
        clearTimeout(ledighedTimer.current);
        ledighedRequest.current += 1;
        setLedighedStatus('idle');
        setLedighedBesked('Vælg en størrelse for at kontrollere datoen.');
      }
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

    if (ledighedStatus !== 'available') {
      Alert.alert(
        'Ledighed ikke bekræftet',
        ledighedStatus === 'unavailable'
          ? 'Vælg en anden dato eller størrelse.'
          : 'Vent på ledighedstjekket, eller tryk på “Kontroller dato igen”.'
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
    clearTimeout(ledighedTimer.current);
    ledighedRequest.current += 1;
    setLedighedStatus('idle');
    setLedighedBesked('');

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
            onPress={() => vaelgStoerrelse(valg)}
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

      <View
        style={{
          marginTop: 12,
          padding: 14,
          backgroundColor: 'white',
          borderRadius: 8,
        }}
      >
        <Text style={{ fontWeight: 'bold', color: GULD }}>
          Levering og returnering
        </Text>
        <Text style={{ marginTop: 6 }}>
          Planlagt levering: 7 dage før begivenheden.
        </Text>
        <Text style={{ marginTop: 4 }}>
          Returnér senest 7 dage efter begivenheden.
        </Text>
        <Text style={{ marginTop: 4 }}>
          Lejeperiode i alt: 14 dage.
        </Text>
        <Text style={{ marginTop: 10 }}>
          Hvis sikkerhedsmærket mangler ved returnering, registreres kjolen
          som brugt til begivenheden.
        </Text>
      </View>

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

      <View style={{ marginTop: 10, minHeight: 28 }}>
        {ledighedStatus === 'checking' && (
          <ActivityIndicator color={GULD} style={{ marginBottom: 6 }} />
        )}
        {!!ledighedBesked && (
          <Text
            accessibilityLiveRegion="polite"
            style={{
              color:
                ledighedStatus === 'available'
                  ? '#2F6B3D'
                  : ledighedStatus === 'unavailable' || ledighedStatus === 'error'
                    ? '#A33B32'
                    : '#685740',
            }}
          >
            {ledighedBesked}
          </Text>
        )}
        {dato && stoerrelse && ledighedStatus !== 'checking' && (
          <Pressable
            accessibilityRole="button"
            onPress={() => kontrollerLedighed(stoerrelse, dato)}
            style={{ marginTop: 8, alignSelf: 'flex-start' }}
          >
            <Text style={{ color: GULD, fontWeight: 'bold' }}>
              Kontroller dato igen
            </Text>
          </Pressable>
        )}
      </View>

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
        lejeprisen. Kontakt os inden betaling for at få oplyst, hvilke skader
        beskyttelsen dækker.
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
          Fragt: {formaterPris(FRAGT_PR_ORDRE)} kr. pr. ordre. Den lægges til
          ved betaling. Beskyttelse koster {beskyttelseConfig.procent} % af
          lejeprisen.
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
