import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import {
  ElegantText as Text,
  GlobalStyle,
} from '../styles/GlobalStyle';

import { KjolerStyle as styles } from '../styles/KjolerStyle';

const kjoler = [
  {
    id: '1',
    navn: 'Brown Gala',
    stoerrelser: 'S, M, L',
    pris: 899,
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
    billede: require('../assets/IMG_9988.jpg'),
    billeder: [
      require('../assets/IMG_9988.jpg'),
      require('../assets/IMG_9989.jpg'),
    ],
  },
];

// Hvert kjolekort har sit eget billedgalleri.
function KjoleKort({ kjole, navigation }) {
  const [bredde, setBredde] = useState(0);
  const [valgtIndex, setValgtIndex] = useState(0);
  const galleriRef = useRef(null);

  const billeder = kjole.billeder?.length
    ? kjole.billeder
    : [kjole.billede];

  function visBillede(index) {
    setValgtIndex(index);

    galleriRef.current?.scrollTo({
      x: index * bredde,
      animated: true,
    });
  }

  function opdaterValgtBillede(event) {
    if (bredde <= 0) return;

    const position = event.nativeEvent.contentOffset.x;
    const index = Math.round(position / bredde);

    setValgtIndex(
      Math.max(0, Math.min(index, billeder.length - 1))
    );
  }

  return (
    <View style={GlobalStyle.card}>
      <View
        style={styles.billedRamme}
        onLayout={(event) => {
          const nyBredde = event.nativeEvent.layout.width;

          if (nyBredde !== bredde) {
            setBredde(nyBredde);
          }
        }}
      >
        {bredde > 0 && (
          <ScrollView
            key={bredde}
            ref={galleriRef}
            horizontal
            pagingEnabled
            directionalLockEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={opdaterValgtBillede}
            contentOffset={{
              x: valgtIndex * bredde,
              y: 0,
            }}
            style={styles.galleri}
          >
            {billeder.map((billede, index) => (
              <Image
                key={`${kjole.id}-${index}`}
                source={billede}
                style={[styles.billede, { width: bredde }]}
                resizeMode="contain"
                accessibilityLabel={
                  `${kjole.navn}, billede ${index + 1} af ${billeder.length}`
                }
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Prikkerne viser det valgte billede og kan også trykkes på. */}
      <View style={styles.prikker}>
        {billeder.map((_, index) => (
          <Pressable
            key={`${kjole.id}-prik-${index}`}
            accessibilityRole="button"
            accessibilityLabel={`Vis billede ${index + 1}`}
            accessibilityState={{
              selected: valgtIndex === index,
            }}
            onPress={() => visBillede(index)}
            style={styles.prikKnap}
          >
            <View
              style={[
                styles.prik,
                valgtIndex === index && styles.aktivPrik,
              ]}
            />
          </Pressable>
        ))}
      </View>

      <Text style={styles.billedTekst}>
        {valgtIndex + 1} / {billeder.length}
        {' · Swipe for flere billeder'}
      </Text>

      <Text style={GlobalStyle.dressName}>
        {kjole.navn}
      </Text>

      <Text>Størrelser: {kjole.stoerrelser}</Text>
      <Text>Lejepris: {kjole.pris} kr.</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Se ${kjole.navn}`}
        onPress={() =>
          navigation.navigate('Detaljer', { kjole })
        }
        style={GlobalStyle.button}
      >
        <Text style={GlobalStyle.buttonText}>
          Se kjolen
        </Text>
      </Pressable>
    </View>
  );
}

export default function KjolerScreen({ navigation }) {
  return (
    <View style={GlobalStyle.container}>
      <FlatList
        data={kjoler}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text
            accessibilityRole="header"
            style={GlobalStyle.title}
          >
            Find din næste kjole
          </Text>
        }
        renderItem={({ item }) => (
          <KjoleKort
            kjole={item}
            navigation={navigation}
          />
        )}
      />
    </View>
  );
}