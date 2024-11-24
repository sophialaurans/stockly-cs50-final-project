import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, Switch } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import config from "../../constants/config";
import { TextInput } from "react-native-paper";
import { authStyles } from "./styles";
import colors from "../../constants/colors";
import { useIntl } from "react-intl";
import { LanguageProvider } from "../IntlManager";

const LoginScreen = () => {
	const intl = useIntl();

	const navigation = useNavigation();
	const [errorMessage, setErrorMessage] = useState(""); // State to store error messages

	// State to manage the form input values
	const [formState, setFormState] = useState({
		email: "",
		password: "",
	});

	// Function to handle input changes and update state
	const handleInputChange = (key, value) => {
		setFormState((prevState) => ({
			...prevState,
			[key]: value,
		}));
	};

	// Function to handle login
	const handleLogin = async () => {
		const { email, password } = formState;

		if (!email || !password) {
			// Check if fields are filled
			setErrorMessage(intl.formatMessage({ id: "Missing email or password" }));
			return;
		}

		try {
			// Send POST request to login API
			const response = await axios.post(
				`${config.apiUrl}/login`,
				{ email, password },
				{ headers: { "Content-Type": "application/json" } }
			);

			// Check if login was successful
			if (response.status === 200) {
				const { access_token } = response.data;
				await AsyncStorage.setItem("access_token", access_token);
				navigation.replace("(tabs)");
			} else {
				setErrorMessage(response.data.message || intl.formatMessage({ id: "An error occurred" }));
				Alert.alert(intl.formatMessage({ id: "Error" }), errorMessage);
			}
		} catch (error) {
			// Handle network and API response errors
			const errorMessageError = error.response
				? error.response.data.message
				: intl.formatMessage({ id: "An unexpected error occurred" });
			if (errorMessageError === "Incorrect email or password") {
				setErrorMessage(intl.formatMessage({ id: "Incorrect email or password" }));
			} else {
				setErrorMessage(errorMessageError);
				Alert.alert(intl.formatMessage({ id: "Error" }), errorMessage);
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
				label="Email"
				mode="outlined"
				value={formState.email}
				onChangeText={(text) => handleInputChange("email", text)}
				keyboardType="email-address"
			/>
			<TextInput
				style={authStyles.input}
				outlineStyle={authStyles.input}
				outlineColor={colors.lightGrey}
				activeOutlineColor={colors.tertiary}
				label={intl.formatMessage({ id: "Password" })}
				mode="outlined"
				value={formState.password}
				onChangeText={(text) => handleInputChange("password", text)}
				secureTextEntry
			/>

			{/* Display error message if exists */}
			{errorMessage ? (
				<View style={authStyles.errorContainer}>
					<Text style={authStyles.error}>{errorMessage}</Text>
				</View>
			) : null}

			<TouchableOpacity style={authStyles.authButton} onPress={handleLogin}>
				<Text style={authStyles.authButtonText}>LOGIN</Text>
			</TouchableOpacity>

			{/* Link to sign up if not registered yet*/}
			<TouchableOpacity
				style={authStyles.singButton}
				onPress={() => {
					navigation.navigate("register"); // Navigate to register screen
				}}>
				<Text>{intl.formatMessage({ id: "Not registered yet" })}</Text>
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

export default function LoginScreenWrapper() {
	return (
		<LanguageProvider>
			<LoginScreen />
		</LanguageProvider>
	);
}
