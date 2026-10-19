import React, { useCallback } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';

import {
  ElegantText as Text,
  GlobalStyle,
} from '../styles/GlobalStyle';

import { ForsideStyle as styles } from '../styles/ForsideStyle';

const inspiration = [
  {
    navn: 'Brown Gala',
    billede: require('../assets/kjole1.png'),
  },
  {
    navn: 'Champagne Elegance',
    billede: require('../assets/kjole2.png'),
  },
  {
    navn: 'Bronze Couture',
    billede: require('../assets/kjole3.png'),
  },
];

export default function ForsideScreen({ navigation }) {
  // Videoen gentages og afspilles uden lyd.
  const player = useVideoPlayer(
    require('../assets/modevideo.mp4'),
    (video) => {
      video.loop = true;
      video.muted = true;
    }
  );

  // Afspiller videoen, når forsiden er åben.
  // Sætter den på pause, når brugeren skifter side.
  useFocusEffect(
    useCallback(() => {
      player.play();

      return () => {
        player.pause();
      };
    }, [player])
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.brand}>LUXURY RENTALS</Text>

      <Text style={styles.tagline}>
        Særlige kjoler. Særlige øjeblikke.
      </Text>

      <View style={styles.heroVideoContainer}>
        <VideoView
          player={player}
          style={styles.heroVideo}
          contentFit="cover"
          nativeControls={false}
        />
      </View>

      <View style={styles.intro}>
        <Text accessibilityRole="header" style={styles.title}>
          Din aften. Din kjole.
        </Text>

        <Text style={styles.body}>
          Find en kjole til de øjeblikke, du vil huske. Hos Luxury
          Rentals kan du leje elegante gallakjoler og gøre en
          særlig aften til noget helt dit eget.
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityHint="Åbner oversigten over kjoler"
          onPress={() => navigation.navigate('Kjoler')}
          style={({ pressed }) => [
            GlobalStyle.button,
            styles.button,
            pressed && styles.pressed,
          ]}
        >
          <Text style={GlobalStyle.buttonText}>
            Se kjoler
          </Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.eyebrow}>OM LUXURY RENTALS</Text>

        <Text accessibilityRole="header" style={styles.heading}>
          En ny oplevelse i en delt garderobe
        </Text>

        <Text style={styles.body}>
          Vi elsker kjoler, der får dig til at føle dig godt tilpas.
          Vores idé er enkel: Du behøver ikke eje en kjole for at
          skabe minder i den. Med udlejning kan den samme kjole
          blive en del af flere særlige aftener.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.eyebrow}>FIND INSPIRATION</Text>

        <Text accessibilityRole="header" style={styles.heading}>
          Et glimt af garderoben
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gallery}
        >
          {inspiration.map((kjole) => (
            <View key={kjole.navn} style={styles.dressCard}>
              <Image
                source={kjole.billede}
                style={styles.dressImage}
                resizeMode="cover"
                accessibilityLabel={kjole.navn}
              />

              <Text style={styles.dressName}>
                {kjole.navn}
              </Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.galleryHint}>
          Stryg for at se flere kjoler
        </Text>
      </View>

      <Text style={styles.footer}>
        Lej en kjole. Skab et minde.
      </Text>
    </ScrollView>
  );
}