import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, Image, Switch } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import config from "../../constants/config";
import { TextInput } from "react-native-paper";
import { authStyles } from "./styles";
import colors from "../../constants/colors";
import { LanguageProvider } from "../IntlManager";
import { useIntl } from "react-intl";

const RegisterScreen = () => {
    const intl = useIntl();

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
			setErrorMessage(intl.formatMessage({ id: "Passwords do not match"}));
			return;
		}

		// Check for empty fields
		if (!name || !email || !password || !confirmPassword) {
			setErrorMessage(intl.formatMessage({ id: "All fields are required"}));
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
				Alert.alert(intl.formatMessage({ id: "Success"}), intl.formatMessage({ id: "Registration successful"}));
				navigation.replace("(auth)");
			} else if (response.status === 400) {
				setErrorMessage(intl.formatMessage({ id: "Error:"}), response.data.message);
			} else {
				Alert.alert(intl.formatMessage({ id: "Error:"}), intl.formatMessage({ id: "Unexpected response status"}));
			}
		} catch (error) {
			// Handle specific error responses
			if (error.response && error.response.status === 400) {
				setInvalidEmailError(error.response.data.message);
				console.log(intl.formatMessage({ id: "Error:"}), error.response.data.message || "Bad Request");
			} else {
				console.log(intl.formatMessage({ id: "Error:"}), intl.formatMessage({ id: "An unexpected error occurred"}));
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
                label={intl.formatMessage({ id: "Name"})}
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
                label={intl.formatMessage({ id: "Create a password"})}
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
                label={intl.formatMessage({ id: "Confirm your password"})}
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
                <Text style={authStyles.authButtonText}>{intl.formatMessage({ id: "REGISTER"})}</Text>
            </TouchableOpacity>

            {/* Link to sign in if already registered */}
            <TouchableOpacity
                style={authStyles.singButton}
                onPress={() => {
                    navigation.navigate("login");
                }}>
                <Text>{intl.formatMessage({ id: "Already registerd"})}</Text>
            </TouchableOpacity>

            {/*<View style={authStyles.languageSwitch}>
				<Text
					style={[
						authStyles.languageText,
						locale === "en" ? authStyles.activeLanguage : authStyles.inactiveLanguage,
					]}>
					English
				</Text>
				<Switch
					value={locale === "pt"}
					onValueChange={(value) => switchLanguage(value ? "pt" : "en")}
					thumbColor={locale === "en" ? colors.primary : colors.primary}
					trackColor={{ false: colors.secondary, true: colors.secondary }}
				/>
				<Text
					style={[
						authStyles.languageText,
						locale === "pt" ? authStyles.activeLanguage : authStyles.inactiveLanguage,
					]}>
					Português
				</Text>
			</View>*/}

        </ScrollView>
	);
};

export default function RegisterScreenWrapper() {
    return (
        <LanguageProvider>
            <RegisterScreen />
        </LanguageProvider>
    );
}