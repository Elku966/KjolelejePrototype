//NY KODE START - Automatisk opstart af app og backend

const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

//finder computerens lokale IP-adresse automatisk.
function findLokalIP() {
  const netvaerk = os.networkInterfaces();
  //prioriterer typisk Macens Wi-Fi-interface frem for virtuelle netkort.
  const prioriteredeNavne = Object.keys(netvaerk).sort((a, b) => {
    const prioritet = (navn) => {
      if (navn === 'en0') return 0;
      if (/^en\d+$/.test(navn)) return 1;
      return 2;
    };

    return prioritet(a) - prioritet(b);
  });

  for (const navn of prioriteredeNavne) {
    const adresser = netvaerk[navn];
    for (const adresse of adresser || []) {
      if (
        adresse.family === 'IPv4' &&
        !adresse.internal &&
        !adresse.address.startsWith('169.254.') &&
        !navn.startsWith('utun')
      ) {
        return adresse.address;
      }
    }
  }

  throw new Error('Kunne ikke finde en lokal IP-adresse.');
}

//finder projektets mapper.
const projektMappe = path.resolve(__dirname, '..');
const backendMappe = path.join(projektMappe, 'backend');

//finder adressen, som telefonen skal bruge.
const ip = findLokalIP();
const serverAdresse = `http://${ip}:3001`;

console.log(`Backend-adresse: ${serverAdresse}`);

//bruger den korrekte npm-kommando til operativsystemet.
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

//starter backend med dens eksisterende startkommando.
const backend = spawn(npm, ['start'], {
  cwd: backendMappe,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

//starter Expo og giver appen backend-adressen.
//expo bygger adressen ind som offentlig klientkonfiguration; den er ikke en hemmelig nøgle.
const expo = spawn('npx', ['expo', 'start', '--lan', '--port', '0'], {
  cwd: projektMappe,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    EXPO_PUBLIC_API_URL: serverAdresse,
  },
});

//stopper begge processer, når opstarten afsluttes.
function stopServere() {
  if (backend.exitCode === null) {
    backend.kill();
  }

  if (expo.exitCode === null) {
    expo.kill();
  }
}

process.on('SIGINT', stopServere);
process.on('SIGTERM', stopServere);

//NY KODE SLUT - Automatisk opstart af app og backend
