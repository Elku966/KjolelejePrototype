import React, { useCallback } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ElegantText as Text, GlobalStyle } from '../styles/GlobalStyle';

const kjoler = [
  {
    id: '1',
    navn: 'Brown Gala',
    stoerrelser: 'S, M, L',
    pris: 899,
    billede: require('../assets/kjole1.png'),
  },
  {
    id: '2',
    navn: 'Champagne Elegance',
    stoerrelser: 'XS, S, M',
    pris: 1099,
    billede: require('../assets/kjole2.png'),
  },
  {
    id: '3',
    navn: 'Bronze Couture',
    stoerrelser: 'M, L',
    pris: 749,
    billede: require('../assets/kjole3.png'),
  },
];

export default function KjolerScreen({ navigation }) {
  const player = useVideoPlayer(require('../assets/modevideo.mp4'), (video) => {
    video.loop = true;
    video.muted = true;
  });

  useFocusEffect(
    useCallback(() => {
      player.play();
      return () => player.pause();
    }, [player])
  );

  return (
    <View style={GlobalStyle.container}>
      <FlatList
        data={kjoler}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View
            style={{
              height: 220,
              borderRadius: 12,
              overflow: 'hidden',
              marginBottom: 20,
              backgroundColor: '#493B2B',
            }}
          >
            <VideoView
              player={player}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              nativeControls={false}
            />
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                justifyContent: 'flex-end',
                padding: 20,
              }}
            >
              
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={GlobalStyle.card}>
            <Image
              source={item.billede}
              style={GlobalStyle.dressImage}
              resizeMode="cover"
            />
            <Text style={GlobalStyle.dressName}>{item.navn}</Text>
            <Text>Størrelser: {item.stoerrelser}</Text>
            <Text>Lejepris: {item.pris} kr.</Text>

            <Pressable
              onPress={() => navigation.navigate('Detaljer', { kjole: item })}
              style={GlobalStyle.button}
            >
              <Text style={GlobalStyle.buttonText}>Se kjolen</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
