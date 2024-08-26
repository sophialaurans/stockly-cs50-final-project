import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import config from '../../../constants/config'

const NewOrder = () => {
  const navigation = useNavigation();
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [formState, setFormState] = useState({
    selectedClient: '',
    selectedProduct: '',
    quantity: '',
  });
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');

        if (!token) {
          Alert.alert('Error', 'No authentication token found.');
          navigation.replace('../../login');
          return;
        }

        const [clientsResponse, productsResponse] = await Promise.all([
          axios.get(`${config.apiUrl}/clients`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          axios.get(`${config.apiUrl}/products`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ]);

        setClients(clientsResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        console.log('Error fetching data:', error.message);
        setError('An unexpected error occurred while fetching data.');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (name, value) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddItem = () => {
    const { selectedProduct, quantity } = formState;
  
    if (!selectedProduct || !quantity || isNaN(quantity) || quantity <= 0) {
      Alert.alert('Validation Error', 'Please select a product and enter a valid quantity.');
      return;
    }
  
    const product = products.find(p => p.product_id.toString() === selectedProduct.toString());
  
    if (product) {
      const newItem = {
        product_id: selectedProduct,
        quantity: parseInt(quantity, 10),
        price: product.price,
        total: product.price * parseInt(quantity, 10),
        name: product.name,
      };
  
      setItems(prevItems => {
        const updatedItems = [...prevItems, newItem];
        return updatedItems;
      });
  
      setTotalPrice(prevTotal => prevTotal + newItem.total);
      handleInputChange('quantity', '');
    } else {
      Alert.alert('Product Error', 'Selected product is not valid.');
    }
  };
    

  const handleSubmitOrder = async () => {
    const { selectedClient } = formState;
  
    if (!selectedClient || items.length === 0) {
      Alert.alert('Validation Error', 'Please select a client and add at least one item.');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const token = await AsyncStorage.getItem('access_token');
      const userId = await AsyncStorage.getItem('user_id');
  
      console.log('Token:', token);
      console.log('User ID:', userId);
      console.log('Selected Client:', selectedClient);
      console.log('Items:', items);
      console.log('Total Price:', totalPrice);
  
      if (!token || !userId) {
        Alert.alert('Error', 'No authentication token or user ID found.');
        return;
      }
  
      const response = await axios.post(
        `${config.apiUrl}/new-order`,
        {
          user_id: userId,
          client_id: selectedClient,
          items: items,
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
  
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);
  
      if (response.status === 201) {
        Alert.alert('Success!', 'Order placed successfully');
        setItems([]);
        setTotalPrice(0);
        handleInputChange('selectedClient', '');
        navigation.replace('index');
      } else {
        Alert.alert('Error', 'Unexpected response status, please try again');
      }
    } catch (error) {
      console.log('Error:', error.message);
      console.log('Error Response:', error.response?.data);
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

      <TouchableOpacity onPress={handleAddItem} style={styles.button}>
        <Text>Add Item</Text>
      </TouchableOpacity>

      {items.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.product_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.name}</Text>
              <Text>{item.quantity} x ${item.price}</Text>
              <Text>${item.total.toFixed(2)}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No items added yet.</Text>
      )}

      <Text>Total Price: ${totalPrice.toFixed(2)}</Text>

      <TouchableOpacity onPress={handleSubmitOrder} style={styles.button}>
        <Text>Place Order</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    padding: 8
  },
  picker: {
    marginBottom: 8
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  }
});

export default NewOrder;
