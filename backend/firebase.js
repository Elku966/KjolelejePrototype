const path = require('path');

//importerer Firebase Admin SDK
const {
initializeApp,
cert,
getApps,
getApp,
} = require('firebase-admin/app');

const {
getFirestore,
} = require('firebase-admin/firestore');

//servicekontoens JSON-fil giver backend adgang til Firestore. (Filen er privat og skal blive på serveren; læg den aldrig i appen eller Git.)
const serviceAccount = require(
path.join(
__dirname,
'kjolelejeprototype-firebase-adminsdk-fbsvc-1cb30e2d18.json'
)
);

//genbruger en eksisterende Admin-app, hvis modulet allerede er indlæst.
let app;

try {
if (getApps().length === 0) {
app = initializeApp({
credential: cert(serviceAccount),
});
} else {
app = getApp();
}

console.log('Firebase Admin initialiseret korrekt!');

} catch (error) {
console.error(
'Fejl ved initialisering af Firebase:',
error.message
);

throw error;
}

//opretter Firestore-forbindelsen, som bestillingsfunktionerne bruger.
const db = getFirestore(app);

//eksporterer databasen
module.exports = db;
