import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import config from "../../constants/config";
import { TextInput } from "react-native-paper";
import { authStyles } from "./styles";
import colors from "../../constants/colors";

const LoginScreen = () => {
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
			setErrorMessage("Missing email or password");
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
				setErrorMessage(response.data.message || "An error occurred");
			}
		} catch (error) {
			// Handle network and API response errors
			const errorMessageError = error.response ? error.response.data.message : "An unexpected error occurred";
			setErrorMessage(errorMessageError);
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
				label="Password"
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
				<Text>Not registered yet? Sign up here.</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

export default LoginScreen;
