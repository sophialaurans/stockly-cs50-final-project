import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, FlatList, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthenticatedFetch from '../../../hooks/useAuthenticatedFetch';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FontAwesome } from '@expo/vector-icons';
import config from '../../../constants/config'

const Orders = () => {
    const navigation = useNavigation();
    const { data, loading, error } = useAuthenticatedFetch('orders');

    const [orders, setOrders] = useState(data);

    useEffect(() => {
        if (data) {
            setOrders(data);
        }
    }, [data])

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    const handleStatusChange = async (order_id, newStatus) => {
        try {
            const token = await AsyncStorage.getItem('access_token');

            if (!token) {
                Alert.alert('Error', 'No authentication token found.');
                navigation.replace('login');
                return;
            }

            const response = await axios.put(
                `${config.apiUrl}/orders/${order_id}/status`,
                { status: newStatus },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                const updatedOrders = orders.map((order) =>
                    order.order_id === order_id ? { ...order, status: newStatus } : order
                );
                setOrders(updatedOrders);
            } else {
                Alert.alert('Error', 'Failed to update order status');
            }
        } catch (error) {
            console.log('Catch Error:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'An unexpected error occurred.');
        }
    };

    const handleDelete = async (order_id) => {
        Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete this order?',
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
                                `${config.apiUrl}/orders/${order_id}`,
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`,
                                    },
                                }
                            );

                            if (response.status === 200) {
                                const updatedOrders = orders.filter((item) => item.order_id !== order_id);
                                setOrders(updatedOrders);
                                Alert.alert('Success', 'Order deleted successfully');
                            } else {
                                console.log('Error response:', response.data);
                                Alert.alert('Error', 'Failed to delete order');
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
                    data={orders}
                    keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                    renderItem={({ item }) => (
                        <View>
                            <Text>Client: {item.client_name}</Text>
                            <Text>Total price: R$ {item.total_price?.toFixed(2)}</Text>
                            <Text>Date: {item.date.slice(0, 10)}</Text>
                            <Text>Status: {item.status}</Text>

                            <Text>Items:</Text>
                            {item.items.map((orderItem, index) => (
                                <View key={index}>
                                    <Text> - Product: {orderItem.product_name} {orderItem.product_size} {orderItem.product_color}</Text>
                                    <Text> - Quantity: {orderItem.quantity}</Text>
                                    <Text> - Price: R$ {orderItem.price}</Text>
                                </View>
                            ))}
                            <Picker
                                selectedValue={item.status}
                                onValueChange={(newStatus) => handleStatusChange(item.order_id, newStatus)}
                                style={{ height: 50, width: 150 }}
                            >
                                <Picker.Item label="Pending" value="pending" />
                                <Picker.Item label="Completed" value="completed" />
                                <Picker.Item label="Shipped" value="shipped" />
                            </Picker>
                            <TouchableOpacity onPress={() => { navigation.navigate('order-details', { order: item })}}>
                                <FontAwesome5 name="edit" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { handleDelete(item.order_id) }}>
                                <FontAwesome name="trash" size={24} color="red" />
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