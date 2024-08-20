import React, { useState, useEffect, useReducer } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useForm = (initialState) => {
  const [formState, setFormState] = useReducer((state, action) => {
    return { ...state, [action.name]: action.value };
  }, initialState);

  const handleInputChange = (name, value) => {
    setFormState({ name, value });
  };

  return [formState, handleInputChange];
};

const FormField = ({ label, value, onChangeText, placeholder }) => (
  <View>
    <Text>{label}:</Text>
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const RegisterProduct = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formState, handleInputChange] = useForm({
    name: '',
    color: '',
    size: '',
    dimensions: '',
    price: '',
    description: '',
    quantity: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
          
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get('http://127.0.0.1:5000/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setData(response.data);
      } catch (error) {
        setError('Error fetching data.');
        console.error('Error:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }            
    };

    fetchData();
  }, []);

  const handleRegister = async () => {
    const { name, color, size, dimensions, price, description, quantity } = formState;

    if (!name || !size || !price || !quantity) {
      Alert.alert('Validation Error', 'Please fill out all required fields.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('access_token');

      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await axios.post(
        'http://127.0.0.1:5000/register-product',
        { name, color, size, dimensions, price, description, quantity },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Alert.alert('Success!', response.data.message);
        navigation.replace('(tabs)/products');
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View>
      <FormField
        label="Name of the product"
        placeholder="Name"
        value={formState.name}
        onChangeText={text => handleInputChange('name', text)}
      />
      <FormField
        label="Color"
        placeholder="Color"
        value={formState.color}
        onChangeText={text => handleInputChange('color', text)}
      />
      <FormField
        label="Size"
        placeholder="Size"
        value={formState.size}
        onChangeText={text => handleInputChange('size', text)}
      />
      <FormField
        label="Dimensions"
        placeholder="Dimensions"
        value={formState.dimensions}
        onChangeText={text => handleInputChange('dimensions', text)}
      />
      <FormField
        label="Price"
        placeholder="Price"
        value={formState.price}
        onChangeText={text => handleInputChange('price', text)}
      />
      <FormField
        label="Description"
        placeholder="Description"
        value={formState.description}
        onChangeText={text => handleInputChange('description', text)}
      />
      <FormField
        label="Quantity"
        placeholder="Quantity"
        value={formState.quantity}
        onChangeText={text => handleInputChange('quantity', text)}
      />
      <TouchableOpacity onPress={handleRegister}>
        <Text>Register Product</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterProduct;