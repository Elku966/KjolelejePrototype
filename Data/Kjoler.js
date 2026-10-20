//fælles kjolekatalog til appen.

//farver og beskrivelser er vurderet ud fra billederne.
//begivenheder er inspirationsforslag, ikke faste dresscodes.

//"billede" bruges på kjolekortet.
//"billeder" bruges til swipe-galleriet.
//de øvrige oplysninger kan bruges af personal shopperen.

//hvert objekt beskriver én kjole. ID'et bruges også til koblingen til kjolens Stripe-pris i backend/server.js.
export const kjoler = [
    {
      id: '1',
      navn: 'Brown Gala',
      stoerrelser: 'S, M, L',
      pris: 899,
  
      farve: 'brun',
      farveSoegning: [
        'brun',
        'brune',
        'mørkebrun',
        'chokoladebrun',
        'brown',
      ],
  
      beskrivelse:
        'Lang brun gallakjole med én skulder, glitrende detaljer og draperinger omkring talje og hofter.',
  
      stil: ['elegant', 'glitrende', 'asymmetrisk'],
      laengde: 'lang',
      begivenheder: ['galla', 'bryllupsfest', 'nytår', 'formel fest'],
  
      billede: require('../assets/kjole1.png'),
      billeder: [
        require('../assets/kjole1.png'),
        require('../assets/IMG_9991.jpg'),
        require('../assets/IMG_9993.jpg'),
        require('../assets/IMG_9994.jpg'),
      ],
    },
  
    {
      id: '2',
      navn: 'Champagne Elegance',
      stoerrelser: 'XS, S, M',
      pris: 1099,
  
      farve: 'champagne',
      farveSoegning: [
        'champagne',
        'champagnefarvet',
        'beige',
        'lys beige',
      ],
  
      beskrivelse:
        'Lang champagnefarvet kjole med stropper under skuldrene, glitrende mønstre, snøring i ryggen og slæb.',
  
      stil: ['glamourøs', 'elegant', 'glitrende'],
      laengde: 'lang',
      begivenheder: ['galla', 'forlovelsesfest', 'formel fest'],
  
      billede: require('../assets/kjole2.png'),
      billeder: [
        require('../assets/kjole2.png'),
        require('../assets/IMG_9995.jpg'),
        require('../assets/IMG_9996.jpg'),
        require('../assets/IMG_9997.jpg'),
      ],
    },
  
    {
      id: '3',
      navn: 'Bronze Couture',
      stoerrelser: 'M, L',
      pris: 749,
  
      farve: 'brun',
      farveSoegning: [
        'brun',
        'brune',
        'bronze',
        'bronzefarvet',
        'kobberbrun',
        'brown',
      ],
  
      beskrivelse:
        'Lang brun kjole med bronzefarvede detaljer, blondelignende blomstermønster og draperinger. Billederne viser forskellige stylingmuligheder med matchende ærmer og halstørklæde.',
  
      stil: ['romantisk', 'detaljeret', 'glitrende'],
      laengde: 'lang',
      begivenheder: ['galla', 'bryllupsfest', 'forlovelsesfest'],
  
      billede: require('../assets/kjole3.png'),
      billeder: [
        require('../assets/kjole3.png'),
        require('../assets/IMG_0001.jpg'),
        require('../assets/IMG_0002.jpg'),
        require('../assets/IMG_0003.jpg'),
      ],
    },
  
    {
      id: '4',
      navn: 'Rose Blossom',
      stoerrelser: 'S, M, L',
      pris: 999,
  
      farve: 'lyserød',
      farveSoegning: [
        'lyserød',
        'lyserøde',
        'rosa',
        'pink',
        'blush',
        'fersken',
      ],
  
      beskrivelse:
        'Lang lys rosa kjole med farvede blomster på overdelen, snøring i ryggen og en vid, let udseende nederdel. På billederne er den stylet med et matchende tørklæde.',
  
      stil: ['romantisk', 'blomstret', 'pastel'],
      laengde: 'lang',
      begivenheder: [
        'sommerfest',
        'bryllupsfest',
        'forlovelsesfest',
        'galla',
      ],
  
      billede: require('../assets/IMG_9977.jpg'),
      billeder: [
        require('../assets/IMG_9977.jpg'),
        require('../assets/IMG_9976.jpg'),
      ],
    },
  
    {
      id: '5',
      navn: 'Silver Glamour',
      stoerrelser: 'XS, S, M',
      pris: 1199,
  
      farve: 'sølv',
      farveSoegning: [
        'sølv',
        'sølvfarvet',
        'sølvfarvede',
        'silver',
      ],
  
      beskrivelse:
        'Lang kjole med sølvfarvede, glitrende mønstre over en lys bund, hjerteformet udskæring og snøring i ryggen. På billederne er den stylet med et matchende tørklæde.',
  
      stil: ['glamourøs', 'glitrende', 'markant'],
      laengde: 'lang',
      begivenheder: ['galla', 'nytår', 'formel fest'],
  
      billede: require('../assets/IMG_9978.jpg'),
      billeder: [
        require('../assets/IMG_9978.jpg'),
        require('../assets/IMG_9980.jpg'),
      ],
    },
  
    {
      id: '6',
      navn: 'Pistachio Dream',
      stoerrelser: 'S, M, L',
      pris: 999,
  
      farve: 'grøn',
      farveSoegning: [
        'grøn',
        'grønne',
        'lysegrøn',
        'pistacie',
        'pistaciegrøn',
        'mint',
        'green',
      ],
  
      beskrivelse:
        'Lang lysegrøn kjole med glitrende overflade, draperinger og snøring i ryggen. Billederne viser asymmetrisk styling omkring skuldrene med et matchende tørklæde.',
  
      stil: ['glitrende', 'pastel', 'elegant'],
      laengde: 'lang',
      begivenheder: [
        'sommerfest',
        'bryllupsfest',
        'galla',
        'forlovelsesfest',
      ],
  
      billede: require('../assets/IMG_9982.jpg'),
      billeder: [
        require('../assets/IMG_9982.jpg'),
        require('../assets/IMG_9983.jpg'),
      ],
    },
  
    {
      id: '7',
      navn: 'Midnight Sparkle',
      stoerrelser: 'XS, S, M',
      pris: 1099,
  
      farve: 'sort',
      farveSoegning: [
        'sort',
        'sorte',
        'black',
      ],
  
      beskrivelse:
        'Lang kjole, der fremstår sort på billederne, med glitrende buede mønstre, draperinger og matchende lange ærmer.',
  
      stil: ['dramatisk', 'glitrende', 'glamourøs'],
      laengde: 'lang',
      begivenheder: ['nytår', 'galla', 'aftenfest', 'formel fest'],
  
      billede: require('../assets/IMG_9984.jpg'),
      billeder: [
        require('../assets/IMG_9984.jpg'),
        require('../assets/IMG_9986.jpg'),
      ],
    },
  
    {
      id: '8',
      navn: 'Burgundy Romance',
      stoerrelser: 'S, M, L',
      pris: 999,
  
      farve: 'bordeaux',
      farveSoegning: [
        'bordeaux',
        'vinrød',
        'vinrøde',
        'mørkerød',
        'rød',
        'røde',
        'burgundy',
      ],
  
      beskrivelse:
        'Lang vinrød kjole med blondelignende mønster, glitrende detaljer, snøring i ryggen og slæb. Billederne viser en matchende overdel med lange ærmer og høj hals.',
  
      stil: ['romantisk', 'dramatisk', 'detaljeret'],
      laengde: 'lang',
      begivenheder: [
        'galla',
        'bryllupsfest',
        'julefest',
        'formel fest',
      ],
  
      billede: require('../assets/IMG_9988.jpg'),
      billeder: [
        require('../assets/IMG_9988.jpg'),
        require('../assets/IMG_9989.jpg'),
      ],
    },
  ];
  
  //personal shopperen får kun katalogets tekstfelter; lokale billedfiler bliver i appen og sendes ikke til backend eller OpenAI.
  export const kjolerTilAI = kjoler.map((kjole) => ({
    id: kjole.id,
    navn: kjole.navn,
    stoerrelser: kjole.stoerrelser,
    pris: kjole.pris,
    farve: kjole.farve,
    farveSoegning: kjole.farveSoegning,
    beskrivelse: kjole.beskrivelse,
    stil: kjole.stil,
    laengde: kjole.laengde,
    begivenheder: kjole.begivenheder,
  }));
  
  export default kjoler;
