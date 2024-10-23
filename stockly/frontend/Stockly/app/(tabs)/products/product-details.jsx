import React from "react";
import { ScrollView, Text, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useProduct from "../../../hooks/useProduct";
import FormField from "../../../components/FormField";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";
import { useTranslation } from 'react-i18next';

const ProductDetails = () => {
    const { t } = useTranslation();
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
					label={t("Name")}
					value={name}
					onChangeText={(text) => handleInputChange("name", text)}
				/>
				<FormField
					label={t("Size")}
					value={size}
					onChangeText={(text) => handleInputChange("size", text)}
				/>
				<FormField
					label={t("Color")}
					value={color}
					onChangeText={(text) => handleInputChange("color", text)}
				/>
				<FormField
					label={t("Dimensions")}
					value={dimensions}
					onChangeText={(text) => handleInputChange("dimensions", text)}
				/>
				<FormField
					label={t("Price")}
					value={price.toString()}
					onChangeText={(text) => handleInputChange("price", text)}
					keyboardType="numeric"
				/>
				<FormField
					label={t("Description")}
					value={description}
					onChangeText={(text) => handleInputChange("description", text)}
				/>
				<FormField
					label={t("Quantity in Stock")}
					value={quantity.toString()}
					onChangeText={(text) => handleInputChange("quantity", text)}
				/>

				<TouchableOpacity style={globalStyles.submitButton} onPress={() => handleSave(navigation)}>
					<Text style={globalStyles.submitButtonText}>{t("Save Product")}</Text>
				</TouchableOpacity>

				{/* Show a loading spinner while save is in progress */}
				{loading && <ActivityIndicator size="large" color={colors.primary} />}
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default ProductDetails;
