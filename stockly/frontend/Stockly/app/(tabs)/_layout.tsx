import { TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useNavigation } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const navigation = useNavigation();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }} >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('profile')} style={{ marginRight: 25 }}>
              <FontAwesome name="user" size={24} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome5 name="box-open" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="receipt" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clients',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="address-book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}