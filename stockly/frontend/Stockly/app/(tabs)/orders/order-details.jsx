import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../../constants/config';
import { FontAwesome } from '@expo/vector-icons';

const OrderDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { order } = route.params;

    const [clients, setClients] = useState(order.clients || []);
    const [products, setProducts] = useState([]);
    const [formState, setFormState] = useState({
        selectedClient: order?.client_id || '',
        selectedProduct: '',
        quantity: '',
    });
    const [items, setItems] = useState(order?.items || []);
    const [totalPrice, setTotalPrice] = useState(order?.total_price || 0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('access_token');
                if (!token) {
                    Alert.alert('Error', 'No authentication token found.');
                    navigation.replace('login');
                    return;
                }

                const [clientsResponse, productsResponse] = await Promise.all([
                    axios.get(`${config.apiUrl}/clients`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get(`${config.apiUrl}/products`, { headers: { 'Authorization': `Bearer ${token}` } }),
                ]);

                setClients(clientsResponse.data);
                setProducts(productsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                setError('An unexpected error occurred while fetching data.');
            }
        };

        fetchData();
    }, []);

    const getProductDetailsById = (productId) => {
        const product = products.find(p => p.product_id.toString() === productId.toString());
        return product ? `${product.name} ${product.size}` : 'Unknown Product';
    };

    const handleInputChange = (name, value) => {
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddItem = () => {
        const { selectedProduct, quantity } = formState;
    
        if (!selectedProduct || !quantity || isNaN(quantity) || quantity <= 0) {
            Alert.alert('Validation Error', 'Please select a product and enter a valid quantity.');
            return;
        }
    
        const product = products.find(p => p.product_id.toString() === selectedProduct.toString());
        if (!product) {
            Alert.alert('Product Error', 'Selected product is not valid.');
            return;
        }
    
        const updatedItems = [...items];
        const existingItemIndex = items.findIndex(item => item.product_id.toString() === selectedProduct.toString());
    
        if (existingItemIndex !== -1) {
            const existingItem = updatedItems[existingItemIndex];
            const newQuantity = existingItem.quantity + parseInt(quantity, 10);
            const newTotal = product.price * newQuantity;
    
            updatedItems[existingItemIndex] = { ...existingItem, quantity: newQuantity, total: newTotal };
            setItems(updatedItems);
            setTotalPrice(prevTotal => prevTotal + product.price * parseInt(quantity, 10));
        } else {
            const newItem = {
                product_id: selectedProduct,
                quantity: parseInt(quantity, 10),
                price: product.price,
                name: product.name,
                size: product.size,
                total: product.price * parseInt(quantity, 10),
            };
    
            setItems(prevItems => [...prevItems, newItem]);
            setTotalPrice(prevTotal => prevTotal + newItem.total);
        }
    
        handleInputChange('quantity', '');
    };    

    const handleDeleteItem = (product_id) => {
        Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => {
                        setItems(prevItems => {
                            const updatedItems = prevItems.filter(item => item.product_id !== product_id);
                            const deletedItem = prevItems.find(item => item.product_id === product_id);
                            if (deletedItem) {
                                setTotalPrice(prevTotal => prevTotal - deletedItem.total);
                            }
                            return updatedItems;
                        });
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const handleSave = async () => {
        const { selectedClient } = formState;

        if (!selectedClient || items.length === 0) {
            Alert.alert('Validation Error', 'Please select a client and add at least one item.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = await AsyncStorage.getItem('access_token');
            if (!token) {
                Alert.alert('Error', 'No authentication token found.');
                navigation.replace('login');
                return;
            }

            const response = await axios.put(
                `${config.apiUrl}/orders/details/${order.order_id}`,
                {
                    client_id: selectedClient,
                    items: items.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    status: 'pending',
                    total_price: totalPrice
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                Alert.alert('Success!', 'Order saved successfully');
                setItems([]);
                setTotalPrice(0);
                handleInputChange('selectedClient', '');
                navigation.replace('index');
            } else {
                Alert.alert('Error', 'Unexpected response status, please try again');
            }
        } catch (error) {
            console.error('Error:', error.message);
            console.error('Error Response:', error.response?.data);
            setError('An unexpected error occurred.');
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Select Client:</Text>
            <Picker
                selectedValue={formState.selectedClient}
                onValueChange={(itemValue) => handleInputChange('selectedClient', itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select a client" value="" />
                {clients.map(client => (
                    <Picker.Item key={client.client_id} label={client.name} value={client.client_id} />
                ))}
            </Picker>

            <Text>Select Product:</Text>
            <Picker
                selectedValue={formState.selectedProduct}
                onValueChange={(itemValue) => handleInputChange('selectedProduct', itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select a product" value="" />
                {products.map(product => (
                    <Picker.Item
                        key={product.product_id}
                        label={`${product.name} - ${product.size} - ${product.color} - $${product.price}`}
                        value={product.product_id}
                    />
                ))}
            </Picker>

            <Text>Quantity:</Text>
            <TextInput
                placeholder="Enter quantity"
                value={formState.quantity}
                onChangeText={(text) => handleInputChange('quantity', text)}
                keyboardType="numeric"
                style={styles.input}
            />

            <TouchableOpacity onPress={handleAddItem} style={styles.button} activeOpacity={0.7}>
                <Text>Add Item</Text>
            </TouchableOpacity>

            {items.length > 0 ? (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.product_id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text>{item.product_name} {item.product_size}</Text>
                            <Text>{item.quantity} x R${item.price}</Text>
                            <Text>R${(item.quantity * item.price).toFixed(2)}</Text>
                            <TouchableOpacity onPress={() => handleDeleteItem(item.product_id)}>
                                <FontAwesome name="trash" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}
                />            
            ) : (
                <Text>No items added yet</Text>
            )}

            <Text>Total: R${totalPrice}</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <TouchableOpacity onPress={handleSave} style={styles.button} activeOpacity={0.7}>
                    <Text>Save Order</Text>
                </TouchableOpacity>
            )}
            {error && <Text>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    picker: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        padding: 8,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 16,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderBottomWidth: 1,
    },
});

export default OrderDetails;
