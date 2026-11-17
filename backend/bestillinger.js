const db = require('./firebase');

const { FieldValue, Timestamp } = require('firebase-admin/firestore');
const crypto = require('crypto');
const lagerConfig = require('../Data/LagerKonfiguration.json');

const antalPrKjoleStoerrelse = Number(lagerConfig.antalPrKjoleStoerrelse);
const leveringDageFoerBegivenhed = Number(
  lagerConfig.leveringDageFoerBegivenhed
);
const returDageEfterModtagelse = Number(
  lagerConfig.returDageEfterModtagelse
);
const reservationCollection = 'kjoleReservationer';

if (
  !Number.isInteger(antalPrKjoleStoerrelse) ||
  antalPrKjoleStoerrelse < 1 ||
  !Number.isInteger(leveringDageFoerBegivenhed) ||
  leveringDageFoerBegivenhed < 0 ||
  !Number.isInteger(returDageEfterModtagelse) ||
  returDageEfterModtagelse < 1
) {
  throw new Error('Lagerindstillingerne i Data/LagerKonfiguration.json er ugyldige.');
}

function datoSomISO(dato) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(dato))) return String(dato);

  const match = String(dato).match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!match) return '';

  return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
}

function flytDato(datoISO, antalDage) {
  const dato = new Date(`${datoISO}T00:00:00.000Z`);
  dato.setUTCDate(dato.getUTCDate() + antalDage);
  return dato.toISOString().slice(0, 10);
}

// Begivenhedsdatoen er ikke hele lejeperioden: kjolen sendes en uge før,
// og lageret holdes optaget til returfristen, 14 dage efter modtagelsen.
function lagerDatoerForBegivenhed(begivenhedsdatoISO) {
  const modtagelsesDato = flytDato(
    begivenhedsdatoISO,
    -leveringDageFoerBegivenhed
  );
  const returFrist = flytDato(modtagelsesDato, returDageEfterModtagelse);
  const datoer = [];

  for (
    let dato = modtagelsesDato;
    dato <= returFrist;
    dato = flytDato(dato, 1)
  ) {
    datoer.push(dato);
  }

  return { modtagelsesDato, returFrist, datoer };
}

function reservationKey(vare, lagerDatoISO) {
  const value = [
    String(vare.kjoleId),
    String(vare.stoerrelse).trim().toUpperCase(),
    String(lagerDatoISO),
  ].join('|');

  return crypto.createHash('sha256').update(value).digest('hex');
}

function reservationKeysForDag(vare, lagerDatoISO) {
  const baseKey = reservationKey(vare, lagerDatoISO);
  return Array.from(
    { length: antalPrKjoleStoerrelse },
    (_, index) => (index === 0 ? baseKey : `${baseKey}-${index}`)
  );
}

function reservationRef(key) {
  return db.collection(reservationCollection).doc(key);
}

function reservationErAktiv(data, nu = Date.now()) {
  if (data.status === 'betalt') return true;
  if (data.status !== 'reserveret') return false;

  const udloebMs = data.udloeb?.toMillis?.();
  return !Number.isFinite(udloebMs) || udloebMs > nu;
}

async function hentBestillingerTilLegacyTjek() {
  const snapshot = await db.collection('bestillinger').get();
  const nu = Date.now();

  return snapshot.docs
    .map((dokument) => dokument.data())
    .filter((bestilling) => {
      if (bestilling.status === 'betalt') return true;
      if (bestilling.status !== 'afventer_betaling') return false;

      const oprettetMs = bestilling.oprettetDato?.toMillis?.();
      // Gamle afbrudte betalinger uden aktive slot-dokumenter udløber efter 30 min.
      return !Number.isFinite(oprettetMs) || nu - oprettetMs <= 30 * 60 * 1000;
    });
}

