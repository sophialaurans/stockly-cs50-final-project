import React from "react";
import {
	View,
	Text,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useOrder from "../../../hooks/useOrder";
import FormField from "../../../components/FormField";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";
import { useIntl } from "react-intl";

const OrderDetails = () => {
	const intl = useIntl();
	const navigation = useNavigation();

	// Destructure state and functions from the custom useOrder hook
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
		// Adjust keyboard behavior for iOS/Android when form is active
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={globalStyles.container}>
			<View>
				{/* Form field for selecting a client */}
				<View style={globalStyles.picker}>
					<FormField
						label={intl.formatMessage({ id: "Select Client"})}
						value={formState.selectedClient}
						onChangeText={(itemValue) => handleInputChange("selectedClient", itemValue)}
						pickerOptions={clients.map((client) => ({
							label: client.name,
							value: client.client_id,
						}))}
						placeholder={intl.formatMessage({ id: "Select a client"})}
					/>
				</View>

				{/* Form field for selecting a product */}
				<View style={globalStyles.picker}>
					<FormField
						label={intl.formatMessage({ id: "Select Product"})}
						value={formState.selectedProduct}
						onChangeText={(itemValue) => handleInputChange("selectedProduct", itemValue)}
						placeholder={intl.formatMessage({ id: "Select a product"})}
						pickerOptions={products.map((product) => ({
							label: `${product.name} ${product.size ? "- " + product.size : ""} ${
								product.color ? "- " + product.color : ""
							} - ${intl.formatMessage({ id: "currency.symbol" })}${product.price.toFixed(2)}`,
							value: product.product_id,
						}))}
					/>
				</View>

				{/* Form field for entering quantity */}
				<FormField
					label={intl.formatMessage({ id: "Quantity"})}
					value={formState.quantity}
					onChangeText={(text) => handleInputChange("quantity", text)}
					placeholder={intl.formatMessage({ id: "Enter quantity"})}
					keyboardType="numeric"
				/>

				{/* Button to add item to the order */}
				<View style={globalStyles.addItemButtonContainer}>
					<TouchableOpacity
						style={globalStyles.addItemButton}
						onPress={handleAddItem}
						activeOpacity={0.7}>
						<Text style={globalStyles.addItemButtonText}>{intl.formatMessage({ id: "Add Item"})}</Text>
					</TouchableOpacity>
				</View>

				{/* Display list of added items, or a message if none exist */}
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
									{item.quantity} x {intl.formatMessage({ id: "currency.symbol" })}{item.price.toFixed(2)}
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
					<Text>{intl.formatMessage({ id: "No items added yet"})}</Text>
				)}

				{/* Display total price if items are added */}
				{items.length > 0 ? (
					<View style={globalStyles.totalPrice}>
						<Text style={globalStyles.totalPriceLabel}>{intl.formatMessage({ id: "Total Price"})}</Text>
						<Text style={globalStyles.totalPriceValue}>{intl.formatMessage({ id: "currency.symbol" })}{totalPrice.toFixed(2)}</Text>
					</View>
				) : null}

				{/* Show loading indicator while submitting the order */}
				{loading ? (
					<ActivityIndicator size="large" color={colors.primary} />
				) : (
					<TouchableOpacity
						onPress={() => handleSaveOrder(navigation)}
						style={globalStyles.submitButton}>
						<Text style={globalStyles.submitButtonText}>{intl.formatMessage({ id: "Save Order"})}</Text>
					</TouchableOpacity>
				)}
			</View>
		</KeyboardAvoidingView>
	);
};

export default OrderDetails;
