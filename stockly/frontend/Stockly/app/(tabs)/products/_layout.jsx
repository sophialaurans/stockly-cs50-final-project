import { Stack, useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "../../../constants/colors";

export default function ProductsLayout() {
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
					title: "Products",
					headerShadowVisible: false,
					headerTintColor: "white",
					headerRight: () => (
						<TouchableOpacity onPress={() => navigation.navigate("profile")} style={{ marginRight: 10 }}>
							<FontAwesome name="user" size={24} color="white" />
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="register-product"
				options={{
					title: "New Product",
					headerTintColor: "white",
				}}
			/>
			<Stack.Screen
				name="product-details"
				options={{
					title: "Details",
					headerTintColor: "white",
				}}
			/>
		</Stack>
	);
}
