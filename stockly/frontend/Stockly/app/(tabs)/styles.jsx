import { StyleSheet } from "react-native";
import colors from "../../constants/colors";

export const globalStyles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: colors.background,
	},
	flatlistItem: {
		flex: 1,
		alignSelf: "center",
		padding: 10,
		marginBottom: 10,
		backgroundColor: colors.lightGrey,
		width: "95%",
		shadowColor: colors.black,
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2,
		borderRadius: 6,
	},
	orderHeaderContainer: {
		flex: 1,
	},
	flatlistItemContent: {
		flexDirection: "row",
		flexWrap: "nowrap",
		justifyContent: "space-between",
		flex: 5,
	},
	orderItemsContainer: {
		flex: 1,
	},
	flatlistItemData: {
		flex: 1,
	},
	flatlistItemDetails: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	flatlistItemDetailsLabel: {
		fontWeight: "bold",
	},
	flatlistItemDetailsValue: {},
	flatlistItemButtons: {
		justifyContent: "center",
		flexDirection: "column",
		gap: 10,
		alignItems: "center",
	},
	fabStyle: {
		bottom: 16,
		right: 16,
		position: "absolute",
		backgroundColor: colors.secondary,
	},
	submitButton: {
		height: 40,
		backgroundColor: colors.secondary,
		borderRadius: 8,
		marginTop: 30,
		alignItems: "center",
		justifyContent: "center",
	},
	submitButtonText: {
		color: "white",
		textAlign: "center",
		fontWeight: "bold",
	},
	picker: {
		marginBottom: 5,
	},
});
