import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, FlatList, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import useAuthenticatedFetch from '../../../hooks/useAuthenticatedFetch';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Products = () => {
    const navigation = useNavigation();  
    const { data, loading, error } = useAuthenticatedFetch('products');

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
                    keyExtractor={(item) => item.product_id ? item.product_id.toString() : Math.random().toString()}
                    renderItem={({ item }) => (
                        <View>
                            <Text>Name: {item.name}</Text>
                            <Text>Size: {item.size}</Text>
                            <Text>Color: {item.color}</Text>
                            <Text>Price: R$ {item.price?.toFixed(2)}</Text>
                            <Text>Quantity: {item.quantity}</Text>
                            <TouchableOpacity onPress={() => { navigation.navigate('product-details', { product: item })}}>
                                <FontAwesome5 name="edit" size={24} color="black" />
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