import React, { useReducer, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../../constants/config'

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

const RegisterClient = () => {
  const navigation = useNavigation();  
  const [formState, handleInputChange] = useForm({
    name: '',
    phone_number: '',
    email: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    const { name, phone_number, email } = formState;

    if (!name) {
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
        `${config.apiUrl}/register-client`,
        { name, phone_number, email },
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
        label="Name"
        placeholder="Name"
        value={formState.name}
        onChangeText={text => handleInputChange('name', text)}
      />
      <FormField
        label="Phone number"
        placeholder="Phone number"
        value={formState.color}
        onChangeText={text => handleInputChange('phone_number', text)}
      />
      <FormField
        label="Email"
        placeholder="Email"
        value={formState.size}
        onChangeText={text => handleInputChange('email', text)}
      />
      <TouchableOpacity onPress={handleRegister}>
        <Text>Register Client</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text>{error}</Text>}
    </View>
  );
};

export default RegisterClient;