import { Stack, useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "../../../constants/colors";
import { useTranslation } from "react-i18next";

/* Stack layout for the product-related screens */
export default function ProductsLayout() {
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
					title: t("Products"),
					headerShadowVisible: false, // Hide the stack header because the tab header is already visible on this screen
					headerTintColor: "white", // Set the header text color to white
					headerRight: () => (
						// Button to navigate to profile screeen
						<TouchableOpacity onPress={() => navigation.navigate("profile")} style={{ marginRight: 10 }}>
							<FontAwesome name="user" size={24} color="white" />
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="register-product"
				options={{
					title: t("New Product"),
					headerTintColor: "white",
				}}
			/>
			<Stack.Screen
				name="product-details"
				options={{
					title: t("Details"),
					headerTintColor: "white",
				}}
			/>
		</Stack>
	);
}
