import { StyleSheet } from "react-native";
import colors from "../../constants/colors";

export const globalStyles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		paddingHorizontal: 20,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background,
	},
	logo: {
		width: "80%",
		height: 200,
		resizeMode: "contain",
	},
	input: {
		width: "100%",
		height: 50,
		backgroundColor: colors.lightGrey,
		borderRadius: 8,
	},
	errorContainer: {
		textAlign: "left",
		width: "100%",
	},
	error: {
		color: "red",
	},
	authButton: {
		width: "40%",
		height: 40,
		backgroundColor: colors.secondary,
		borderRadius: 8,
		marginTop: 30,
		alignItems: "center",
		justifyContent: "center",
	},
	authButtonText: {
		color: "white",
		textAlign: "center",
		fontWeight: "bold",
	},
	singButton: {
		marginTop: 50,
	},
});
