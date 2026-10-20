import React from 'react';
import {
  Alert,
  View,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';

import { Image } from 'expo-image';

import {
  ElegantText as Text,
  GlobalStyle,
} from '../styles/GlobalStyle';
import beskyttelseConfig from '../Data/Beskyttelse.json';

//appens eksisterende guldfarve
const GULD = '#8A6A3F';
const BESKYTTELSE_PROCENT = Number(beskyttelseConfig.procent) / 100;

const tomKunde = {
  fornavn: '',
  efternavn: '',
  adresse: '',
  by: '',
  postnummer: '',
  email: '',
  telefon: '',
};

function formaterPris(beloeb) {
  const afrundet = Math.round(Number(beloeb) * 100) / 100;
  return afrundet % 1 === 0
    ? `${afrundet}`
    : afrundet.toFixed(2).replace('.', ',');
}

export default function KurvScreen({ kurv, fjernFraKurv, navigation }) {
  //kundeoplysninger holdes i skærmens formular indtil kunden går til betaling.
  const [kunde, setKunde] = React.useState(tomKunde);


  //udregner den samlede lejepris for kjolerne
  //kurvtotalen samler lejepriser og kun de beskyttelsesgebyrer, kunden har valgt.
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

  //åbner Stripe-betalingssiden.
  function gaaTilBetaling() {
    //validerer oplysningerne lokalt, før de sendes videre til betalingsflowet.
    const manglerOplysninger = Object.values(kunde).some(
      (vaerdi) => !vaerdi.trim()
    );

    if (manglerOplysninger) {
      Alert.alert(
        'Mangler oplysninger',
        'Udfyld alle kontakt- og adressefelter for at fortsætte.'
      );
      return;
    }

    const emailErGyldig = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kunde.email.trim());
    if (!emailErGyldig) {
      Alert.alert('Tjek din e-mail', 'Skriv en gyldig e-mailadresse.');
      return;
    }

    if (!/^\d{4}$/.test(kunde.postnummer.trim())) {
      Alert.alert('Tjek postnummer', 'Skriv et dansk postnummer på 4 cifre.');
      return;
    }

    const antalTelefonCifre = kunde.telefon.replace(/\D/g, '').length;
    if (antalTelefonCifre < 8) {
      Alert.alert('Tjek telefonnummer', 'Skriv et telefonnummer med mindst 8 cifre.');
      return;
    }

    navigation.navigate('Betaling', {
      kunde: Object.fromEntries(
        Object.entries(kunde).map(([felt, vaerdi]) => [felt, vaerdi.trim()])
      ),
    });
  }

  function opdaterKunde(felt, vaerdi) {
    //genbruger samme opdateringsfunktion for alle formularfelterne.
    setKunde((tidligere) => ({ ...tidligere, [felt]: vaerdi }));
  }

  function kundeFelt(label, felt, egenskaber = {}) {
    //bygger et ensartet inputfelt med de relevante tastaturindstillinger.
    return (
      <View key={felt} style={{ marginTop: 12 }}>
        <Text style={{ marginBottom: 6 }}>{label}</Text>
        <TextInput
          value={kunde[felt]}
          onChangeText={(vaerdi) => opdaterKunde(felt, vaerdi)}
          placeholder={label}
          style={{
            minHeight: 48,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: '#DED1BF',
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            color: '#493B2B',
          }}
          {...egenskaber}
        />
      </View>
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

              {vare.beskyttelse && (
                <Text style={{ marginTop: 6, color: GULD, fontWeight: 'bold' }}>
                  Beskyttelsesgebyr ({beskyttelseConfig.procent} %):{' '}
                  {formaterPris(
                    Number(vare.kjole.pris) * BESKYTTELSE_PROCENT
                  )} kr.
                </Text>
              )}

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

          <View style={GlobalStyle.card}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              Dine oplysninger
            </Text>
            <Text style={{ marginTop: 8 }}>
              Vi bruger oplysningerne til din bestilling.
            </Text>

            {kundeFelt('Fornavn', 'fornavn', { autoCapitalize: 'words', autoComplete: 'given-name', returnKeyType: 'next' })}
            {kundeFelt('Efternavn', 'efternavn', { autoCapitalize: 'words', autoComplete: 'family-name', returnKeyType: 'next' })}
            {kundeFelt('Adresse', 'adresse', { autoCapitalize: 'words', autoComplete: 'street-address', returnKeyType: 'next' })}
            {kundeFelt('By', 'by', { autoCapitalize: 'words', autoComplete: 'address-level2', returnKeyType: 'next' })}
            {kundeFelt('Postnummer', 'postnummer', { keyboardType: 'number-pad', maxLength: 4, autoComplete: 'postal-code', returnKeyType: 'next' })}
            {kundeFelt('E-mail', 'email', { keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: false, autoComplete: 'email', returnKeyType: 'next' })}
            {kundeFelt('Telefon', 'telefon', { keyboardType: 'phone-pad', autoComplete: 'tel', returnKeyType: 'done' })}
          </View>

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
              {formaterPris(samletPris)} kr.
            </Text>

            <Text style={{ marginTop: 8 }}>
              Fragt er ikke medregnet. Valgt beskyttelse er lagt til.
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
