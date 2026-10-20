import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';

import {
  ElegantText as Text,
  GlobalStyle,
} from '../styles/GlobalStyle';

import { PersonalShopperStyle as styles } from '../styles/PersonalShopperStyle';
import { kjoler, kjolerTilAI } from '../Data/Kjoler';

//samme backend-adresse som scripts/start.js giver betalingsskærmen.
const SERVER_URL = process.env.EXPO_PUBLIC_API_URL;

const eksempler = [
  'Vis mig alle brune kjoler',
  'Jeg skal til galla. Hvilke kjoler passer?',
  'Jeg søger en grøn kjole til højst 1000 kr.',
];

export default function PersonalShopperScreen({ navigation }) {
  //formular, svar, produktforslag og fejl vises separat i brugerfladen.
  const [besked, setBesked] = useState('');
  const [venter, setVenter] = useState(false);
  const [svar, setSvar] = useState('');
  const [forslag, setForslag] = useState([]);
  const [fejl, setFejl] = useState('');

  const aktivAnmodning = useRef(null);

  useEffect(() => {
    //afbryder netværkskaldet, hvis brugeren forlader skærmen under ventetid.
    return () => aktivAnmodning.current?.abort();
  }, []);

  async function sendBesked() {
    //ignorerer tom tekst og dobbelttryk, mens et spørgsmål allerede behandles.
    if (!besked.trim() || aktivAnmodning.current) return;

    if (!SERVER_URL) {
      setFejl(
        'Backend-adressen mangler. Start appen med scripts/start.js.'
      );
      return;
    }

    Keyboard.dismiss();
    setVenter(true);
    setFejl('');
    setSvar('');
    setForslag([]);

    const controller = new AbortController();
    aktivAnmodning.current = controller;

    //afslutter kald, der ikke svarer inden for ét minut.
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      //sender spørgsmålet og tekstkataloget til backend; billedfiler sendes ikke.
      const response = await fetch(`${SERVER_URL}/shopper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          besked: besked.trim(),
          katalog: kjolerTilAI,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Der opstod en fejl.');
      }

      if (
        typeof data.svar !== 'string' ||
        !Array.isArray(data.forslag)
      ) {
        throw new Error('Serveren returnerede et ugyldigt svar.');
      }

      //billeder og priser hentes fra appens eget katalog.
      //matcher AI'ens ID'er med appens katalog for at hente billeder og priser lokalt.
      const kjoleforslag = data.forslag
        .map((forslag) => {
          const kjole = kjoler.find(
            (item) => item.id === forslag.id
          );

          return kjole
            ? {
                kjole,
                begrundelse: forslag.begrundelse,
              }
            : null;
        })
        .filter(Boolean);

      setSvar(data.svar);
      setForslag(kjoleforslag);
    } catch (error) {
      if (error.name === 'AbortError') {
        setFejl('Det tog for lang tid. Prøv igen.');
      } else if (
        error.message === 'Network request failed' ||
        error.message === 'Failed to fetch'
      ) {
        setFejl(
          'Kan ikke kontakte serveren. Tjek at backend kører, IP-adressen er korrekt, og telefon og Mac er på samme Wi-Fi.'
        );
      } else {
        setFejl(error.message || 'Noget gik galt. Prøv igen.');
      }
    } finally {
      clearTimeout(timeout);
      aktivAnmodning.current = null;
      setVenter(false);
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
          Din personlige shopper
        </Text>

        <Text style={styles.body}>
          Fortæl om din begivenhed, yndlingsfarve eller dit budget.
          Så hjælper jeg dig med at finde en kjole fra vores udvalg.
        </Text>

        <Text style={styles.body}>
          Dit spørgsmål og kjolekatalogets tekst sendes til OpenAI.
          Hver søgning starter på ny.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.examples}
          keyboardShouldPersistTaps="handled"
        >
          {eksempler.map((eksempel) => (
            <Pressable
              key={eksempel}
              accessibilityRole="button"
              disabled={venter}
              onPress={() => setBesked(eksempel)}
              style={styles.example}
            >
              <Text style={styles.exampleText}>
                {eksempel}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <TextInput
          value={besked}
          onChangeText={setBesked}
          placeholder="Fx: Jeg skal til galla og elsker brun..."
          placeholderTextColor="#857564"
          accessibilityLabel="Dit spørgsmål til personal shopperen"
          multiline
          maxLength={1000}
          editable={!venter}
          style={styles.input}
        />

        <Pressable
          accessibilityRole="button"
          disabled={venter || !besked.trim()}
          onPress={sendBesked}
          style={[
            GlobalStyle.button,
            (venter || !besked.trim()) && styles.disabled,
          ]}
        >
          <Text style={GlobalStyle.buttonText}>
            {venter ? 'Finder kjoler...' : 'Find mine kjoler'}
          </Text>
        </Pressable>

        {venter && (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="#8A6A3F"
            accessibilityLabel="Finder kjoleforslag"
          />
        )}

        {!!fejl && (
          <Text accessibilityRole="alert" style={styles.error}>
            {fejl}
          </Text>
        )}

        {!!svar && (
          <Text style={[styles.answer, styles.answerText]}>
            {svar}
          </Text>
        )}

        {forslag.map(({ kjole, begrundelse }) => (
          <Pressable
            key={kjole.id}
            accessibilityRole="button"
            accessibilityLabel={`Se ${kjole.navn}`}
            onPress={() =>
              navigation.navigate('Detaljer', { kjole })
            }
            style={GlobalStyle.card}
          >
            <Image
              source={kjole.billede}
              style={styles.image}
              resizeMode="contain"
              accessibilityLabel={kjole.navn}
            />

            <Text style={GlobalStyle.dressName}>
              {kjole.navn}
            </Text>

            <Text>Størrelser: {kjole.stoerrelser}</Text>
            <Text>Lejepris: {kjole.pris} kr.</Text>

            <Text style={styles.reason}>
              {begrundelse}
            </Text>

            <Text style={[GlobalStyle.button, GlobalStyle.buttonText]}>
              Se kjolen
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
