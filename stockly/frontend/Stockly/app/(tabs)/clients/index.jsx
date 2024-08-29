import React from 'react';
import { View, Text, ActivityIndicator, FlatList, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthenticatedFetch from '../../../hooks/useAuthenticatedFetch';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Clients = () => {
    const navigation = useNavigation();
    const { data, loading, error } = useAuthenticatedFetch('clients');

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View>
            {data && data.length > 0 ? (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                    renderItem={({ item }) => (
                        <View>
                            <Text>Name: {item.name}</Text>
                            <Text>Phone number: {item.phone_number}</Text>
                            <Text>Email: {item.email}</Text>
                            
                            <TouchableOpacity onPress={() => { navigation.navigate('client-details', { client: item })}}>
                                <FontAwesome5 name="edit" size={24} color="black" />
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