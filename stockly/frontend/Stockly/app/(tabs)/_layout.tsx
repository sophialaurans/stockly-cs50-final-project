import { TouchableOpacity, StatusBar } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useNavigation, useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../../constants/colors";

export default function TabLayout() {
	const navigation = useNavigation();

	return (
		<>
			<StatusBar
				barStyle="light-content"
				backgroundColor={colors.primary}
			/>
			<Tabs
				screenOptions={{
					tabBarStyle: {
						backgroundColor: colors.primary,
						paddingTop: 10,
						paddingBottom: 10,
						height: 70,
					},
					tabBarActiveTintColor: "white",
					tabBarInactiveTintColor: colors.lightGrey,
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: "Dashboard",
						headerStyle: {
							backgroundColor: colors.primary,
						},
						headerTintColor: "white",
						headerRight: () => (
							<TouchableOpacity
								onPress={() => navigation.navigate("profile")}
								style={{ marginRight: 25 }}
							>
								<FontAwesome
									name="user"
									size={24}
									color="white"
								/>
							</TouchableOpacity>
						),
						tabBarIcon: ({ color }) => (
							<MaterialIcons
								name="dashboard"
								size={24}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="products"
					options={{
						title: "Products",
						headerShown: false,
						tabBarIcon: ({ color }) => (
							<FontAwesome5
								name="box-open"
								size={24}
								color={color}
							/>
						),
					}}
					listeners={{
						tabPress: () => {
							navigation.reset({
								index: 0,
								routes: [{ name: "products" }],
							});
						},
					}}
				/>
				<Tabs.Screen
					name="orders"
					options={{
						title: "Orders",
						headerShown: false,
						tabBarIcon: ({ color }) => (
							<Ionicons name="receipt" size={24} color={color} />
						),
					}}
					listeners={{
						tabPress: () => {
							navigation.reset({
								index: 0,
								routes: [{ name: "orders" }],
							});
						},
					}}
				/>
				<Tabs.Screen
					name="clients"
					options={{
						title: "Clients",
						headerShown: false,
						tabBarIcon: ({ color }) => (
							<FontAwesome
								size={28}
								name="address-book"
								color={color}
							/>
						),
					}}
					listeners={{
						tabPress: () => {
							navigation.reset({
								index: 0,
								routes: [{ name: "clients" }],
							});
						},
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: "Profile",
						headerStyle: {
							backgroundColor: colors.primary,
						},
						headerTintColor: "white",
						tabBarButton: () => null,
					}}
				/>
			</Tabs>
		</>
	);
}
