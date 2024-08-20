import React from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import useAuthenticatedFetch from '../../hooks/useAuthenticatedFetch';

const Products = () => {
    const { data, loading, error } = useAuthenticatedFetch('orders');

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View></View>
    );
};

export default Products;
