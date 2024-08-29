import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../../constants/config';

const ClientDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { client } = route.params;
    console.log('Route params:', route.params);

    const [name, setName] = useState(client.name);
    const [phone_number, setPhoneNumber] = useState(client.phone_number);
    const [email, setEmail] = useState(client.color);

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
    
            if (!token) {
                Alert.alert('Error', 'No authentication token found.');
                navigation.replace('login');
                return;
            }

            const response = await axios.put(
                `${config.apiUrl}/clients/${client.client_id}`,
                { name, phone_number, email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {
                Alert.alert('Success', 'Client details updated successfully');
                navigation.goBack();
            } else {
                console.log('Error response:', response.data);
                Alert.alert('Error', 'Failed to update client details');
            }
        } catch (error) {
            console.log('Catch Error:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'An unexpected error occurred.');
        }
    };    

    return (
        <View>
            <Text>Name:</Text>
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <Text>Phone number:</Text>
            <TextInput
                placeholder="Phone number"
                value={phone_number}
                onChangeText={setPhoneNumber}
            />
            <Text>Email:</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Button
                title="Save"
                onPress={handleSave}
            />
        </View>
    );
};

export default ClientDetails;
