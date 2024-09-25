import React from "react";
import { ScrollView, Text, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useProduct from "../../../hooks/useProduct";
import FormField from "../../../components/FormField";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";

const ProductDetails = () => {
	const navigation = useNavigation();

	// Destructure state and functions from the custom useProduct hook
	const {
		formState: { name, color, size, dimensions, price, description, quantity },
		handleInputChange,
		handleSave,
		loading,
		error,
	} = useProduct();

	return (
		// Adjust keyboard behavior for iOS/Android when form is active
		<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={globalStyles.container}>
			<ScrollView>
				<FormField
					placeholder="Name"
					label="Name"
					value={name}
					onChangeText={(text) => handleInputChange("name", text)}
				/>
				<FormField
					placeholder="Size"
					label="Size"
					value={size}
					onChangeText={(text) => handleInputChange("size", text)}
				/>
				<FormField
					placeholder="Color"
					label="Color"
					value={color}
					onChangeText={(text) => handleInputChange("color", text)}
				/>
				<FormField
					placeholder="Dimensions"
					label="Dimensions"
					value={dimensions}
					onChangeText={(text) => handleInputChange("dimensions", text)}
				/>
				<FormField
					placeholder="Price"
					label="Price"
					value={price.toString()}
					onChangeText={(text) => handleInputChange("price", text)}
					keyboardType="numeric"
				/>
				<FormField
					placeholder="Description"
					label="Description"
					value={description}
					onChangeText={(text) => handleInputChange("description", text)}
				/>
				<FormField
					placeholder="Quantity in Stock"
					label="Quantity in Stock"
					value={quantity.toString()}
					onChangeText={(text) => handleInputChange("quantity", text)}
				/>

				<TouchableOpacity style={globalStyles.submitButton} onPress={() => handleSave(navigation)}>
					<Text style={globalStyles.submitButtonText}>Save Product</Text>
				</TouchableOpacity>

				{/* Show a loading spinner while save is in progress */}
				{loading && <ActivityIndicator size="large" color={colors.primary} />}

				{/* Display an error message if there's an error */}
				{error && <Text>{error}</Text>}
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default ProductDetails;
