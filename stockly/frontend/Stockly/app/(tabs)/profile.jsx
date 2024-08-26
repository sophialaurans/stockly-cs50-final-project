import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../constants/config';

const EditProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          Alert.alert('Error', 'No token found');
          return;
        }

        const response = await axios.get(`${config.apiUrl}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const profile = response.data;
          setName(profile.name || '');
          setEmail(profile.email || '');
          setPhone(profile.phone || '');
        } else {
          Alert.alert('Error', 'Failed to load profile');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred');
        console.error(error);
      }
    };

    loadProfileData();
  }, []);

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }

      const response = await axios.post(`${config.apiUrl}/edit-profile`, {
        name,
        email,
        phone
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      Alert.alert('Success', 'Logged out successfully');
      // Navega para a tela de login aqui
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Name</Text>
      <TextInput
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <Text>Email</Text>
      <TextInput
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Text>Phone</Text>
      <TextInput
        placeholder="Enter Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Button title="Submit" onPress={handleSubmit} />
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
};

export default EditProfileScreen;
