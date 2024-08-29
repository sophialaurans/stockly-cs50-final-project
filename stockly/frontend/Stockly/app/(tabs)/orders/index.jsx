import React from 'react';
import { View, Text, ActivityIndicator, FlatList, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthenticatedFetch from '../../../hooks/useAuthenticatedFetch';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Orders = () => {
    const navigation = useNavigation();
    const { data, loading, error } = useAuthenticatedFetch('orders');

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
                            <Text>Client: {item.client_id}</Text>
                            <Text>Total price: R$ {item.total_price?.toFixed(2)}</Text>
                            <Text>Date: {item.date.slice(0, 10)}</Text>
                            <Text>Status: {item.status}</Text>

                            <Text>Items:</Text>
                            {item.items.map((orderItem, index) => (
                                <View key={index}>
                                    <Text> - Product ID: {orderItem.product_id}</Text>
                                    <Text> - Quantity: {orderItem.quantity}</Text>
                                    <Text> - Price: R$ {orderItem.price}</Text>
                                </View>
                            ))}
                            <TouchableOpacity onPress={() => { navigation.navigate('order-details', { order: item })}}>
                                <FontAwesome5 name="edit" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            ) : (
                <Text>No orders registered yet.</Text>
            )}
            <Button
                title="New Order"
                onPress={() => navigation.navigate('new-order')}>
            </Button>
        </View>
    );
};

export default Orders;