// Tæller kun historiske/ældre ordrer. Nye bookinger tælles via daglige lager-slots.
function antalAeldreAktiveBestillinger(vare, lagerDatoISO, reservationKeys, bestillinger) {
  return bestillinger.reduce((antal, bestilling) => {
    if (
      bestilling.reservationKeys?.some((key) => reservationKeys.includes(key))
    ) {
      return antal;
    }

    const antalMatch = (bestilling.varer || []).filter((bestiltVare) => {
      if (
        String(bestiltVare.kjoleId) !== String(vare.kjoleId) ||
        String(bestiltVare.stoerrelse).trim().toUpperCase() !==
          String(vare.stoerrelse).trim().toUpperCase()
      ) {
        return false;
      }

      const begivenhedsdato = datoSomISO(
        bestiltVare.datoISO || bestiltVare.dato
      );
      if (!begivenhedsdato) return false;

      const { datoer } = lagerDatoerForBegivenhed(begivenhedsdato);
      return datoer.includes(lagerDatoISO);
    }).length;

    return antal + antalMatch;
  }, 0);
}

function udvidKurvTilLagerdage(varer) {
  const grupper = new Map();

  varer.forEach((vare) => {
    const begivenhedsdato = String(vare.datoISO || '');
    const { modtagelsesDato, returFrist, datoer } =
      lagerDatoerForBegivenhed(begivenhedsdato);

    datoer.forEach((lagerDatoISO) => {
      const keys = reservationKeysForDag(vare, lagerDatoISO);
      const key = keys[0];
      const eksisterende = grupper.get(key);

      if (eksisterende) {
        eksisterende.antal += 1;
        eksisterende.begivenhedsDatoer.add(begivenhedsdato);
      } else {
        grupper.set(key, {
          vare,
          lagerDatoISO,
          modtagelsesDato,
          returFrist,
          begivenhedsDatoer: new Set([begivenhedsdato]),
          antal: 1,
          keys,
        });
      }
    });
  });

  return [...grupper.values()];
}

// Tjekker samtlige dage fra levering til returfrist, ikke kun selve eventdagen.
async function tjekLedighed(vare) {
  const grupper = udvidKurvTilLagerdage([vare]);
  const references = grupper.flatMap((gruppe) =>
    gruppe.keys.map(reservationRef)
  );
  const [dokumenter, bestillinger] = await Promise.all([
    db.getAll(...references),
    hentBestillingerTilLegacyTjek(),
  ]);

  let offset = 0;

  for (const gruppe of grupper) {
    const gruppensDokumenter = dokumenter.slice(
      offset,
      offset + gruppe.keys.length
    );
    offset += gruppe.keys.length;

    const antalReserverede = gruppensDokumenter.filter(
      (dokument) => dokument.exists && reservationErAktiv(dokument.data())
    ).length;
    const antalAeldre = antalAeldreAktiveBestillinger(
      gruppe.vare,
      gruppe.lagerDatoISO,
      gruppe.keys,
      bestillinger
    );

    if (antalReserverede + antalAeldre >= antalPrKjoleStoerrelse) {
      return false;
    }
  }

  return true;
}

