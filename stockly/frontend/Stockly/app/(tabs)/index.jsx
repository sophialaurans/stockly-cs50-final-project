import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('access_token');
                
                if (!token) {
                    setError('Token not found');
                    setLoading(false);
                    navigation.replace('intro');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:5000/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setData(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching data.');
                setLoading(false);
                console.error('Error:', error.response ? error.response.data : error.message);
            }            
        };

        fetchData();
    }, []);

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
