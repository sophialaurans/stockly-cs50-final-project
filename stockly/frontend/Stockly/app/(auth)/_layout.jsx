import { Stack, useNavigation } from "expo-router";
import colors from "../../constants/colors";

export default function AuthLayout() {
	const navigation = useNavigation();
	return (
		<Stack
			screenOptions={{
				statusBarStyle: "dark",
				statusBarColor: colors.background,
			}}>
			<Stack.Screen
				name="login"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="register"
				options={{
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