// Reserverer hele kurven atomisk for hver dag i den samlede lejeperiode.
async function reserverKurv(session, varer) {
  const grupper = udvidKurvTilLagerdage(varer);
  const bestillinger = await hentBestillingerTilLegacyTjek();
  const antalAeldre = grupper.map((gruppe) =>
    antalAeldreAktiveBestillinger(
      gruppe.vare,
      gruppe.lagerDatoISO,
      gruppe.keys,
      bestillinger
    )
  );
  const references = grupper.flatMap((gruppe) =>
    gruppe.keys.map(reservationRef)
  );
  const udloeb = Timestamp.fromMillis(session.expires_at * 1000);

  return db.runTransaction(async (transaction) => {
    const dokumenter = await Promise.all(
      references.map((reference) => transaction.get(reference))
    );

    let offset = 0;
    const snapshotsPerGruppe = grupper.map((gruppe) => {
      const snapshots = dokumenter.slice(offset, offset + gruppe.keys.length);
      offset += gruppe.keys.length;
      return snapshots;
    });

    // Kontrollér hele kurven først. Hvis ét døgn er fuldt, må transaktionen
    // ikke gemme delvise reservationer for de foregående døgn.
    for (let gruppeIndex = 0; gruppeIndex < grupper.length; gruppeIndex += 1) {
      const gruppe = grupper[gruppeIndex];
      const gruppensDokumenter = snapshotsPerGruppe[gruppeIndex];
      const optagede = gruppensDokumenter.filter(
        (dokument) => dokument.exists && reservationErAktiv(dokument.data())
      ).length;

      if (
        optagede + antalAeldre[gruppeIndex] + gruppe.antal >
        antalPrKjoleStoerrelse
      ) {
        return { ledig: false, keys: [] };
      }
    }

    const nyeKeys = [];
    offset = 0;

    for (let gruppeIndex = 0; gruppeIndex < grupper.length; gruppeIndex += 1) {
      const gruppe = grupper[gruppeIndex];
      const startOffset = offset;
      const gruppensDokumenter = snapshotsPerGruppe[gruppeIndex];
      offset += gruppe.keys.length;

      const ledigeSlots = gruppensDokumenter
        .map((dokument, index) => ({ dokument, index }))
        .filter(
          ({ dokument }) =>
            !dokument.exists || !reservationErAktiv(dokument.data())
        )
        .slice(0, gruppe.antal);

      if (ledigeSlots.length < gruppe.antal) {
        return { ledig: false, keys: [] };
      }

      ledigeSlots.forEach(({ index }) => {
        const reference = references[startOffset + index];
        const key = gruppe.keys[index];
        nyeKeys.push(key);

        transaction.set(reference, {
          kjoleId: String(gruppe.vare.kjoleId),
          stoerrelse: String(gruppe.vare.stoerrelse).trim().toUpperCase(),
          lagerDato: gruppe.lagerDatoISO,
          begivenhedsDatoer: [...gruppe.begivenhedsDatoer],
          modtagelsesDato: gruppe.modtagelsesDato,
          returFrist: gruppe.returFrist,
          stripeSessionId: session.id,
          status: 'reserveret',
          udloeb,
          oprettetDato: FieldValue.serverTimestamp(),
        });
      });
    }

    return { ledig: true, keys: nyeKeys };
  });
}

// Frigiver kun reservationer, der tilhører den udløbne/annullerede session.
async function frigivKurv(sessionId, keys) {
  if (!Array.isArray(keys) || keys.length === 0) return;

  const references = keys.map(reservationRef);

  await db.runTransaction(async (transaction) => {
    const dokumenter = await Promise.all(
      references.map((reference) => transaction.get(reference))
    );

    dokumenter.forEach((dokument, index) => {
      if (
        dokument.exists &&
        dokument.data().stripeSessionId === sessionId &&
        dokument.data().status === 'reserveret'
      ) {
        transaction.delete(references[index]);
      }
    });
  });
}

// Gemmer en bestilling med Stripe Session ID som dokument-ID for at undgå dubletter.
async function gemBestilling(session, kunde, varer, reservationKeys = []) {
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
    reservationKeys,

    betaling: {
      stripeSessionId: session.id,
      status: 'afventer',
      beloeb: session.amount_total,
      valuta: session.currency,
    },

    status: 'afventer_betaling',
    oprettetDato: FieldValue.serverTimestamp(),
  };

  const ordreRef = db.collection('bestillinger').doc(session.id);

  // Vælg og reserver et ledigt 4-cifret ordrenummer atomisk, så to samtidige
  // bestillinger aldrig får det samme nummer.
  for (let forsog = 0; forsog < 50; forsog += 1) {
    const ordrenummer = String(crypto.randomInt(1000, 10000));
    const nummerRef = db.collection('ordrenumre').doc(ordrenummer);

    const oprettet = await db.runTransaction(async (transaction) => {
      const [ordreSnapshot, nummerSnapshot] = await Promise.all([
        transaction.get(ordreRef),
        transaction.get(nummerRef),
      ]);

      if (ordreSnapshot.exists) {
        throw new Error('Bestillingen findes allerede i databasen.');
      }
      if (nummerSnapshot.exists) return false;

      transaction.create(nummerRef, {
        stripeSessionId: session.id,
        oprettetDato: FieldValue.serverTimestamp(),
      });
      transaction.create(ordreRef, {
        ...bestilling,
        ordrenummer,
      });
      return true;
    });

    if (oprettet) {
      console.log('Bestilling gemt:', session.id);
      return ordrenummer;
    }
  }

  throw new Error('Kunne ikke finde et ledigt ordrenummer. Prøv igen.');
}

