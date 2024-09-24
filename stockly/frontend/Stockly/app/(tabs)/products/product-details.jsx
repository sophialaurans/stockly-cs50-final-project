import React from "react";
import { ScrollView, Text, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useProduct from "../../../hooks/useProduct";
import FormField from "../../../components/FormField";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";

const ProductDetails = () => {
	const navigation = useNavigation();
	const {
		formState: { name, color, size, dimensions, price, description, quantity },
		handleInputChange,
		handleSave,
		loading,
		error,
	} = useProduct();

	return (
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
					value={price}
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
					value={quantity}
					onChangeText={(text) => handleInputChange("quantity", text)}
					keyboardType="numeric"
				/>
				<TouchableOpacity style={globalStyles.submitButton} onPress={() => handleSave(navigation)}>
					<Text style={globalStyles.submitButtonText}>Save Product</Text>
				</TouchableOpacity>
				{loading && <ActivityIndicator size="large" color={colors.primary} />}
				{error && <Text>{error}</Text>}
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default ProductDetails;
