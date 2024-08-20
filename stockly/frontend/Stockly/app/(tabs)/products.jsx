import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Products = () => {
    const navigation = useNavigation();
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = await AsyncStorage.getItem('access_token');
                
                if (!token) {
                    setError('Token not found');
                    setLoading(false);
                    navigation.replace('intro');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:5000/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching data.');
                setLoading(false);
                console.error('Error:', error.response ? error.response.data : error.message);
            }            
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View>
            {products && products.length > 0 ? (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                    renderItem={({ item }) => (
                        <View>
                            <Text>Name: {item.name}</Text>
                            <Text>Size: {item.size}</Text>
                            <Text>Color: {item.color}</Text>
                            <Text>Price: R$ {item.price?.toFixed(2)}</Text>
                            <Text>Quantity: {item.quantity}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text>No products registered yet.</Text>
            )}
        </View>
    );
};

export default Products;
