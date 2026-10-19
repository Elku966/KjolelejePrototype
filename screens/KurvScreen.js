import React from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';

import { Image } from 'expo-image';

import {
  ElegantText as Text,
  GlobalStyle,
} from '../styles/GlobalStyle';

// Appens eksisterende guldfarve
const GULD = '#8A6A3F';

export default function KurvScreen({ kurv, fjernFraKurv }) {

  // Udregner den samlede lejepris for kjolerne
  const samletPris = kurv.reduce((sum, vare) => {
    return sum + Number(vare.kjole.pris);
  }, 0);

  // Betalingsknappen er foreløbig kun en demo
  function gaaTilBetaling() {
    Alert.alert(
      'Gå til betaling',
      'Dette er en prototype. Betalingsfunktionen er endnu ikke implementeret.'
    );
  }

  return (
    <ScrollView
      style={GlobalStyle.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >

      <Text style={GlobalStyle.title}>
        Min kurv
      </Text>

      {/* Hvis kunden endnu ikke har valgt en kjole */}
      {kurv.length === 0 ? (
        <View style={GlobalStyle.card}>
          <Text>
            Din kurv er tom.
          </Text>
          <Text style={{ marginTop: 8 }}>
            Gå til Kjoler og find din favoritkjole.
          </Text>
        </View>
      ) : (
        <>
          {/* Viser alle kjoler, kunden har tilføjet */}
          {kurv.map((vare) => (
            <View
              key={vare.kurvId}
              style={GlobalStyle.card}
            >

              {/* Kjolens billede */}
              <Image
                source={vare.kjole.billede}
                contentFit="contain"
                style={{
                  width: '100%',
                  height: 220,
                  marginBottom: 12,
                }}
              />

              {/* Kjolens navn */}
              <Text style={GlobalStyle.dressName}>
                {vare.kjole.navn}
              </Text>

              <Text style={{ marginTop: 12 }}>
                Størrelse: {vare.stoerrelse}
              </Text>

              <Text style={{ marginTop: 6 }}>
                Dato: {vare.dato}
              </Text>

              <Text style={{ marginTop: 6 }}>
                Beskyttelse: {vare.beskyttelse ? 'Ja' : 'Nej'}
              </Text>

              <Text
                style={{
                  marginTop: 12,
                  fontWeight: 'bold',
                  fontSize: 18,
                }}
              >
                Lejepris: {vare.kjole.pris} kr.
              </Text>

              {/* Kunden kan fjerne kjolen fra kurven */}
              <Pressable
                onPress={() => fjernFraKurv(vare.kurvId)}
                style={{
                  marginTop: 16,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: GULD,
                }}
              >
                <Text
                  style={{
                    color: GULD,
                    textAlign: 'center',
                  }}
                >
                  Fjern fra kurv
                </Text>
              </Pressable>

            </View>
          ))}

          {/* Viser den samlede pris */}
          <View style={GlobalStyle.card}>

            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              Samlet pris
            </Text>

            <Text
              style={{
                fontSize: 24,
                marginTop: 12,
                color: GULD,
                fontWeight: 'bold',
              }}
            >
              {samletPris} kr.
            </Text>

            <Text style={{ marginTop: 8 }}>
              Fragt og eventuel beskyttelse er ikke
              medregnet i prisen.
            </Text>

          </View>

          {/* Knappen til betaling */}
          <Pressable
            onPress={gaaTilBetaling}
            style={GlobalStyle.button}
          >
            <Text style={GlobalStyle.buttonText}>
              Gå til betaling
            </Text>
          </Pressable>

        </>
      )}

    </ScrollView>
  );
}