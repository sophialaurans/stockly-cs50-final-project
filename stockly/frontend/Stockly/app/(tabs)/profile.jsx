import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 
import config from '../../constants/config';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const response = await axios.get(`${config.apiUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
        setIsLoading(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile');
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.put(`${config.apiUrl}/edit-profile`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', response.data.message);
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }
  
      await AsyncStorage.removeItem('access_token');
      Alert.alert('Logged out', 'You have been logged out successfully.');
      
      navigation.replace('login');
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };
  

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Name:</Text>
      <TextInput
        value={profile.name}
        editable={isEditing}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
        style={{
          borderBottomWidth: 1,
          marginBottom: 20,
          borderColor: isEditing ? '#000' : '#ccc',
          color: isEditing ? '#000' : '#888'
        }}
      />
      <Text>Email:</Text>
      <TextInput
        value={profile.email}
        editable={isEditing}
        onChangeText={(text) => setProfile({ ...profile, email: text })}
        style={{
          borderBottomWidth: 1,
          marginBottom: 20,
          borderColor: isEditing ? '#000' : '#ccc',
          color: isEditing ? '#000' : '#888'
        }}
      />
      <Text>Phone:</Text>
      <TextInput
        value={profile.phone}
        editable={isEditing}
        onChangeText={(text) => setProfile({ ...profile, phone: text })}
        style={{
          borderBottomWidth: 1,
          marginBottom: 20,
          borderColor: isEditing ? '#000' : '#ccc',
          color: isEditing ? '#000' : '#888'
        }}
      />
      {isEditing ? (
        <Button title="Save" onPress={handleSave} />
      ) : (
        <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
      )}
      <View style={{ marginTop: 20 }}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
};

export default ProfileScreen;
