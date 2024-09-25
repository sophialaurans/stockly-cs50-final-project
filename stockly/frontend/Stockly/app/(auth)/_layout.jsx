import { Stack } from "expo-router";
import colors from "../../constants/colors";

// Stack layout for the authentication screens
export default function AuthLayout() {
	return (
		<Stack
			screenOptions={{
				statusBarStyle: "dark", // Set the status bar text color to dark
				statusBarColor: colors.background, // Set the status bar background color to match the app's background
			}}>
			<Stack.Screen
				name="login"
				options={{
					headerShown: false, // Hide the stack header
				}}
			/>
			<Stack.Screen
				name="register"
				options={{
					headerShown: false, // Hide the stack header
				}}
			/>
		</Stack>
	);
}
