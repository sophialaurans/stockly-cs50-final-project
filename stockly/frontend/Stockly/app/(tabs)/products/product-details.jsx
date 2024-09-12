import React from "react";
import {
	ScrollView,
	Text,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useProduct from "../../../hooks/useProduct";
import FormField from "../../../components/FormField";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";

const ProductDetails = () => {
	const navigation = useNavigation();
	const {
		formState: {
			name,
			color,
			size,
			dimensions,
			price,
			description,
			quantity,
		},
		handleInputChange,
		handleSave,
		loading,
		error,
	} = useProduct();

	return (
		<ScrollView contentContainerStyle={globalStyles.container}>
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
			/>
			<FormField
				placeholder="Description"
				label="Description"
				value={description}
				onChangeText={(text) => handleInputChange("description", text)}
			/>
			<FormField
				placeholder="Quantity"
				label="Quantity"
				value={quantity}
				onChangeText={(text) => handleInputChange("quantity", text)}
			/>
			<TouchableOpacity
				style={globalStyles.submitButton}
				onPress={() => handleSave(navigation)}
			>
				<Text style={globalStyles.submitButtonText}>Save Product</Text>
			</TouchableOpacity>
			{loading && (
				<ActivityIndicator size="large" color={colors.primary} />
			)}
			{error && <Text>{error}</Text>}
		</ScrollView>
	);
};

export default ProductDetails;
