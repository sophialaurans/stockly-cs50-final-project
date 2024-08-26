import React, { useReducer, useState } from 'react';
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
  const [formState, handleInputChange] = useForm({
    name: '',
    color: '',
    size: '',
    dimensions: '',
    price: '',
    description: '',
    quantity: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    const { name, color, size, dimensions, price, description, quantity } = formState;

    if (!name || !price || !quantity) {
      Alert.alert('Validation Error', 'Please fill out all required fields.');
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
        `http://127.0.0.1:5000/register-product`,
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
        navigation.replace('index');
      } else {
        Alert.alert('Error', 'Unexpected response status, please try again');
      }
    } catch (error) {
      console.log('Error:', error.message);
      setError('An unexpected error occurred.');
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

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
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text>{error}</Text>}
    </View>
  );
};

export default RegisterProduct;
