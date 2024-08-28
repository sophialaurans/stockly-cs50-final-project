import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../../constants/config';

const ProductDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { product } = route.params;

    const [name, setName] = useState(product.name);
    const [size, setSize] = useState(product.size);
    const [color, setColor] = useState(product.color);
    const [dimensions, setDimensions] = useState(product.dimensions);
    const [price, setPrice] = useState(product.price.toFixed(2));
    const [description, setDescription] = useState(product.description);
    const [quantity, setQuantity] = useState(product.quantity);

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
    
            if (!token) {
                Alert.alert('Error', 'No authentication token found.');
                navigation.replace('../../login');
                return;
            }

            const response = await axios.put(
                `${config.apiUrl}/products/${product.product_id}`,
                { name, size, color, dimensions, price, description, quantity },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {
                Alert.alert('Success', 'Product updated successfully');
                navigation.goBack();
            } else {
                console.log('Error response:', response.data);
                Alert.alert('Error', 'Failed to update product');
            }
        } catch (error) {
            console.log('Catch Error:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'An unexpected error occurred.');
        }
    };    

    return (
        <View>
            <Text>Name:</Text>
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <Text>Size:</Text>
            <TextInput
                placeholder="Size"
                value={size}
                onChangeText={setSize}
            />
            <Text>Color:</Text>
            <TextInput
                placeholder="Color"
                value={color}
                onChangeText={setColor}
            />
            <Text>Dimensions:</Text>
            <TextInput
                placeholder="Dimensions"
                value={dimensions}
                onChangeText={setDimensions}
            />
            <Text>Price:</Text>
            <TextInput
                placeholder="Price"
                value={price}
                keyboardType="numeric"
                onChangeText={text => setPrice(parseFloat(text).toFixed(2))}
            />
            <Text>Description:</Text>
            <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <Text>Quantity in Stock:</Text>
            <TextInput
                placeholder="Quantity"
                value={quantity.toString()}
                keyboardType="numeric"
                onChangeText={text => setQuantity(parseInt(text, 10))}
            />
            <Button
                title="Save"
                onPress={handleSave}
            />
        </View>
    );
};

export default ProductDetails;
