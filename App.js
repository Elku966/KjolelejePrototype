import React, { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import { elegantFont } from './styles/GlobalStyle';

// Importerer appens forskellige screens
import ForsideScreen from './screens/ForsideScreen';
import KjolerScreen from './screens/KjolerScreen';
import DetaljerScreen from './screens/DetaljerScreen';
import BestillingScreen from './screens/BestillingScreen';
import KurvScreen from './screens/KurvScreen';

// Opretter navigationen
const Tab = createBottomTabNavigator();

// Appens farver
const GULD = '#8A6A3F';
const BAGGRUND = '#F7F1E8';

export default function App() {
  // Gemmer alle kjoler, som kunden lægger i kurven
  const [kurv, setKurv] = useState([]);

  // Tilføjer en kjole til kurven
  function tilfoejTilKurv(vare) {
    setKurv((tidligereKurv) => [
      ...tidligereKurv,
      {
        ...vare,
        // Giver hver vare et unikt ID
        kurvId: `${Date.now()}-${Math.random()}`,
      },
    ]);
  }

  // Fjerner en bestemt kjole fra kurven
  function fjernFraKurv(kurvId) {
    setKurv((tidligereKurv) =>
      tidligereKurv.filter((vare) => vare.kurvId !== kurvId)
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Forside"
        screenOptions={({ route }) => ({
          // Header øverst på skærmen
          headerStyle: {
            backgroundColor: GULD,
          },

          headerTintColor: '#FFFFFF',

          headerTitleStyle: {
            fontFamily: elegantFont,
            fontSize: 22,
          },

          // Navigation nederst på skærmen
          tabBarActiveTintColor: GULD,
          tabBarInactiveTintColor: '#8C8984',

          tabBarLabelStyle: {
            fontFamily: elegantFont,
            fontSize: 12,
          },

          tabBarStyle: {
            backgroundColor: BAGGRUND,
          },

          // Ikoner til de forskellige sider
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'ellipse-outline';

            if (route.name === 'Forside') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Kjoler') {
              iconName = focused ? 'sparkles' : 'sparkles-outline';
            } else if (route.name === 'Detaljer') {
              iconName = focused ? 'image' : 'image-outline';
            } else if (route.name === 'Bestilling') {
              iconName = focused ? 'bag-handle' : 'bag-handle-outline';
            } else if (route.name === 'Kurv') {
              iconName = focused ? 'cart' : 'cart-outline';
            }

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        {/* SCREEN 1: Forsiden, som vises, når appen åbnes */}
        <Tab.Screen
          name="Forside"
          component={ForsideScreen}
        />

        {/* SCREEN 2: Oversigt over kjoler */}
        <Tab.Screen
          name="Kjoler"
          component={KjolerScreen}
        />

        {/* SCREEN 3: Detaljer om den valgte kjole */}
        <Tab.Screen
          name="Detaljer"
          component={DetaljerScreen}
        />

        {/* SCREEN 4: Bestillingssiden */}
        <Tab.Screen name="Bestilling">
          {(props) => (
            <BestillingScreen
              {...props}
              tilfoejTilKurv={tilfoejTilKurv}
            />
          )}
        </Tab.Screen>

        {/* SCREEN 5: Kurvesiden */}
        <Tab.Screen
          name="Kurv"
          options={{
            // Viser antallet af kjoler i kurven
            tabBarBadge:
              kurv.length > 0 ? kurv.length : undefined,

            tabBarBadgeStyle: {
              backgroundColor: GULD,
              color: '#FFFFFF',
            },
          }}
        >
          {(props) => (
            <KurvScreen
              {...props}
              kurv={kurv}
              fjernFraKurv={fjernFraKurv}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}