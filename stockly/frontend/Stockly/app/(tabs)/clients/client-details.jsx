import React from "react";
import { ScrollView, Text, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useClient from "../../../hooks/useClient";
import FormField from "../../../components/FormField";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";

const ClientDetails = () => {
	const navigation = useNavigation();
	const {
		formState: { name, phone_number, email },
		handleInputChange,
		handleSave,
		loading,
		error,
	} = useClient();

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
				/>
				<TouchableOpacity style={globalStyles.submitButton} onPress={() => handleSave(navigation)}>
					<Text style={globalStyles.submitButtonText}>Save Client</Text>
				</TouchableOpacity>
				{loading && <ActivityIndicator size="large" color={colors.primary} />}
				{error && <Text>{error}</Text>}
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default ClientDetails;
