import React from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useOrder from "../../../hooks/useOrder";
import FormField from "../../../components/FormField";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";

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
		handleSaveOrder,
	} = useOrder();

	return (
		<View style={globalStyles.container}>
			<View style={globalStyles.picker}>
				<FormField
					label="Select Client"
					value={formState.selectedClient}
					onChangeText={(itemValue) => handleInputChange("selectedClient", itemValue)}
					pickerOptions={clients.map((client) => ({
						label: client.name,
						value: client.client_id,
					}))}
					placeholder="Select a client"
				/>
			</View>
			<View style={globalStyles.picker}>
				<FormField
					label="Select Product"
					value={formState.selectedProduct}
					onChangeText={(itemValue) => handleInputChange("selectedProduct", itemValue)}
					placeholder="Select a product"
					pickerOptions={products.map((product) => ({
						label: `${product.name} ${product.size ? "- " + product.size : ""} ${
							product.color ? "- " + product.color : ""
						} - $${product.price.toFixed(2)}`,
						value: product.product_id,
					}))}
				/>
			</View>
			<FormField
				label="Quantity"
				value={formState.quantity}
				onChangeText={(text) => handleInputChange("quantity", text)}
				placeholder="Enter quantity"
				keyboardType="numeric"
			/>
			<View style={globalStyles.addItemButtonContainer}>
				<TouchableOpacity style={globalStyles.addItemButton} onPress={handleAddItem} activeOpacity={0.7}>
					<Text style={globalStyles.addItemButtonText}>Add Item</Text>
				</TouchableOpacity>
			</View>

			{items.length > 0 ? (
				<FlatList
					data={items}
					keyExtractor={(item) => item.product_id.toString()}
					renderItem={({ item }) => (
						<View style={globalStyles.item}>
                            <View style={globalStyles.itemDataName}>
                                <Text>{item.product_name}</Text>
                                {item.product_size ? <Text>{item.product_size}</Text> : null}
                                {item.product_color ? <Text>{item.product_color}</Text> : null}
                            </View>
							<Text style={globalStyles.itemData}>
								{item.quantity} x ${item.price.toFixed(2)}
							</Text>
							<Text style={globalStyles.itemData}>${item.total}</Text>
							<TouchableOpacity
								onPress={() => handleDeleteItem(item.product_id)}
								style={globalStyles.deleteButton}>
								<FontAwesome name="trash" size={24} color={colors.text} />
							</TouchableOpacity>
						</View>
					)}
				/>
			) : (
				<Text>No items added yet</Text>
			)}

			{items.length > 0 ? (
				<View style={globalStyles.totalPrice}>
					<Text style={globalStyles.totalPriceLabel}>Total Price:</Text>
					<Text style={globalStyles.totalPriceValue}>${totalPrice.toFixed(2)}</Text>
				</View>
			) : null}

			{loading ? (
				<ActivityIndicator size="large" color={colors.primary} />
			) : (
				<TouchableOpacity onPress={() => handleSaveOrder(navigation)} style={globalStyles.submitButton}>
					<Text style={globalStyles.submitButtonText}>Save Order</Text>
				</TouchableOpacity>
			)}
			{error && <Text>{error}</Text>}
		</View>
	);
};

export default OrderDetails;
