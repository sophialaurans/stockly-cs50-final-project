import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientsScreen from '../app/(tabs)/clients';
import RegisterClientScreen from '../app/(tabs)/register-client';

const Stack = createNativeStackNavigator();

export default function ClientsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Clients" component={ClientsScreen} options={{ title: 'Clients' }} />
      <Stack.Screen name="RegisterClient" component={RegisterClientScreen} options={{ title: 'Register Client' }} />
    </Stack.Navigator>
  );
}
