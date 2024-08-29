import { Stack, useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ClientsLayout() {
  const navigation = useNavigation();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Clients',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('profile')} style={{ marginRight: 10 }}>
              <FontAwesome name="user" size={24} />
            </TouchableOpacity>
          ), 
        }}
      />
      <Stack.Screen name="register-client" options={{ title: 'New Client' }} />
      <Stack.Screen name="client-details" options={{ title: 'Details' }} />
    </Stack>
  );
}