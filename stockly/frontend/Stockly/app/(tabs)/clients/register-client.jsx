import React from "react";
import { ScrollView, Text, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useClient from "../../../hooks/useClient";
import FormField from "../../../components/FormField";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";

const RegisterClient = () => {
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
					placeholder="Name"
					label="Name"
					value={name}
					onChangeText={(text) => handleInputChange("name", text)}
				/>
				<FormField
					placeholder="Phone number"
					label="Phone number"
					value={phone_number}
					onChangeText={(text) => handleInputChange("phone_number", text)}
				/>
				<FormField
					placeholder="Email"
					label="Email"
					value={email}
					onChangeText={(text) => handleInputChange("email", text)}
				    keyboardType="email-address"
				/>
				<TouchableOpacity style={globalStyles.submitButton} onPress={() => handleRegister(navigation)}>
					<Text style={globalStyles.submitButtonText}>Add Client</Text>
				</TouchableOpacity>

				{/* Show a loading spinner while save is in progress */}
				{loading && <ActivityIndicator size="large" color={colors.primary} />}

				{/* Display an error message if there's an error */}
				{error && <Text>{error}</Text>}
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default RegisterClient;
