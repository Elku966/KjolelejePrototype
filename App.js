import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import { elegantFont } from './styles/GlobalStyle';

import ForsideScreen from './screens/ForsideScreen';
import KjolerScreen from './screens/KjolerScreen';
import DetaljerScreen from './screens/DetaljerScreen';
import BestillingScreen from './screens/BestillingScreen';
import KurvScreen from './screens/KurvScreen';
import PersonalShopperScreen from './screens/PersonalShopperScreen';
import BetalingScreen from './screens/BetalingScreen';

const Tab = createBottomTabNavigator();

const GULD = '#8A6A3F';
const BAGGRUND = '#F7F1E8';

export default function App() {
  //kurven deles mellem fanerne, så valg og antal følger kunden rundt i appen.
  const [kurv, setKurv] = useState([]);

  //læægger en bestillingslinje i kurven. Eget ID gør det muligt at skelne mellem to af samme kjole i samme kurv.
  function tilfoejTilKurv(vare) {
    setKurv((tidligereKurv) => [
      ...tidligereKurv,
      {
        ...vare,
        kurvId: `${Date.now()}-${Math.random()}`,
      },
    ]);
  }

  //fjerner kun den valgte linje, ikke andre kopier af samme kjole.
  function fjernFraKurv(kurvId) {
    setKurv((tidligereKurv) =>
      tidligereKurv.filter((vare) => vare.kurvId !== kurvId)
    );
  }

  return (
    //tab-navigationen er appens fælles ramme; kurven sendes som props til de skærme, der skal vise eller ændre den.
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Forside"
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: GULD,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontFamily: elegantFont,
            fontSize: 22,
          },
          tabBarActiveTintColor: GULD,
          tabBarInactiveTintColor: '#8C8984',
          tabBarLabelStyle: {
            fontFamily: elegantFont,
            fontSize: 10,
            marginHorizontal: 0,
            paddingHorizontal: 0,
          },
          tabBarItemStyle: {
            flex: 1,
            minWidth: 0,
            paddingHorizontal: 0,
          },
          tabBarIconStyle: {
            marginTop: 2,
          },
          tabBarStyle: {
            backgroundColor: BAGGRUND,
          },
          tabBarIcon: ({ focused, color, size }) => {
            const ikoner = {
              Forside: ['home', 'home-outline'],
              Kjoler: ['sparkles', 'sparkles-outline'],
              Stylist: ['chatbubbles', 'chatbubbles-outline'],
              Detaljer: ['image', 'image-outline'],
              Bestilling: ['bag-handle', 'bag-handle-outline'],
              Kurv: ['cart', 'cart-outline'],
              Betaling: ['card', 'card-outline'],
            };

            const ikon = ikoner[route.name];

            return (
              <Ionicons
                name={ikon[focused ? 0 : 1]}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name="Forside"
          component={ForsideScreen}
        />

        <Tab.Screen
          name="Kjoler"
          component={KjolerScreen}
        />

        <Tab.Screen
          name="Stylist"
          component={PersonalShopperScreen}
          options={{
            headerTitle: 'Personal shopper',
          }}
        />

        <Tab.Screen
          name="Detaljer"
          component={DetaljerScreen}
        />

        <Tab.Screen
          name="Bestilling"
          options={{ tabBarLabel: 'Bestil' }}
        >
          {(props) => (
            <BestillingScreen
              {...props}
              tilfoejTilKurv={tilfoejTilKurv}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Kurv"
          options={{
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

        <Tab.Screen
          name="Betaling"
          options={{
            title: 'Betaling',
            //betaling åbnes fra kurven, ikke som en almindelig fane.
            tabBarButton: () => null,
          }}
        >
          {(props) => (
            <BetalingScreen
              {...props}
              kurv={kurv}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
