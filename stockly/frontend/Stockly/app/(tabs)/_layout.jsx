import { TouchableOpacity, ActivityIndicator } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, router } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../../constants/colors";
import useAuthenticatedFetch from "../../hooks/useAuthenticatedFetch";
import { useTranslation } from 'react-i18next';

/* Tab layout for the main screens */
export default function TabLayout() {
    const { t } = useTranslation();
    
    // Prevent the tab from showing before the page is fully loaded
	const { loading } = useAuthenticatedFetch("");
    if (loading) {
		return <ActivityIndicator size="large" color={colors.primary} />;
	}

	return (
		<Tabs
			screenOptions={{
				headerStyle: {
					backgroundColor: colors.primary, // Set stack header color to the app's primary color
				},
				// Set the tab bar style with app's primary color and no shadow
				tabBarStyle: {
					backgroundColor: colors.primary,
					paddingTop: 10,
					paddingBottom: 10,
					height: 70,
					elevation: 0,
					shadowOpacity: 0,
					borderTopWidth: 0,
				},
				tabBarActiveTintColor: "white", // Set the tab icon color to white when is active
				tabBarInactiveTintColor: colors.grey, // Set the tab icon color to grey when is not active
				tabBarHideOnKeyboard: true, // Hide tab bar when keyboard is visible
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: "Dashboard",
					headerShadowVisible: false, // Hide the tab header shadow
					headerTintColor: "white", // Set the header text color to white
					headerRight: () => (
						// Button to navigate to profile screeen
						<TouchableOpacity onPress={() => router.navigate("/profile")} style={{ marginRight: 25 }}>
							<FontAwesome name="user" size={24} color="white" />
						</TouchableOpacity>
					),
					tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="products"
				options={{
					title: t("Products"),
					headerShown: false, // Hide the tab header because the screen's local stack header is already visible
					tabBarIcon: ({ color }) => <FontAwesome5 name="box-open" size={24} color={color} />,
				}}
				listeners={{
					tabPress: () => {
						router.replace("/products"); // Navigate to products index sreeen
					},
				}}
			/>
			<Tabs.Screen
				name="orders"
				options={{
					title: t("Orders"),
					headerShown: false, // Hide the tab header because the screen's local stack header is already visible
					tabBarIcon: ({ color }) => <Ionicons name="receipt" size={24} color={color} />,
				}}
				listeners={{
					tabPress: () => {
						router.replace("/orders"); // Navigate to orders index sreeen
					},
				}}
			/>
			<Tabs.Screen
				name="clients"
				options={{
					title: t("Clients"),
					headerShown: false, // Hide the tab header because the screen's local stack header is already visible
					tabBarIcon: ({ color }) => <FontAwesome size={28} name="address-book" color={color} />,
				}}
				listeners={{
					tabPress: () => {
						router.replace("/clients"); // Navigate to clients index sreeen
					},
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: t("Profile"),
					headerTintColor: "white",
					tabBarButton: () => null, // Hide the profile button from the tab bar
				}}
			/>
		</Tabs>
	);
}
