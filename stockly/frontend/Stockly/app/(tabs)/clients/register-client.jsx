import React from "react";
import { ScrollView, Text, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useClient from "../../../hooks/useClient";
import FormField from "../../../components/FormField";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";
import { useTranslation } from 'react-i18next';

const RegisterClient = () => {
    const { t } = useTranslation();

	const navigation = useNavigation();

	// Destructure state and functions from the custom useClient hook
	const {
		formState: { name, phone_number, email },
		handleInputChange,
		handleRegister,
		loading,
		error,
	} = useClient();

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
					label={t("Phone number")}
					value={phone_number}
					onChangeText={(text) => handleInputChange("phone_number", text)}
				/>
				<FormField
					label="Email"
					value={email}
					onChangeText={(text) => handleInputChange("email", text)}
				    keyboardType="email-address"
				/>
				<TouchableOpacity style={globalStyles.submitButton} onPress={() => handleRegister(navigation)}>
					<Text style={globalStyles.submitButtonText}>{t("Add New Client")}</Text>
				</TouchableOpacity>

				{/* Show a loading spinner while save is in progress */}
				{loading && <ActivityIndicator size="large" color={colors.primary} />}
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default RegisterClient;
