import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
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
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.brand}>KJOLELEJE</Text>
      <Text style={styles.tagline}>
        Særlige kjoler. Særlige øjeblikke.
      </Text>

      <Image
        source={require('../assets/kjole2.png')}
        style={styles.heroImage}
        resizeMode="cover"
        accessibilityLabel="Champagne Elegance gallakjole"
      />

      <View style={styles.intro}>
        <Text accessibilityRole="header" style={styles.title}>
          Din aften. Din kjole.
        </Text>

        <Text style={styles.body}>
          Find en kjole til de øjeblikke, du vil huske. Hos Kjoleleje
          kan du leje elegante gallakjoler og gøre en særlig aften
          til noget helt dit eget.
        </Text>

        {/* Åbner den eksisterende side med kjoler. */}
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
          <Text style={GlobalStyle.buttonText}>Se kjoler</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.eyebrow}>OM KJOLELEJE</Text>

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

        {/* Vandret galleri med prototypens eksisterende billeder. */}
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
              <Text style={styles.dressName}>{kjole.navn}</Text>
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