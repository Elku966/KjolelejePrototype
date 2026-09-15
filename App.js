import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { elegantFont } from './styles/GlobalStyle';

import KjolerScreen from './screens/KjolerScreen';
import DetaljerScreen from './screens/DetaljerScreen';
import BestillingScreen from './screens/BestillingScreen';

// Opretter navigationen med faner nederst i appen
const Tab = createBottomTabNavigator();

// Appens gennemgående guldfarve
const GULD = '#8A6A3F';

export default function App() {
  return (
    // NavigationContainer holder styr på, hvilken side der er åben
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // Udseendet på overskriften øverst på hver side
          headerStyle: { backgroundColor: GULD },
          headerTintColor: '#fff',
          headerTitleStyle: { fontFamily: elegantFont, fontSize: 22 },

          // Udseendet på fanerne nederst
          tabBarActiveTintColor: GULD,
          tabBarInactiveTintColor: '#8C8984',
          tabBarLabelStyle: { fontFamily: elegantFont, fontSize: 12 },
          tabBarStyle: { backgroundColor: '#F7F1E8' },

          // Vælger et ikon ud fra fanens navn og om fanen er aktiv
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Kjoler') {
              iconName = focused ? 'sparkles' : 'sparkles-outline';
            } else if (route.name === 'Detaljer') {
              iconName = focused ? 'image' : 'image-outline';
            } else {
              iconName = focused ? 'bag-handle' : 'bag-handle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        {/* Appens tre sider og deres navne i navigationen */}
        <Tab.Screen name="Kjoler" component={KjolerScreen} />
        <Tab.Screen name="Detaljer" component={DetaljerScreen} />
        <Tab.Screen name="Bestilling" component={BestillingScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}