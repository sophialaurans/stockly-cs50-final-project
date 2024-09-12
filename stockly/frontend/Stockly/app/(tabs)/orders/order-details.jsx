import React from "react";
import {
	View,
	Text,
	FlatList,
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
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
		handleSave,
	} = useOrder();

	return (
		<View style={styles.container}>
			<View style={globalStyles.picker}>
				<FormField
					label="Select Client"
					value={formState.selectedClient}
					onChangeText={(itemValue) =>
						handleInputChange("selectedClient", itemValue)
					}
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
					onChangeText={(itemValue) =>
						handleInputChange("selectedProduct", itemValue)
					}
					pickerOptions={products.map((product) => ({
						label: `${product.name} - ${product.size} - ${product.color} - $${product.price}`,
						value: product.product_id,
					}))}
					placeholder="Select a product"
				/>
			</View>
			<FormField
				label="Quantity"
				value={formState.quantity}
				onChangeText={(text) => handleInputChange("quantity", text)}
				placeholder="Enter quantity"
			/>
			<View style={styles.addItemButtonContainer}>
				<TouchableOpacity
					style={styles.addItemButton}
					onPress={handleAddItem}
					activeOpacity={0.7}
				>
					<Text style={styles.addItemButtonText}>Add Item</Text>
				</TouchableOpacity>
			</View>

			{items.length > 0 ? (
				<FlatList
					data={items}
					keyExtractor={(item) => item.product_id.toString()}
					renderItem={({ item }) => (
						<View style={styles.item}>
							<Text>{item.product_name}</Text>
							{item.product_size ? (
								<Text>{item.product_size}</Text>
							) : null}
							{item.product_color ? (
								<Text>{item.product_color}</Text>
							) : null}
							<Text>
								{item.quantity} x R${item.price.toFixed(2)}
							</Text>
							<Text>R${item.total.toFixed(2)}</Text>
							<TouchableOpacity
								onPress={() =>
									handleDeleteItem(item.product_id)
								}
								style={styles.deleteButton}
							>
								<FontAwesome
									name="trash"
									size={24}
									color={colors.text}
								/>
							</TouchableOpacity>
						</View>
					)}
				/>
			) : (
				<Text>No items added yet</Text>
			)}

			{items.length > 0 ? (
				<View style={styles.totalPrice}>
					<Text style={styles.totalPriceLabel}>Total Price:</Text>
					<Text style={styles.totalPriceValue}>
						R${totalPrice.toFixed(2)}
					</Text>
				</View>
			) : null}

			{loading ? (
				<ActivityIndicator size="large" color={colors.primary} />
			) : (
				<TouchableOpacity
					onPress={() => handleSubmitOrder(navigation)}
					style={globalStyles.submitButton}
				>
					<Text style={globalStyles.submitButtonText}>
						Place Order
					</Text>
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
	item: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 8,
		borderBottomWidth: 1,
	},
});

export default OrderDetails;