async function hentBestillingsbekraeftelse(sessionId) {
  const snapshot = await db.collection('bestillinger').doc(sessionId).get();
  if (!snapshot.exists) return null;

  const bestilling = snapshot.data();
  return {
    ordrenummer: bestilling.ordrenummer,
    varer: (bestilling.varer || []).map((vare) => ({
      kjoleNavn: vare.kjoleNavn,
      stoerrelse: vare.stoerrelse,
      dato: vare.dato,
    })),
  };
}

// Opdaterer kun en bestilling efter verificeret besked fra Stripe.
async function bekraeftBetaling(session) {
  const reference = db.collection('bestillinger').doc(session.id);
  const dokument = await reference.get();

  if (!dokument.exists) {
    throw new Error('Bestillingen findes ikke i Firestore.');
  }

  if (session.payment_status !== 'paid') return;

  const reservationKeys = dokument.data().reservationKeys || [];
  const reservationReferences = reservationKeys.map(reservationRef);

  await db.runTransaction(async (transaction) => {
    const bestillingSnapshot = await transaction.get(reference);
    const reservationSnapshots = await Promise.all(
      reservationReferences.map((reservation) => transaction.get(reservation))
    );

    if (!bestillingSnapshot.exists) {
      throw new Error('Bestillingen findes ikke i Firestore.');
    }

    transaction.update(reference, {
      status: 'betalt',
      'betaling.status': 'betalt',
      'betaling.beloeb': session.amount_total,
      'betaling.valuta': session.currency,
      betaltDato: FieldValue.serverTimestamp(),
    });

    reservationSnapshots.forEach((reservation, index) => {
      if (
        reservation.exists &&
        reservation.data().stripeSessionId === session.id
      ) {
        transaction.update(reservationReferences[index], {
          status: 'betalt',
          udloeb: FieldValue.delete(),
        });
      }
    });
  });
}

// Stripe Checkout udløb eller kunden annullerede; reservationen frigives.
async function udloebBestilling(session) {
  const reference = db.collection('bestillinger').doc(session.id);
  await db.runTransaction(async (transaction) => {
    const bestilling = await transaction.get(reference);
    if (!bestilling.exists || bestilling.data().status !== 'afventer_betaling') return;

    const reservationKeys = bestilling.data().reservationKeys || [];
    const reservationReferences = reservationKeys.map(reservationRef);
    const reservationSnapshots = await Promise.all(
      reservationReferences.map((reservation) => transaction.get(reservation))
    );

    transaction.update(reference, {
      status: 'betaling_udloebet',
      'betaling.status': 'udloebet',
    });

    reservationSnapshots.forEach((reservation, index) => {
      if (
        reservation.exists &&
        reservation.data().stripeSessionId === session.id &&
        reservation.data().status === 'reserveret'
      ) {
        transaction.delete(reservationReferences[index]);
      }
    });
  });
}

module.exports = {
  gemBestilling,
  bekraeftBetaling,
  udloebBestilling,
  tjekLedighed,
  reserverKurv,
  frigivKurv,
  hentBestillingsbekraeftelse,
};
