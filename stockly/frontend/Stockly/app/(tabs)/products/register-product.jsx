import React from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useProduct from '../../../hooks/useProduct';
import FormField from '../../../components/FormField';

const RegisterProduct = () => {
  const navigation = useNavigation();
  const {
    formState: { name, color, size, dimensions, price, description, quantity },
    handleInputChange,
    handleRegister,
    loading,
    error,
  } = useProduct();

  return (
    <View>
      <FormField
        placeholder="Name"
        label="Name"
        value={name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      <FormField
        placeholder="Size"
        label="Size"
        value={size}
        onChangeText={(text) => handleInputChange('size', text)}
      />
      <FormField
        placeholder="Color"
        label="Color"
        value={color}
        onChangeText={(text) => handleInputChange('color', text)}
      />
      <FormField
        placeholder="Dimensions"
        label="Dimensions"
        value={dimensions}
        onChangeText={(text) => handleInputChange('dimensions', text)}
      />
      <FormField
        placeholder="Price"
        label="Price"
        value={price}
        onChangeText={(text) => handleInputChange('price', text)}
      />
      <FormField
        placeholder="Description"
        label="Description"
        value={description}
        onChangeText={(text) => handleInputChange('description', text)}
      />
      <FormField
        placeholder="Quantity"
        label="Quantity"
        value={quantity}
        onChangeText={(text) => handleInputChange('quantity', text)}
      />
      <Button
        title="Register"
        onPress={() => handleRegister(navigation)}
      />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text>{error}</Text>}
    </View>
  );
};

export default RegisterProduct;