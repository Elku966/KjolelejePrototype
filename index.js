import { registerRootComponent } from 'expo';

import App from './App';

//registrerer App som startpunkt, både i Expo Go og i installerede builds.
//registerRootComponent registrerer App som programmets hovedkomponent.
//det sørger også for, at appen bliver sat korrekt op, uanset om den åbnes i Expo Go eller som en installeret app.
registerRootComponent(App);
