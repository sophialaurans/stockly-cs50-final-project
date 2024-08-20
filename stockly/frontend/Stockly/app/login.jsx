import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (key, value) => {
    setFormState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleLogin = async () => {
    const { email, password } = formState;

    if (!email || !password) {
      Alert.alert('Error', 'Missing email or password');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      if (response.status === 200) {
        const { access_token } = response.data;
        await AsyncStorage.setItem('access_token', access_token);
        navigation.replace('(tabs)');
      } else {
        console.log('Error', response.data.message || 'An error occurred');
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'An unexpected error occurred';
      console.log('Error', errorMessage);
    }
  };

  return (
    <View>
      <Text>STOCKLY</Text>
      <View>
        <Text>Email:</Text>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={formState.email}
          onChangeText={text => handleInputChange('email', text)}
        />
        <Text>Password:</Text>
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={formState.password}
          onChangeText={text => handleInputChange('password', text)}
        />
      </View>
      <TouchableOpacity onPress={handleLogin}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
