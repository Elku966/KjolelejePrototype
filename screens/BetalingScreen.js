import React, { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import * as WebBrowser from 'expo-web-browser';

import {
  ElegantText as Text,
  GlobalStyle,
} from '../styles/GlobalStyle';
import beskyttelseConfig from '../Data/Beskyttelse.json';

const SERVER_URL = process.env.EXPO_PUBLIC_API_URL;

const GULD = '#8A6A3F';
const BESKYTTELSE_PROCENT = Number(beskyttelseConfig.procent) / 100;

function formaterPris(beloeb) {
  const afrundet = Math.round(Number(beloeb) * 100) / 100;
  return afrundet % 1 === 0
    ? `${afrundet}`
    : afrundet.toFixed(2).replace('.', ',');
}

async function laesJsonSvar(response) {
  const tekst = await response.text();

  try {
    return tekst ? JSON.parse(tekst) : {};
  } catch {
    throw new Error(
      `Backend svarede med en webside i stedet for JSON (HTTP ${response.status}). ` +
      'Genstart backend og app med npm run start:all, og scan den nye QR-kode.'
    );
  }
}

export default function BetalingScreen({ kurv }) {
  const [venter, setVenter] = useState(false);
  const [betalingGennemfoert, setBetalingGennemfoert] =
    useState(false);

  const samletLejepris = kurv.reduce((sum, vare) => {
    return sum + Number(vare.kjole.pris);
  }, 0);

  const samletBeskyttelsesgebyr = kurv.reduce((sum, vare) => {
    if (!vare.beskyttelse) return sum;

    return sum + Math.round(
      Number(vare.kjole.pris) * BESKYTTELSE_PROCENT * 100
    ) / 100;
  }, 0);

  const samletPris = samletLejepris + samletBeskyttelsesgebyr;

  async function kontrollerBetaling(sessionId) {
    const response = await fetch(
      `${SERVER_URL}/checkout-status/${encodeURIComponent(sessionId)}`
    );

    const data = await laesJsonSvar(response);

    if (!response.ok) {
      throw new Error(
        data.error || 'Kunne ikke kontrollere betalingsstatus.'
      );
    }

    return data.betalt === true;
  }

  async function gaaTilStripe() {
    if (kurv.length === 0 || venter || betalingGennemfoert) {
      return;
    }

    if (!SERVER_URL) {
      Alert.alert(
        'Serveradresse mangler',
        'Backend-adressen er ikke konfigureret.'
      );
      return;
    }

    setVenter(true);

    try {
      const kjoleIds = kurv.map((vare) => vare.kjole.id);
      const beskyttelseIds = kurv
        .filter((vare) => vare.beskyttelse)
        .map((vare) => vare.kjole.id);

      const response = await fetch(
        `${SERVER_URL}/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ kjoleIds, beskyttelseIds }),
        }
      );

      const data = await laesJsonSvar(response);

      if (!response.ok || !data.url || !data.sessionId) {
        throw new Error(
          data.error || 'Betalingen kunne ikke oprettes.'
        );
      }

      await WebBrowser.openBrowserAsync(data.url);

      const betalt = await kontrollerBetaling(data.sessionId);

      if (betalt) {
        setBetalingGennemfoert(true);
      } else {
        Alert.alert(
          'Betaling ikke bekræftet',
          'Stripe har endnu ikke bekræftet betalingen. Kontroller betalingsstatus, før du forsøger igen.'
        );
      }
    } catch (error) {
      console.log('Stripe-fejl i appen:', error.message);

      Alert.alert(
        'Betalingsfejl',
        error.message || 'Prøv igen senere.'
      );
    } finally {
      setVenter(false);
    }
  }

  if (betalingGennemfoert) {
    return (
      <View
        style={[
          GlobalStyle.container,
          {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          },
        ]}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: GULD,
            textAlign: 'center',
          }}
        >
          ✓ Betaling gennemført!
        </Text>

        <Text
          style={{
            fontSize: 18,
            marginTop: 20,
            textAlign: 'center',
          }}
        >
          Din betaling er registreret hos Luxury Rentals.
        </Text>

        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: GULD,
            marginTop: 20,
          }}
        >
          {formaterPris(samletPris)} kr.
        </Text>

        <Text
          style={{
            marginTop: 20,
            textAlign: 'center',
          }}
        >
          Tak for din bestilling!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={GlobalStyle.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={GlobalStyle.title}>
        Betaling
      </Text>

      <View style={GlobalStyle.card}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          Din bestilling
        </Text>

        {kurv.map((vare) => (
          <Text
            key={vare.kurvId}
            style={{ marginTop: 12 }}
          >
            {vare.kjole.navn} – {vare.kjole.pris} kr.
            {vare.beskyttelse && (
              <Text>
                {'\n'}Beskyttelse ({beskyttelseConfig.procent} %):{' '}
                {formaterPris(
                  Number(vare.kjole.pris) * BESKYTTELSE_PROCENT
                )} kr.
              </Text>
            )}
          </Text>
        ))}
      </View>

      <View style={GlobalStyle.card}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          Samlet pris
        </Text>

        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: GULD,
            marginTop: 12,
          }}
        >
          {formaterPris(samletPris)} kr.
        </Text>

        <Text style={{ marginTop: 8 }}>
          Fragt er ikke medregnet. Valgt beskyttelse er inkluderet i totalen.
        </Text>
      </View>

      <Pressable
        onPress={gaaTilStripe}
        disabled={venter || kurv.length === 0}
        style={[
          GlobalStyle.button,
          (venter || kurv.length === 0) && {
            opacity: 0.5,
          },
        ]}
      >
        <Text style={GlobalStyle.buttonText}>
          {venter ? 'Kontrollerer betaling...' : 'Betal med Stripe'}
        </Text>
      </Pressable>

      {venter && (
        <ActivityIndicator
          size="large"
          color={GULD}
          style={{ marginTop: 20 }}
        />
      )}

      <Text
        style={{
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        Betalingen gennemføres sikkert hos Stripe.
        Dette er en testbetaling i Sandbox.
      </Text>
    </ScrollView>
  );
}