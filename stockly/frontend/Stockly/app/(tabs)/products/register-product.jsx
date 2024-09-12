import React from "react";
import {
	View,
	Text,
	ActivityIndicator,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useProduct from "../../../hooks/useProduct";
import FormField from "../../../components/FormField";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";

const RegisterProduct = () => {
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
		handleRegister,
		loading,
		error,
	} = useProduct();

	return (
		<ScrollView contentContainerStyle={globalStyles.container}>
			<FormField
				label="Product name"
				value={name}
				onChangeText={(text) => handleInputChange("name", text)}
			/>
			<FormField
				label="Size"
				value={size}
				onChangeText={(text) => handleInputChange("size", text)}
			/>
			<FormField
				label="Color"
				value={color}
				onChangeText={(text) => handleInputChange("color", text)}
			/>
			<FormField
				label="Dimensions"
				value={dimensions}
				onChangeText={(text) => handleInputChange("dimensions", text)}
			/>
			<FormField
				label="Price"
				value={price}
				onChangeText={(text) => handleInputChange("price", text)}
			/>
			<FormField
				label="Description"
				value={description}
				onChangeText={(text) => handleInputChange("description", text)}
			/>
			<FormField
				label="Quantity"
				value={quantity}
				onChangeText={(text) => handleInputChange("quantity", text)}
			/>
			<TouchableOpacity
				style={globalStyles.submitButton}
				onPress={() => handleRegister(navigation)}
			>
				<Text style={globalStyles.submitButtonText}>Add Product</Text>
			</TouchableOpacity>
			{loading && (
				<ActivityIndicator size="large" color={colors.primary} />
			)}
			{error && <Text>{error}</Text>}
		</ScrollView>
	);
};

export default RegisterProduct;
