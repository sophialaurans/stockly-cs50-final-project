import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (key, value) => {
    setFormState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = formState;

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required')
      return;
    }

    try {
      const response = await axios.post(
        'http://192.168.18.3:5000/register',
        { name, email, password, confirm_password: confirmPassword },
        { headers: { 'Content-Type': 'application/json' } },
      );

      if (response.status === 201) {
        Alert.alert('Success!', response.data.message);
        navigation.replace('login');
      } else if (response.status === 400) {
        Alert.alert('Error:', response.data.message);
      }
      else {
        Alert.alert('Error', 'Unexpected response status, please try again');
      }
    } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log('Error', error.response.data.message || 'Bad Request');
        }
        else {
          console.log('Error', 'An unexpected error occurred');
        }
      }
  };

  return (
    <View>
      <Text>STOCKLY</Text>
      <View>
        <Text>Name:</Text>
        <TextInput
          placeholder="Name"
          value={formState.name}
          onChangeText={text => handleInputChange('name', text)}
        />
        <Text>E-mail:</Text>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={formState.email}
          onChangeText={text => handleInputChange('email', text)}
        />
        <Text>Create a password:</Text>
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={formState.password}
          onChangeText={text => handleInputChange('password', text)}
        />
        <Text>Confirm your password:</Text>
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={formState.confirmPassword}
          onChangeText={text => handleInputChange('confirmPassword', text)}
        />
      </View>
      <TouchableOpacity onPress={handleRegister}>
        <Text>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
