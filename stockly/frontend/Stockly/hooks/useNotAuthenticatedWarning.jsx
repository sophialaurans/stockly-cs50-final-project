import { useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

// Custom hook to handle not authenticated warning
const useNotAuthenticatedWarning = () => {
	const { t } = useTranslation();
	const navigation = useNavigation();

	// Function to show alert when the user is not authenticated and redirect to authentication screen
	const notAuthenticated = () => {
		Alert.alert(t("Disconnected"), t("Your account has been disconnected"));
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
