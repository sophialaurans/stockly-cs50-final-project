import { StyleSheet } from "react-native";
import colors from "../../constants/colors";

// Define styles for the authentication screens using React Native's StyleSheet
export const authStyles = StyleSheet.create({
	// Style for the main content container
	contentContainer: {
		flex: 1,
		paddingHorizontal: 20,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background,
	},
	// Style for the logo image
	logo: {
		width: "80%",
		height: 200,
		resizeMode: "contain",
	},
	// Style for input fields
	input: {
		width: "100%",
		height: 50,
		backgroundColor: colors.lightGrey,
		borderRadius: 8,
	},
	// Style for error message containers
	errorContainer: {
		textAlign: "left",
		width: "100%",
	},
	// Style for error text
	error: {
		color: "red",
	},
	// Style for authentication buttons
	authButton: {
		width: "40%",
		height: 40,
		backgroundColor: colors.secondary,
		borderRadius: 8,
		marginTop: 30,
		alignItems: "center",
		justifyContent: "center",
	},
	// Style for authentication buttons text
	authButtonText: {
		color: "white",
		textAlign: "center",
		fontWeight: "bold",
	},
	// Style for sign-in and sign-up navigation buttons
	singButton: {
		marginTop: 50,
	},
    // Style for language Switch
    languageSwitch: {
        marginTop: "10%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    languageText: {
        fontSize: 14,
        marginHorizontal: 5,
    },
    activeLanguage: {
        color: colors.secondary,
    },
    inactiveLanguage: {
        color: colors.grey,
    },
});
