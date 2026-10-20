import React from 'react';
import {
  View,
  ScrollView,
  Pressable,
} from 'react-native';

import { Image } from 'expo-image';

import {
  ElegantText as Text,
  GlobalStyle,
} from '../styles/GlobalStyle';
import beskyttelseConfig from '../Data/Beskyttelse.json';

const GULD = '#8A6A3F';
const BESKYTTELSE_PROCENT = Number(beskyttelseConfig.procent) / 100;

function formaterPris(beloeb) {
  const afrundet = Math.round(Number(beloeb) * 100) / 100;
  return afrundet % 1 === 0
    ? `${afrundet}`
    : afrundet.toFixed(2).replace('.', ',');
}

export default function KurvScreen({ kurv, fjernFraKurv, navigation }) {
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

  function gaaTilBetaling() {
    navigation.navigate('Betaling');
  }

  return (
    <ScrollView
      style={GlobalStyle.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={GlobalStyle.title}>
        Min kurv
      </Text>

      {kurv.length === 0 ? (
        <View style={GlobalStyle.card}>
          <Text>Din kurv er tom.</Text>
          <Text style={{ marginTop: 8 }}>
            Gå til Kjoler og find din favoritkjole.
          </Text>
        </View>
      ) : (
        <>
          {kurv.map((vare) => (
            <View
              key={vare.kurvId}
              style={GlobalStyle.card}
            >
              <Image
                source={vare.kjole.billede}
                contentFit="contain"
                style={{
                  width: '100%',
                  height: 220,
                  marginBottom: 12,
                }}
              />

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

              {vare.beskyttelse && (
                <Text
                  style={{
                    marginTop: 6,
                    color: GULD,
                    fontWeight: 'bold',
                  }}
                >
                  Beskyttelsesgebyr ({beskyttelseConfig.procent} %):{' '}
                  {formaterPris(
                    Number(vare.kjole.pris) * BESKYTTELSE_PROCENT
                  )} kr.
                </Text>
              )}

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
              {formaterPris(samletPris)} kr.
            </Text>

            <Text style={{ marginTop: 8 }}>
              Fragt er ikke medregnet. Valgt beskyttelse er lagt til.
            </Text>
          </View>

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