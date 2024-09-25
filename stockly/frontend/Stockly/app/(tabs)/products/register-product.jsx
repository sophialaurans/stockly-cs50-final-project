import React from "react";
import { Text, ActivityIndicator, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useProduct from "../../../hooks/useProduct";
import FormField from "../../../components/FormField";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";

const RegisterProduct = () => {
	const navigation = useNavigation();

	// Destructure state and functions from the custom useProduct hook
	const {
		formState: { name, color, size, dimensions, price, description, quantity },
		handleInputChange,
		handleRegister,
		loading,
		error,
	} = useProduct();

	return (
		// Adjust keyboard behavior for iOS/Android when form is active
		<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={globalStyles.container}>
			<ScrollView>
				<FormField label="Product name" value={name} onChangeText={(text) => handleInputChange("name", text)} />
				<FormField label="Size" value={size} onChangeText={(text) => handleInputChange("size", text)} />
				<FormField label="Color" value={color} onChangeText={(text) => handleInputChange("color", text)} />
				<FormField
					label="Dimensions"
					value={dimensions}
					onChangeText={(text) => handleInputChange("dimensions", text)}
				/>
				<FormField
					label="Price"
					value={price}
					onChangeText={(text) => handleInputChange("price", text)}
					keyboardType="numeric"
				/>
				<FormField
					label="Description"
					value={description}
					onChangeText={(text) => handleInputChange("description", text)}
				/>
				<FormField
					label="Quantity in Stock"
					value={quantity}
					onChangeText={(text) => handleInputChange("quantity", text)}
					keyboardType="numeric"
				/>

				<TouchableOpacity style={globalStyles.submitButton} onPress={() => handleRegister(navigation)}>
					<Text style={globalStyles.submitButtonText}>Add Product</Text>
				</TouchableOpacity>

				{/* Show a loading spinner while save is in progress */}
				{loading && <ActivityIndicator size="large" color={colors.primary} />}

				{/* Display an error message if there's an error */}
				{error && <Text>{error}</Text>}
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default RegisterProduct;
