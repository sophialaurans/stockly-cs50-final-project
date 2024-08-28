import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import config from '../../../constants/config';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
      const existingItemIndex = items.findIndex(item => item.product_id === selectedProduct);
      
      if (existingItemIndex !== -1) {
        const updatedItems = [...items];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + parseInt(quantity, 10);
        const newTotal = existingItem.price * newQuantity;
  
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          total: newTotal,
        };
  
        setItems(updatedItems);
        setTotalPrice(prevTotal => prevTotal + existingItem.price * parseInt(quantity, 10));
      } else {
        const newItem = {
          product_id: selectedProduct,
          quantity: parseInt(quantity, 10),
          price: product.price,
          total: product.price * parseInt(quantity, 10),
          name: product.name,
          size: product.size,
        };
  
        setItems(prevItems => [...prevItems, newItem]);
        setTotalPrice(prevTotal => prevTotal + newItem.total);
      }
  
      handleInputChange('quantity', '');
    } else {
      Alert.alert('Product Error', 'Selected product is not valid.');
    }
  };  

  const handleDeleteItem = (product_id) => {
    setItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.product_id !== product_id);
      const deletedItem = prevItems.find(item => item.product_id === product_id);
      if (deletedItem) {
        setTotalPrice(prevTotal => prevTotal - deletedItem.total);
      }
      return updatedItems;
    });
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

      if (!token) {
        Alert.alert('Error', 'No authentication token found.');
        return;
      }

      const response = await axios.post(
        `${config.apiUrl}/new-order`,
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
              <Text>{item.name} {item.size}</Text>
              <Text>{item.quantity} x R${item.price}</Text>
              <Text>R${item.total.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => handleDeleteItem(item.product_id)} style={styles.deleteButton}>
                <FontAwesome name="trash" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>No items added yet.</Text>
      )}

      <Text>Total Price: R${totalPrice.toFixed(2)}</Text>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  deleteButton: {
    marginRight: 10,
  }
});

export default NewOrder;
