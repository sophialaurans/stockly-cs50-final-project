import { Stack, useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "../../../constants/colors";
import { useTranslation } from "react-i18next";

/* Stack layout for the client-related screens */
export default function ClientsLayout() {
    const { t } = useTranslation();
	const navigation = useNavigation();
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: colors.primary, // Set stack header color to the app's primary color
				},
				statusBarStyle: "light", // Set the status bar text color to light
				statusBarColor: colors.primary, // Set the status bar background color to match the header color
			}}>
			<Stack.Screen
				name="index"
				options={{
					title: t("Clients"),
					headerTintColor: "white", // Set the header text color to white
					headerShadowVisible: false, // Hide the stack header because the tab header is already visible on this screen
					headerRight: () => (
						// Button to navigate to profile screeen
						<TouchableOpacity onPress={() => navigation.navigate("profile")} style={{ marginRight: 10 }}>
							<FontAwesome name="user" size={24} color="white" />
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="register-client"
				options={{
					title: t("New Client"),
					headerTintColor: "white",
				}}
			/>
			<Stack.Screen
				name="client-details"
				options={{
					title: t("Details"),
					headerTintColor: "white",
				}}
			/>
		</Stack>
	);
}
