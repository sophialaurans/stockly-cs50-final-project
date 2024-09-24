import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StatusBar } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import config from "../../constants/config";
import { TextInput } from "react-native-paper";
import { globalStyles } from "./styles";
import colors from "../../constants/colors";

const LoginScreen = () => {
	const navigation = useNavigation();
	const [errorMessage, setErrorMessage] = useState("");

	const [formState, setFormState] = useState({
		email: "",
		password: "",
	});

	const handleInputChange = (key, value) => {
		setFormState((prevState) => ({
			...prevState,
			[key]: value,
		}));
	};

	const handleLogin = async () => {
		const { email, password } = formState;

		if (!email || !password) {
			setErrorMessage("Missing email or password");
			return;
		}

		try {
			const response = await axios.post(
				`${config.apiUrl}/login`,
				{ email, password },
				{ headers: { "Content-Type": "application/json" } }
			);

			if (response.status === 200) {
				const { access_token } = response.data;
				await AsyncStorage.setItem("access_token", access_token);
				navigation.replace("(tabs)");
			} else {
				setErrorMessage(response.data.message || "An error occurred");
			}
		} catch (error) {
			const errorMessageError = error.response ? error.response.data.message : "An unexpected error occurred";
			setErrorMessage(errorMessageError);
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
					label="Email"
					mode="outlined"
					value={formState.email}
					onChangeText={(text) => handleInputChange("email", text)}
					keyboardType="email-address"
				/>
				<TextInput
					style={globalStyles.input}
					outlineStyle={globalStyles.input}
					outlineColor={colors.lightGrey}
					activeOutlineColor={colors.tertiary}
					label="Password"
					mode="outlined"
					value={formState.password}
					onChangeText={(text) => handleInputChange("password", text)}
					secureTextEntry
				/>
				{errorMessage ? (
					<View style={globalStyles.errorContainer}>
						<Text style={globalStyles.error}>{errorMessage}</Text>
					</View>
				) : null}
				<TouchableOpacity style={globalStyles.authButton} onPress={handleLogin}>
					<Text style={globalStyles.authButtonText}>LOGIN</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={globalStyles.singButton}
					onPress={() => {
						navigation.navigate("register");
					}}>
					<Text>Not registered yet? Sign up here.</Text>
				</TouchableOpacity>
			</ScrollView>
		</>
	);
};

export default LoginScreen;
