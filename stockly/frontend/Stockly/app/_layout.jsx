import { Stack, useNavigation } from "expo-router";
import colors from "../constants/colors";

export default function AppLayout() {
	const navigation = useNavigation();
	return (
		<Stack
			screenOptions={{
				statusBarStyle: "light",
				statusBarColor: colors.primary,
			}}>
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="(auth)"
				options={{
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
