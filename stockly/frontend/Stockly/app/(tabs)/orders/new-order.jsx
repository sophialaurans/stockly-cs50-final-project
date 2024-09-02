import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FormField from '../../../components/FormField';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useOrder from '../../../hooks/useOrder';

const NewOrder = () => {
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
    handleSubmitOrder,
  } = useOrder();

  return (
    <View style={styles.container}>
      <FormField
        label="Select Client"
        value={formState.selectedClient}
        onChangeText={(itemValue) => handleInputChange('selectedClient', itemValue)}
        placeholder="Select a client"
        pickerOptions={clients.map(client => ({ label: client.name, value: client.client_id }))}
      />

      <FormField
        label="Select Product"
        value={formState.selectedProduct}
        onChangeText={(itemValue) => handleInputChange('selectedProduct', itemValue)}
        placeholder="Select a product"
        pickerOptions={products.map(product => ({
          label: `${product.name} - ${product.size} - ${product.color} - $${product.price}`,
          value: product.product_id
        }))}
      />

      <FormField
        label="Quantity"
        value={formState.quantity}
        onChangeText={(text) => handleInputChange('quantity', text)}
        placeholder="Enter quantity"
      />

      <TouchableOpacity onPress={handleAddItem} style={styles.button}>
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
              <Text>R${item.total.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => handleDeleteItem(item.product_id)} style={styles.deleteButton}>
                <FontAwesome name="trash" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>No items added yet.</Text>
      )}

      <Text>Total Price: R${totalPrice.toFixed(2)}</Text>

      <TouchableOpacity onPress={() => handleSubmitOrder(navigation)} style={styles.button}>
        <Text>Place Order</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1
  },
  deleteButton: {
    padding: 5
  }
});

export default NewOrder;
