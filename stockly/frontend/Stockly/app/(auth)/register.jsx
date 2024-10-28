import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, Image } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import config from "../../constants/config";
import { TextInput } from "react-native-paper";
import { authStyles } from "./styles";
import colors from "../../constants/colors";
import { useTranslation } from "react-i18next";

const RegisterScreen = () => {
    const { t } = useTranslation();
	const navigation = useNavigation();

	// State to manage the form input values
	const [formState, setFormState] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	// State to manage error messages
	const [errorMessage, setErrorMessage] = useState(""); // State to store error messages
	const [invalidEmailError, setInvalidEmailError] = useState(""); // State

	// Function to handle input changes and update state
	const handleInputChange = (key, value) => {
		setFormState((prevState) => ({
			...prevState,
			[key]: value,
		}));
	};

	// Function to handle registration logic
	const handleRegister = async () => {
		const { name, email, password, confirmPassword } = formState;

		// Check if passwords match
		if (password !== confirmPassword) {
			setErrorMessage(t("Passwords do not match"));
			return;
		}

		// Check for empty fields
		if (!name || !email || !password || !confirmPassword) {
			setErrorMessage(t("All fields are required"));
			return;
		}

		// Attempt to register the user
		try {
			const response = await axios.post(
				`${config.apiUrl}/register`,
				{ name, email, password, confirm_password: confirmPassword },
				{ headers: { "Content-Type": "application/json" } }
			);

			// Handle different response statuses
			if (response.status === 201) {
				Alert.alert(t("Success"), t("Registration successful"));
				navigation.replace("(auth)");
			} else if (response.status === 400) {
				setErrorMessage(t("Error:"), response.data.message);
			} else {
				Alert.alert(t("Error:"), t("Unexpected response status"));
			}
		} catch (error) {
			// Handle specific error responses
			if (error.response && error.response.status === 400) {
				setInvalidEmailError(error.response.data.message);
				console.log(t("Error:"), error.response.data.message || "Bad Request");
			} else {
				console.log(t("Error:"), t("An unexpected error occurred"));
			}
		}
	};

	return (
		<ScrollView contentContainerStyle={authStyles.contentContainer}>
			<Image style={authStyles.logo} source={require("../../assets/images/stockly-logo.png")} />
			<TextInput
				style={authStyles.input}
				outlineStyle={authStyles.input}
				outlineColor={colors.lightGrey}
				activeOutlineColor={colors.tertiary}
				label={t("Name")}
				mode="outlined"
				value={formState.name}
				onChangeText={(text) => handleInputChange("name", text)}
			/>
			<TextInput
				style={authStyles.input}
				outlineStyle={authStyles.input}
				outlineColor={colors.lightGrey}
				activeOutlineColor={colors.tertiary}
				label="Email"
				mode="outlined"
				value={formState.email}
				onChangeText={(text) => handleInputChange("email", text)}
				keyboardType="email-address"
			/>

			{/* Display invalid email error if exists */}
			{invalidEmailError ? (
				<View style={authStyles.errorContainer}>
					<Text style={authStyles.error}>{invalidEmailError}</Text>
				</View>
			) : null}

			<TextInput
				style={authStyles.input}
				outlineStyle={authStyles.input}
				outlineColor={colors.lightGrey}
				activeOutlineColor={colors.tertiary}
				label={t("Create a password")}
				mode="outlined"
				secureTextEntry
				value={formState.password}
				onChangeText={(text) => handleInputChange("password", text)}
			/>
			<TextInput
				style={authStyles.input}
				outlineStyle={authStyles.input}
				outlineColor={colors.lightGrey}
				activeOutlineColor={colors.tertiary}
				label={t("Confirm your password")}
				mode="outlined"
				secureTextEntry
				value={formState.confirmPassword}
				onChangeText={(text) => handleInputChange("confirmPassword", text)}
			/>

			{/* Display general error message if exists */}
			{errorMessage ? (
				<View style={authStyles.errorContainer}>
					<Text style={authStyles.error}>{errorMessage}</Text>
				</View>
			) : null}

			<TouchableOpacity style={authStyles.authButton} onPress={handleRegister}>
				<Text style={authStyles.authButtonText}>{t("REGISTER")}</Text>
			</TouchableOpacity>

			{/* Link to sign in if already registered */}
			<TouchableOpacity
				style={authStyles.singButton}
				onPress={() => {
					navigation.navigate("login");
				}}>
				<Text>{t("Already registerd")}</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

export default RegisterScreen;
