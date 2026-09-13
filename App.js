import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { elegantFont } from './styles/GlobalStyle';

import KjolerScreen from './screens/KjolerScreen';
import DetaljerScreen from './screens/DetaljerScreen';
import BestillingScreen from './screens/BestillingScreen';

const Tab = createBottomTabNavigator();
const GULD = '#8A6A3F';

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: GULD },
          headerTintColor: '#fff',
          headerTitleStyle: { fontFamily: elegantFont, fontSize: 22 },
          tabBarActiveTintColor: GULD,
          tabBarInactiveTintColor: '#8C8984',
          tabBarLabelStyle: { fontFamily: elegantFont, fontSize: 12 },
          tabBarStyle: { backgroundColor: '#F7F1E8' },
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
        <Tab.Screen name="Kjoler" component={KjolerScreen} />
        <Tab.Screen name="Detaljer" component={DetaljerScreen} />
        <Tab.Screen name="Bestilling" component={BestillingScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
