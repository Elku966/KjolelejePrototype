const path = require('path');

// Importerer Firebase Admin SDK
const {
initializeApp,
cert,
getApps,
getApp,
} = require('firebase-admin/app');

const {
getFirestore,
} = require('firebase-admin/firestore');

// Henter din originale Firebase JSON-fil
const serviceAccount = require(
path.join(
__dirname,
'kjolelejeprototype-firebase-adminsdk-fbsvc-1cb30e2d18.json'
)
);

// Initialiserer Firebase
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

// Opretter Firestore-forbindelsen
const db = getFirestore(app);

// Eksporterer databasen
module.exports = db;