import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, Image, StatusBar } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import config from "../../constants/config";
import { TextInput } from "react-native-paper";
import { globalStyles } from "./styles";
import colors from "../../constants/colors";

const RegisterScreen = () => {
	const navigation = useNavigation();

	const [formState, setFormState] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [errorMessage, setErrorMessage] = useState("");
	const [invalidEmailError, setInvalidEmailError] = useState("");

	const handleInputChange = (key, value) => {
		setFormState((prevState) => ({
			...prevState,
			[key]: value,
		}));
	};

	const handleRegister = async () => {
		const { name, email, password, confirmPassword } = formState;

		if (password !== confirmPassword) {
			setErrorMessage("Passwords do not match");
			return;
		}

		if (!name || !email || !password || !confirmPassword) {
			setErrorMessage("All fields are required");
			return;
		}

		try {
			const response = await axios.post(
				`${config.apiUrl}/register`,
				{ name, email, password, confirm_password: confirmPassword },
				{ headers: { "Content-Type": "application/json" } }
			);

			if (response.status === 201) {
				navigation.replace("(auth)");
			} else if (response.status === 400) {
				setErrorMessage("Error:", response.data.message);
			} else {
				Alert.alert("Error", "Unexpected response status, please try again");
			}
		} catch (error) {
			if (error.response && error.response.status === 400) {
				setInvalidEmailError(error.response.data.message);
				console.log("Error", error.response.data.message || "Bad Request");
			} else {
				console.log("Error", "An unexpected error occurred");
			}
		}
	};

	return (
		<>
			<StatusBar barStyle="dark-content" backgroundColor="transparent" />
			<ScrollView contentContainerStyle={globalStyles.contentContainer}>
				<Image style={globalStyles.logo} source={require("../../assets/images/stockly-logo.png")} />
				<TextInput
					style={globalStyles.input}
					outlineStyle={globalStyles.input}
					outlineColor={colors.lightGrey}
					activeOutlineColor={colors.tertiary}
					label="Name"
					mode="outlined"
					value={formState.name}
					onChangeText={(text) => handleInputChange("name", text)}
				/>
				<TextInput
					style={globalStyles.input}
					outlineStyle={globalStyles.input}
					outlineColor={colors.lightGrey}
					activeOutlineColor={colors.tertiary}
					label="Email"
					mode="outlined"
					value={formState.email}
					onChangeText={(text) => handleInputChange("email", text)}
					keyboardType="email-address"
				/>
				{invalidEmailError ? <Text style={globalStyles.error}>{invalidEmailError}</Text> : null}
				<TextInput
					style={globalStyles.input}
					outlineStyle={globalStyles.input}
					outlineColor={colors.lightGrey}
					activeOutlineColor={colors.tertiary}
					label="Create a password"
					mode="outlined"
					secureTextEntry
					value={formState.password}
					onChangeText={(text) => handleInputChange("password", text)}
				/>
				<TextInput
					style={globalStyles.input}
					outlineStyle={globalStyles.input}
					outlineColor={colors.lightGrey}
					activeOutlineColor={colors.tertiary}
					label="Confirm your password"
					mode="outlined"
					secureTextEntry
					value={formState.confirmPassword}
					onChangeText={(text) => handleInputChange("confirmPassword", text)}
				/>
				{errorMessage ? (
					<View style={globalStyles.errorContainer}>
						<Text style={globalStyles.error}>{errorMessage}</Text>
					</View>
				) : null}
				<TouchableOpacity style={globalStyles.authButton} onPress={handleRegister}>
					<Text style={globalStyles.authButtonText}>REGISTER</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={globalStyles.singButton}
					onPress={() => {
						navigation.navigate("login");
					}}>
					<Text>Already registerd? Sign in here.</Text>
				</TouchableOpacity>
			</ScrollView>
		</>
	);
};

export default RegisterScreen;
