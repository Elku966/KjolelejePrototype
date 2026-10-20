const db = require('./firebase');

const {
FieldValue
} = require('firebase-admin/firestore');

// Gemmer en bestilling med Stripe Session ID
// som dokument-ID. Det forhindrer dubletter
// fra gentagne kald for samme Stripe-session.
async function gemBestilling(session, kunde, varer) {
const bestilling = {
kunde: {
fornavn: kunde.fornavn.trim(),
efternavn: kunde.efternavn.trim(),
email: kunde.email.trim(),
telefon: kunde.telefon.trim(),
adresse: kunde.adresse.trim(),
postnummer: kunde.postnummer.trim(),
by: kunde.by.trim(),
},

varer,

betaling: {
stripeSessionId: session.id,
status: 'afventer',
beloeb: session.amount_total,
valuta: session.currency,
},

status: 'afventer_betaling',

oprettetDato: FieldValue.serverTimestamp(),
};

await db
.collection('bestillinger')
.doc(session.id)
.create(bestilling);

console.log('Bestilling gemt:', session.id);

return session.id;
}

// Opdaterer kun en bestilling efter
// verificeret besked fra Stripe.
async function bekraeftBetaling(session) {
const reference = db
.collection('bestillinger')
.doc(session.id);

const dokument = await reference.get();

if (!dokument.exists) {
throw new Error(
'Bestillingen findes ikke i Firestore.'
);
}

if (session.payment_status !== 'paid') {
return;
}

await reference.update({
status: 'betalt',
'betaling.status': 'betalt',
'betaling.beloeb': session.amount_total,
'betaling.valuta': session.currency,
betaltDato: FieldValue.serverTimestamp(),
});
}

module.exports = {
gemBestilling,
bekraeftBetaling,
};