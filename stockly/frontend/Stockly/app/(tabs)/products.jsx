import React from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import useAuthenticatedFetch from '../../hooks/useAuthenticatedFetch';

const Products = () => {
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
