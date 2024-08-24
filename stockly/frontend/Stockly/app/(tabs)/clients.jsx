import React from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import useAuthenticatedFetch from '../../hooks/useAuthenticatedFetch';

const Clients = () => {
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
                        </View>
                    )}
                />
            ) : (
                <Text>No clients registered yet.</Text>
            )}
        </View>
    );
};

export default Clients;