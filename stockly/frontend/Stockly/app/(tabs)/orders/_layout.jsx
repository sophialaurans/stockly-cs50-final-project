import { Stack, useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function OrdersLayout() {
  const navigation = useNavigation();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Orders',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('profile')} style={{ marginRight: 10 }}>
              <FontAwesome name="user" size={24} />
            </TouchableOpacity>
          ), 
        }}
      />
      <Stack.Screen name="new-order" options={{ title: 'New Order' }} />
      <Stack.Screen name="order-details" options={{ title: 'Details' }} />
    </Stack>
  );
}