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

// Farver, der bruges flere steder på siden
const GULD = '#8A6A3F';
const BAGGRUND = '#F7F1E8';

export default function BestillingScreen({
 route,
 navigation,
 tilfoejTilKurv,
}) {

 // Henter den kjole, som brugeren valgte på den forrige side
 const kjole = route.params?.kjole;

 // Gemmer brugerens valg, mens siden er åben
 const [stoerrelse, setStoerrelse] = useState('');
 const [dato, setDato] = useState(null);
 const [visKalender, setVisKalender] = useState(false);
 const [beskyttelse, setBeskyttelse] = useState(false);

 // Den tidligste mulige dato er 14 dage fra i dag
 const tidligsteDato = new Date();
 tidligsteDato.setHours(0, 0, 0, 0);
 tidligsteDato.setDate(tidligsteDato.getDate() + 14);

 // Gemmer den dato, som brugeren vælger i kalenderen
 function vaelgDato(event, valgtDato) {

 // På Android lukkes kalenderen automatisk efter et valg
 if (Platform.OS === 'android') {
 setVisKalender(false);
 }

 // Hvis brugeren annullerer, gemmes ingen ny dato
 if (event.type === 'dismissed') {
 return;
 }

 // Gemmer den valgte dato
 if (valgtDato) {
 setDato(valgtDato);
 }
 }

 // NY FUNKTION:
 // Samler brugerens valg og sender dem til kurven
 function sendTilKurv() {

 // Tjekker om kunden har valgt både størrelse og dato
 if (!stoerrelse || !dato) {
 Alert.alert(
 'Mangler oplysninger',
 'Vælg venligst både størrelse og dato, før du tilføjer kjolen til kurven.'
 );
 return;
 }

 // Sikkerhedstjek: Der skal være valgt en kjole
 if (!kjole) {
 Alert.alert(
 'Ingen kjole valgt',
 'Gå tilbage til Kjoler og vælg en kjole først.'
 );
 return;
 }

 // Samler alle oplysninger om bestillingen i ét objekt
 const vare = {
 kjole: kjole,
 stoerrelse: stoerrelse,
 dato: dato.toLocaleDateString('da-DK'),
 beskyttelse: beskyttelse,
 };

 // Sender varen til den fælles kurv i App.js
 tilfoejTilKurv(vare);

 // Nulstiller felterne efter kunden har tilføjet kjolen
 setStoerrelse('');
 setDato(null);
 setBeskyttelse(false);
 setVisKalender(false);

 // Sender kunden automatisk videre til KurvScreen
 navigation.navigate('Kurv');
 }

 // Viser en besked, hvis brugeren åbner siden uden at have valgt en kjole
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
 <Text>
 Vælg først en kjole i Kjoler-fanen.
 </Text>

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

 // Laver størrelserne om fra tekst til en liste
 // Eksempel: "S, M, L" bliver til ["S", "M", "L"]
 const stoerrelser = kjole.stoerrelser
 .split(',')
 .map((s) => s.trim());

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

 {/* OVERSKRIFT */}
 <Text
 style={{
 fontSize: 24,
 fontWeight: 'bold',
 }}
 >
 Prøv {kjole.navn} hjemme
 </Text>

 {/* STØRRELSESVALG */}
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
 backgroundColor:
 stoerrelse === valg ? GULD : 'white',
 }}
 >
 <Text
 style={{
 color:
 stoerrelse === valg ? 'white' : 'black',
 }}
 >
 {valg}
 </Text>
 </Pressable>
 ))}
 </View>

 {/* DATOVALG */}
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

 {/* KALENDER */}
 {visKalender && (
 <>
 <DateTimePicker
 value={dato || tidligsteDato}
 mode="date"
 display={
 Platform.OS === 'ios' ? 'inline' : 'default'
 }
 minimumDate={tidligsteDato}
 onChange={vaelgDato}
 />

 {/* På iPhone kan brugeren lukke kalenderen manuelt */}
 {Platform.OS === 'ios' && (
 <Pressable
 onPress={() => setVisKalender(false)}
 style={{
 marginTop: 12,
 }}
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

 {/* VALGFRI BESKYTTELSE */}
 <Text
 style={{
 marginTop: 24,
 fontWeight: 'bold',
 }}
 >
 Valgfri beskyttelse
 </Text>

 <Text
 style={{
 marginTop: 6,
 }}
 >
 Tænkt til mindre, hændelige skader under normal brug.
 Pris og vilkår er ikke fastlagt i prototypen.
 </Text>

 <Pressable
 onPress={() => setBeskyttelse(!beskyttelse)}
 style={{
 marginTop: 12,
 padding: 14,
 borderRadius: 8,
 backgroundColor:
 beskyttelse ? GULD : 'white',
 }}
 >
 <Text
 style={{
 color:
 beskyttelse ? 'white' : 'black',
 fontWeight: 'bold',
 }}
 >
 {beskyttelse
 ? '✓ Beskyttelse valgt'
 : 'Tilvælg beskyttelse'}
 </Text>
 </Pressable>

 {/* PRIS */}
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

 <Text
 style={{
 marginTop: 8,
 fontSize: 13,
 }}
 >
 Fragt og eventuel beskyttelse er ikke
 beregnet i denne prototype.
 </Text>
 </View>

 {/* NY KNAP: TILFØJ TIL KURV */}
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
