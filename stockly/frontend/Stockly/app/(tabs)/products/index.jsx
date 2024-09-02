import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, FlatList, Button, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthenticatedFetch from '../../../hooks/useAuthenticatedFetch';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FontAwesome } from '@expo/vector-icons';
import config from '../../../constants/config'

const Products = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { data, loading, error, refetch } = useAuthenticatedFetch('products');
    
    const [products, setProducts] = useState(data);

    useEffect(() => {
        if (isFocused) {
            refetch();
        }
    }, [isFocused, refetch]);

    useEffect(() => {
        if (data) {
            setProducts(data);
        }
    }, [data]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    const handleDelete = async (product_id) => {
        Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete this item from your account?',
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
                                `${config.apiUrl}/products/${product_id}`,
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`,
                                    },
                                }
                            );

                            if (response.status === 200) {
                                const updatedProducts = products.filter((item) => item.product_id !== product_id);
                                setProducts(updatedProducts);
                                Alert.alert('Success', 'Product deleted successfully');
                            } else {
                                console.log('Error response:', response.data);
                                Alert.alert('Error', 'Failed to delete product');
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
                    data={products}
                    keyExtractor={(item) => item.product_id ? item.product_id.toString() : Math.random().toString()}
                    renderItem={({ item }) => (
                        <View>
                            <Text>Name: {item.name}</Text>
                            <Text>Size: {item.size}</Text>
                            <Text>Price: R$ {item.price?.toFixed(2)}</Text>
                            <Text>Quantity: {item.quantity}</Text>
                            <TouchableOpacity onPress={() => { navigation.navigate('product-details', { product: item })}}>
                                <FontAwesome5 name="edit" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { handleDelete(item.product_id) }}>
                                <FontAwesome name="trash" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            ) : (
                <Text>No products registered yet.</Text>
            )}
            <Button
                title="New Product"
                onPress={() => navigation.navigate('register-product')}
            />
        </View>
    );
};

export default Products;