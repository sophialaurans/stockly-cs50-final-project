import { Stack, useNavigation } from "expo-router";
import colors from "../constants/colors";

/* Stack layout for the main routes */
export default function AppLayout() {
	const navigation = useNavigation();
	return (
		<Stack
			screenOptions={{
				statusBarStyle: "light", // Set the status bar text color to light
				statusBarColor: colors.primary /* Set the status bar background color to the app's primary color. 
                                                    This is primarily for the dashboard screen, since the other screens 
                                                    already have the status bar color defined. */,
			}}>
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: false, // Hide this stack header
				}}
			/>
			<Stack.Screen
				name="(auth)"
				options={{
					headerShown: false, // Hide this stack header
				}}
			/>
			<Stack.Screen
				name="+not-found"
				options={{
					title: "Not Found",
					headerShown: false, // Hide this stack header
				}}
			/>
		</Stack>
	);
}
