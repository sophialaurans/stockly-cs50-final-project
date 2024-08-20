import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import useAuthenticatedFetch from '../../hooks/useAuthenticatedFetch';

const Dashboard = () => {
    const { data, loading, error } = useAuthenticatedFetch('');

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View>
            <Text>Total Products: {data.totalProducts}</Text>
            <Text>Total Stock: {data.totalStock}</Text>
            <Text>Orders in Progress: {data.pendingOrders}</Text>
            <Text>Revenue Last Month: {data.lastMonthRevenue}</Text>
            <Text>Total Clients: {data.totalClients}</Text>
        </View>
    );
};

export default Dashboard;
