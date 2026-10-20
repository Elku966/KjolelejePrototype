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

// NY KODE START - Stripe betalingsside

// Henter backend-adressen fra den automatiske opstart.
// Underviseren behøver derfor ikke ændre IP-adressen i koden.
const SERVER_URL = process.env.EXPO_PUBLIC_API_URL;

const GULD = '#8A6A3F';

// Læser serversvaret sikkert, så en HTML-fejlside ikke giver
// den uforståelige fejl "JSON Parse error: Unexpected character: <".
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

  // Holder styr på, om betalingen behandles.
  const [venter, setVenter] = useState(false);

  // NY KODE START - Betalingsbekræftelse
  // Gemmer om betalingen er bekræftet af Stripe.
  const [betalingGennemfoert, setBetalingGennemfoert] =
    useState(false);
  // NY KODE SLUT - Betalingsbekræftelse

  // Genbruger prisberegningen fra KurvScreen.js.
  const samletPris = kurv.reduce((sum, vare) => {
    return sum + Number(vare.kjole.pris);
  }, 0);

  // NY KODE START - Kontrol af betalingsstatus
  // Kontakter backend for at kontrollere,
  // om Stripe har registreret betalingen.
  async function kontrollerBetaling(sessionId) {

    const response = await fetch(
      `${SERVER_URL}/checkout-status/${encodeURIComponent(sessionId)}`
    );

    const data = await laesJsonSvar(response);

    if (!response.ok) {
      throw new Error(data.error || 'Kunne ikke kontrollere betalingsstatus.');
    }

    return data.betalt === true;
  }
  // NY KODE SLUT - Kontrol af betalingsstatus

  // Opretter én samlet Stripe-betaling for kurven.
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

      // Henter kjolernes ID'er fra kurven.
      const kjoleIds = kurv.map((vare) => vare.kjole.id);

      // Sender bestillingen til backend.
      const response = await fetch(
        `${SERVER_URL}/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ kjoleIds }),
        }
      );

      const data = await laesJsonSvar(response);

      if (!response.ok || !data.url || !data.sessionId) {
        throw new Error(
          data.error || 'Betalingen kunne ikke oprettes.'
        );
      }

      // NY KODE START - Åbn Stripe Checkout
      // Åbner Stripe i en browser inde i appen.
      // Kunden lukker selv browseren efter betalingen.
      const browserResult = await WebBrowser.openBrowserAsync(
        data.url
      );
      // NY KODE SLUT - Åbn Stripe Checkout

      // NY KODE START - Kontrollér betaling efter browseren
      // Når kunden lukker browseren, undersøges
      // betalingsstatus direkte hos Stripe.
      //
      // Vi viser aldrig en succesbesked alene,
      // fordi browseren er blevet lukket.

      const betalt = await kontrollerBetaling(data.sessionId);

      if (betalt) {
        setBetalingGennemfoert(true);
      } else {
        Alert.alert(
          'Betaling ikke bekræftet',
          'Stripe har endnu ikke bekræftet betalingen. Kontroller betalingsstatus, før du forsøger igen.'
        );
      }

      // NY KODE SLUT - Kontrollér betaling efter browseren

    } catch (error) {

      // NY KODE START - Stripe fejlfinding
      // Udskriver fejl i Expo-terminalen.
      console.log('Stripe-fejl i appen:', error.message);
      // NY KODE SLUT - Stripe fejlfinding

      Alert.alert(
        'Betalingsfejl',
        error.message || 'Prøv igen senere.'
      );

    } finally {
      setVenter(false);
    }
  }

  // NY KODE START - Vis bekræftelse efter betaling
  // Denne side vises kun, hvis backend har bekræftet,
  // at Stripe registrerer betalingen som gennemført.

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
          {samletPris} kr.
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

  // NY KODE SLUT - Vis bekræftelse efter betaling

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
          {samletPris} kr.
        </Text>

        <Text style={{ marginTop: 8 }}>
          Fragt og eventuel beskyttelse er ikke
          medregnet i prisen.
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
          {venter
            ? 'Kontrollerer betaling...'
            : 'Betal med Stripe'}
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

// NY KODE SLUT - Stripe betalingsside
