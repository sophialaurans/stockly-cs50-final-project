import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductsStack from './ProductsStack';
import OrdersStack from './OrdersStack';
import ClientsStack from './ClientsStack';
import IndexScreen from '../app/(tabs)/index';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Index" component={IndexScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Products" component={ProductsStack} options={{ title: 'Products' }} />
      <Tab.Screen name="Orders" component={OrdersStack} options={{ title: 'Orders' }} />
      <Tab.Screen name="Clients" component={ClientsStack} options={{ title: 'Clients' }} />
    </Tab.Navigator>
  );
}