import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import { ElegantText as Text } from '../styles/GlobalStyle';
import { KontaktStyle as styles } from '../styles/KontaktStyle';

const SERVER_URL = process.env.EXPO_PUBLIC_API_URL;

export default function KontaktScreen() {
  const [harOrdre, setHarOrdre] = useState(false);
  const [navn, setNavn] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [ordrenummer, setOrdrenummer] = useState('');
  const [spoergsmaal, setSpoergsmaal] = useState('');
  const [sender, setSender] = useState(false);
  const [fejl, setFejl] = useState('');
  const [succes, setSucces] = useState('');

  function vaelgOrdreStatus(vaerdi) {
    setHarOrdre(vaerdi);
    setFejl('');
    setSucces('');
    if (vaerdi) setTelefon('');
    else setOrdrenummer('');
  }

  async function sendKontaktbesked() {
    if (sender) return;

    const rensetNavn = navn.trim();
    const rensetEmail = email.trim();
    const rensetSpoergsmaal = spoergsmaal.trim();

    if (!rensetNavn || !rensetEmail || !rensetSpoergsmaal) {
      setFejl('Udfyld navn, e-mail og dit spørgsmål.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rensetEmail)) {
      setFejl('Skriv en gyldig e-mailadresse.');
      return;
    }

    if (harOrdre && !/^\d{4}$/.test(ordrenummer.trim())) {
      setFejl('Skriv dit ordrenummer på fire cifre.');
      return;
    }

    if (!SERVER_URL) {
      setFejl('Kontaktformularen kan ikke forbindes til serveren lige nu.');
      return;
    }

    Keyboard.dismiss();
    setSender(true);
    setFejl('');
    setSucces('');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(`${SERVER_URL}/kontakt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          harOrdre,
          navn: rensetNavn,
          email: rensetEmail,
          ordrenummer: harOrdre ? ordrenummer.trim() : undefined,
          telefon: harOrdre ? undefined : telefon.trim(),
          spoergsmaal: rensetSpoergsmaal,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Beskeden kunne ikke sendes.');
      }

      setSucces('Tak for din besked. Vi vender tilbage hurtigst muligt.');
      setNavn('');
      setEmail('');
      setTelefon('');
      setOrdrenummer('');
      setSpoergsmaal('');
    } catch (error) {
      if (error.name === 'AbortError') {
        setFejl('Det tog for lang tid at sende beskeden. Prøv igen.');
      } else if (
        error.message === 'Network request failed' ||
        error.message === 'Failed to fetch'
      ) {
        setFejl('Kunne ikke få forbindelse til serveren. Prøv igen senere.');
      } else {
        setFejl(error.message || 'Beskeden kunne ikke sendes. Prøv igen.');
      }
    } finally {
      clearTimeout(timeout);
      setSender(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text accessibilityRole="header" style={styles.title}>
          Kontakt os
        </Text>
        <Text style={styles.intro}>
          Har du spørgsmål til en ordre eller brug for hjælp? Skriv til os her.
        </Text>

        <Text style={styles.label}>Har du allerede en ordre?</Text>
        <View style={styles.valgRae}>
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ selected: harOrdre }}
            onPress={() => vaelgOrdreStatus(true)}
            style={[styles.valgKnap, harOrdre && styles.valgKnapAktiv]}
          >
            <Text style={[styles.valgTekst, harOrdre && styles.valgTekstAktiv]}>
              Jeg har en ordre
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ selected: !harOrdre }}
            onPress={() => vaelgOrdreStatus(false)}
            style={[styles.valgKnap, !harOrdre && styles.valgKnapAktiv]}
          >
            <Text style={[styles.valgTekst, !harOrdre && styles.valgTekstAktiv]}>
              Jeg har ikke en ordre
            </Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Navn</Text>
        <TextInput
          accessibilityLabel="Navn"
          autoCapitalize="words"
          autoComplete="name"
          maxLength={100}
          onChangeText={setNavn}
          placeholder="Dit navn"
          placeholderTextColor="#8C8984"
          style={styles.input}
          value={navn}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          accessibilityLabel="E-mail"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          maxLength={254}
          onChangeText={setEmail}
          placeholder="din@email.dk"
          placeholderTextColor="#8C8984"
          style={styles.input}
          value={email}
        />

        {harOrdre ? (
          <>
            <Text style={styles.label}>Ordrenummer</Text>
            <TextInput
              accessibilityLabel="Ordrenummer på fire cifre"
              keyboardType="number-pad"
              maxLength={4}
              onChangeText={(value) => setOrdrenummer(value.replace(/\D/g, ''))}
              placeholder="F.eks. 1234"
              placeholderTextColor="#8C8984"
              style={styles.input}
              value={ordrenummer}
            />
          </>
        ) : (
          <>
            <Text style={styles.label}>Telefon (valgfrit)</Text>
            <TextInput
              accessibilityLabel="Telefonnummer, valgfrit"
              autoComplete="tel"
              keyboardType="phone-pad"
              maxLength={30}
              onChangeText={setTelefon}
              placeholder="Dit telefonnummer"
              placeholderTextColor="#8C8984"
              style={styles.input}
              value={telefon}
            />
          </>
        )}

        <Text style={styles.label}>Hvad kan vi hjælpe dig med?</Text>
        <TextInput
          accessibilityLabel="Skriv dit spørgsmål"
          maxLength={2000}
          multiline
          onChangeText={setSpoergsmaal}
          placeholder="Skriv dit spørgsmål her..."
          placeholderTextColor="#8C8984"
          style={[styles.input, styles.sporgsmaalInput]}
          textAlignVertical="top"
          value={spoergsmaal}
        />

        {!!fejl && <Text style={styles.error}>{fejl}</Text>}
        {!!succes && <Text style={styles.success}>{succes}</Text>}

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: sender }}
          disabled={sender}
          onPress={sendKontaktbesked}
          style={[styles.sendKnap, sender && styles.disabled]}
        >
          {sender ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.sendKnapTekst}>Send besked</Text>
          )}
        </Pressable>
        <Text style={styles.note}>
          Din besked gemmes, så vi kan følge op på din henvendelse.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
