import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useAuthenticatedFetch = (endpoint) => {
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

                const response = await axios.get(`http://127.0.0.1:5000/${endpoint}`, {
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
    }, [endpoint]);

    return { data, loading, error };
};

export default useAuthenticatedFetch;
