const db = require('./firebase');

const {
FieldValue
} = require('firebase-admin/firestore');

//gemmer en bestilling med Stripe Session ID som dokument-ID. Det forhindrer dubletter fra gentagne kald for samme Stripe-session.
async function gemBestilling(session, kunde, varer) {
//gemmer kun de oplysninger, backend skal bruge til at håndtere ordren.
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

//create() fejler, hvis dokumentet allerede findes, så samme session ikke ved et uheld opretter en dubletbestilling.
await db
.collection('bestillinger')
.doc(session.id)
.create(bestilling);

console.log('Bestilling gemt:', session.id);

return session.id;
}

//opdaterer kun en bestilling efter verificeret besked fra Stripe.
async function bekraeftBetaling(session) {
//slår dokumentet op med samme Stripe-session-ID, som blev gemt ved checkout.
const reference = db
.collection('bestillinger')
.doc(session.id);

const dokument = await reference.get();

if (!dokument.exists) {
throw new Error(
'Bestillingen findes ikke i Firestore.'
);
}

//ignorerer alle webhook-events, hvor Stripe ikke siger, at betalingen er betalt.
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
