import { Stack, useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "../../../constants/colors";

export default function ClientsLayout() {
	const navigation = useNavigation();
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: colors.primary,
				},
				statusBarStyle: "light",
				statusBarColor: colors.primary,
			}}>
			<Stack.Screen
				name="index"
				options={{
					title: "Clients",
					headerTintColor: "white",
					headerShadowVisible: false,
					headerRight: () => (
						<TouchableOpacity onPress={() => navigation.navigate("profile")} style={{ marginRight: 10 }}>
							<FontAwesome name="user" size={24} color="white" />
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="register-client"
				options={{
					title: "New Client",
					headerTintColor: "white",
				}}
			/>
			<Stack.Screen
				name="client-details"
				options={{
					title: "Details",
					headerTintColor: "white",
				}}
			/>
		</Stack>
	);
}
