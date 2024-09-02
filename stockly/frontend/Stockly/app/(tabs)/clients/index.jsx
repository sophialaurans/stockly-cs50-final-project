import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, FlatList, Button, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthenticatedFetch from '../../../hooks/useAuthenticatedFetch';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FontAwesome } from '@expo/vector-icons';
import config from '../../../constants/config'

const Clients = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { data, loading, error, refetch } = useAuthenticatedFetch('clients');

    const [clients, setClients] = useState(data);

    useEffect(() => {
        if (isFocused) {
            refetch();
        }
    }, [isFocused, refetch]);

    useEffect(() => {
        if (data) {
            setClients(data);
        }
    }, [data])

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    const handleDelete = async (client_id) => {
        Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete this client?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('access_token');
                    
                            if (!token) {
                                Alert.alert('Error', 'No authentication token found.');
                                navigation.replace('login');
                                return;
                            }

                            const response = await axios.delete(
                                `${config.apiUrl}/clients/${client_id}`,
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`,
                                    },
                                }
                            );

                            if (response.status === 200) {
                                const updatedClients = clients.filter((item) => item.client_id !== client_id);
                                setClients(updatedClients);
                                Alert.alert('Success', 'Client deleted successfully');
                            } else {
                                console.log('Error response:', response.data);
                                Alert.alert('Error', 'Failed to delete client');
                            }
                        } catch (error) {
                            console.log('Catch Error:', error.response ? error.response.data : error.message);
                            Alert.alert('Error', 'An unexpected error occurred.');
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    return (
        <View>
            {data && data.length > 0 ? (
                <FlatList
                    data={clients}
                    keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                    renderItem={({ item }) => (
                        <View>
                            <Text>Name: {item.name}</Text>
                            <Text>Phone number: {item.phone_number}</Text>
                            <Text>Email: {item.email}</Text>
                            
                            <TouchableOpacity onPress={() => { navigation.navigate('client-details', { client: item })}}>
                                <FontAwesome5 name="edit" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { handleDelete(item.client_id) }}>
                                <FontAwesome name="trash" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            ) : (
                <Text>No clients registered yet.</Text>
            )}
            <Button
                title="New Client"
                onPress={() => navigation.navigate('register-client')}>
            </Button>
        </View>
    );
};

export default Clients;