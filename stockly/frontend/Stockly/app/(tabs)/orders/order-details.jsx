import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useOrder from '../../../hooks/useOrder';
import FormField from '../../../components/FormField';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const OrderDetails = () => {
    const navigation = useNavigation();
    const {
        clients,
        products,
        formState,
        items,
        totalPrice,
        loading,
        error,
        handleInputChange,
        handleAddItem,
        handleDeleteItem,
        handleSave,
    } = useOrder();

    return (
        <View style={styles.container}>
            <FormField
            label="Select Client"
            value={formState.selectedClient}
            onChangeText={(itemValue) => handleInputChange('selectedClient', itemValue)}
            pickerOptions={clients.map(client => ({
                label: client.name,
                value: client.client_id
            }))}
            placeholder="Select a client"
            />

            <FormField
            label="Select Product"
            value={formState.selectedProduct}
            onChangeText={(itemValue) => handleInputChange('selectedProduct', itemValue)}
            pickerOptions={products.map(product => ({
                label: `${product.name} - ${product.size} - ${product.color} - $${product.price}`,
                value: product.product_id
            }))}
            placeholder="Select a product"
            />

            <FormField
            label="Quantity"
            value={formState.quantity}
            onChangeText={(text) => handleInputChange('quantity', text)}
            placeholder="Enter quantity"
            />

            <TouchableOpacity onPress={handleAddItem} style={styles.button} activeOpacity={0.7}>
            <Text>Add Item</Text>
            </TouchableOpacity>

            {items.length > 0 ? (
            <FlatList
                data={items}
                keyExtractor={(item) => item.product_id.toString()}
                renderItem={({ item }) => (
                <View style={styles.item}>
                    <Text>{item.product_name} {item.product_size}</Text>
                    <Text>{item.quantity} x R${item.price}</Text>
                    <Text>R${(item.quantity * item.price).toFixed(2)}</Text>
                    <TouchableOpacity onPress={() => handleDeleteItem(item.product_id)}>
                    <FontAwesome name="trash" size={24} color="red" />
                    </TouchableOpacity>
                </View>
                )}
            />
            ) : (
            <Text>No items added yet</Text>
            )}

            <Text>Total: R${totalPrice}</Text>
            {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
            ) : (
            <TouchableOpacity onPress={() => handleSave(navigation)} style={styles.button} activeOpacity={0.7}>
                <Text>Save Order</Text>
            </TouchableOpacity>
            )}
            {error && <Text>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    picker: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        padding: 8,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 16,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderBottomWidth: 1,
    },
});

export default OrderDetails;