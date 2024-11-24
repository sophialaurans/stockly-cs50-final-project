import { useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIntl } from "react-intl";

// Custom hook to handle not authenticated warning
const useNotAuthenticatedWarning = () => {
	const intl = useIntl();
	const navigation = useNavigation();

	// Function to show alert when the user is not authenticated and redirect to authentication screen
	const notAuthenticated = () => {
		Alert.alert(intl.formatMessage({ id: "Disconnected"}), intl.formatMessage({ id: "Your account has been disconnected"}));
		navigation.replace("(auth)");
        return;
	};

	// Function to check if the user is authenticated
	const checkAuthentication = async () => {
		try {
			const token = await AsyncStorage.getItem("access_token");
			if (!token) {
				notAuthenticated();
			}
		} catch (error) {
			notAuthenticated();
		}
	};

	// Effect to check authentication status on component mount
	useEffect(() => {
		checkAuthentication();
	}, []);

	// Return functions for potential use in components
	return {
		notAuthenticated,
		checkAuthentication,
	};
};

export default useNotAuthenticatedWarning;
