Screen forside - Elif  

Screen til kurv – Amalie 

Screen til betaling samt implementering af Stripe - Neda 

Knap på forsiden til at se kjoler -Elif 

Knap til at tilføje en kjole til kurv - Amalie 

Database firebase - Amalie  

Ai Personal Shopper herunder implementering af OpenAi - Elif og Amalie 

# Luxury Rentals

## Pakker

### App

- `@expo/vector-icons`
- `@react-native-community/datetimepicker`
- `@react-navigation/bottom-tabs`
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `expo`
- `expo-image`
- `expo-status-bar`
- `expo-video`
- `expo-web-browser`
- `react`
- `react-native`
- `react-native-safe-area-context`
- `react-native-screens`

### Backend

- `dotenv`
- `express`
- `express-rate-limit`
- `openai`
- `stripe`
- `firebase-admin`

## Installation og opstart

Åbn terminalen i projektets hovedmappe, og kør:

```bash
npm install
cd backend
npm install dotenv express express-rate-limit openai stripe firebase-admin
cd ..
npm run start:all
```

Backendinstallationen gemmer pakkerne i `backend/package.json`, så de også kan installeres igen med `npm install` i backendmappen.

Før opstart skal `backend/.env` være udfyldt med de nødvendige nøgler til OpenAI, Stripe og Firebase. Den fil indeholder private oplysninger og må ikke pushes til GitHub.

Når appen starter, scan QR-koden med Expo Go på telefonen.
