import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../constants/config';

const useClient = (client_id = null) => {
    const route = useRoute();
    const { client } = route.params || {};

    const initialFormState = {
        name: client?.name || '',
        phone_number: client?.phone_number || '',
        email: client?.email || '',
    };

    const [formState, setFormState] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            if (client_id) {
                try {
                    const token = await AsyncStorage.getItem('access_token');
                    if (!token) {
                        Alert.alert('Error', 'No authentication token found.');
                        return;
                    }

                    const response = await axios.get(
                        `${config.apiUrl}/clients/details/${client_id}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                        }
                    );

                    if (response.status === 200) {
                        setFormState(response.data);
                    } else {
                        Alert.alert('Error', 'Failed to fetch client data');
                    }
                } catch (error) {
                    console.error('Error fetching client:', error.message);
                    Alert.alert('Error', 'An unexpected error occurred.');
                }
            }
        };

        fetchClients();
    }, [client_id]);

    const handleInputChange = (name, value) => {
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleRegister = async (navigation) => {
        const { name, phone_number, email } = formState;

        if ( !name ) {
            Alert.alert('Validation Error', 'Please fill out all required fields.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = await AsyncStorage.getItem('access_token');
            if (!token) {
                Alert.alert('Error', 'No authentication token found.');
                return;
            }

            const response = await axios.post(
                `${config.apiUrl}/register-client`,
                { name, phone_number, email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                Alert.alert('Success!', response.data.message);
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Unexpected response status, please try again');
            }
        } catch (error) {
            console.log('Error:', error.message);
            setError('An unexpected error occurred.');
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (navigation) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
    
            if (!token) {
                Alert.alert('Error', 'No authentication token found.');
                navigation.replace('login');
                return;
            }

            const response = await axios.put(
                `${config.apiUrl}/clients/details/${client_id || client.client_id}`,
                formState,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {
                Alert.alert('Success', 'Client updated successfully');
                navigation.goBack();
            } else {
                console.log('Error response:', response.data);
                Alert.alert('Error', 'Failed to update client');
            }
        } catch (error) {
            console.log('Catch Error:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'An unexpected error occurred.');
        }
    };

    return {
        formState,
        handleInputChange,
        handleRegister,
        handleSave,
        loading,
        error,
    };
};

export default useClient;