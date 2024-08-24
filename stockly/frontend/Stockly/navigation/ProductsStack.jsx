import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductsScreen from '../app/(tabs)/products';
import RegisterProductScreen from '../app/(tabs)/register-product';

const Stack = createNativeStackNavigator();

export default function ProductsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Products" component={ProductsScreen} options={{ title: 'Products' }} />
      <Stack.Screen name="RegisterProduct" component={RegisterProductScreen} options={{ title: 'Register Product' }} />
    </Stack.Navigator>
  );
}
