import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import colors from "../constants/colors";

const NotFound = () => {
	return (
		<View style={styles.container}>
			{/* Title for the Not Found page */}
			<Text style={styles.title}>404</Text>
			<Text style={styles.subtitle}>Page Not Found</Text>

			{/* Message explaining the error */}
			<Text style={styles.message}>Sorry, the page you are looking for does not exist.</Text>

			{/* Button to navigate back to the dashboard screen */}
			<TouchableOpacity onPress={() => router.navigate("/(tabs)")} style={styles.button}>
				<Text style={styles.buttonText}>GO TO DASHBOARD</Text>
			</TouchableOpacity>
		</View>
	);
};

// Styles for the NotFound screen
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: colors.background,
	},
	title: {
		fontSize: 80,
		fontWeight: "bold",
		color: colors.primary,
	},
	subtitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.primary,
		marginBottom: 20,
	},
	message: {
		fontSize: 16,
		marginBottom: 20,
	},
	button: {
		backgroundColor: colors.secondary,
		padding: 15,
		borderRadius: 8,
		margin: 15,
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
});

export default NotFound;
