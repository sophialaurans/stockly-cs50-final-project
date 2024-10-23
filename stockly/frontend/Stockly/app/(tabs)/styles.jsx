import { StyleSheet } from "react-native";
import colors from "../../constants/colors";

// Define global styles using React Native's StyleSheet
export const globalStyles = StyleSheet.create({
	// Style for the main content container
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: colors.background,
	},
	// Style for each flatlist item container
	flatlistItem: {
		flex: 1,
		alignSelf: "center",
		width: "100%",
		borderBottomWidth: 1,
		borderColor: colors.darkGrey,
		paddingBottom: 20,
		marginBottom: 20,
	},
	// Style for the content of the flatlist item
	flatlistItemContent: {
		flexDirection: "row",
		flexWrap: "nowrap",
		justifyContent: "space-between",
		flex: 1,
		gap: 10,
	},
	// Style for the data (title, label, value) container in the flatlist
	flatlistItemData: {
		flex: 1,
	},
	// Style for the title text (name) of the flatlist item
	flatlistItemTitle: {
		fontSize: 17,
		fontWeight: "bold",
		color: colors.tertiary,
	},
	// Style for the details container of the flatlist data container
	flatlistItemDetails: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	// Style for the label text of the data in the the details container
	flatlistItemDetailsLabel: {
		fontWeight: "500",
		color: colors.text,
	},
	// Style for the value text of the data in the the details container
	flatlistItemDetailsValue: {
		color: colors.text,
	},
	// Style for the edit and delete buttons
	flatlistItemButtons: {
		justifyContent: "center",
		flexDirection: "column",
		gap: 10,
		alignItems: "center",
	},
	// Style for the FAB button
	fabStyle: {
		bottom: 16,
		right: 16,
		position: "absolute",
		backgroundColor: colors.secondary,
	},
	// Style for the submit button
	submitButton: {
		height: 40,
		backgroundColor: colors.secondary,
		borderRadius: 8,
		marginTop: 30,
		alignItems: "center",
		justifyContent: "center",
	},
	// Style for the text of the submit button
	submitButtonText: {
		color: "white",
		textAlign: "center",
		fontWeight: "bold",
	},
	// Style for the picker
	picker: {
		marginBottom: 5,
		borderWidth: 0.8,
		borderColor: colors.darkGrey,
		borderRadius: 8,
	},
	// Style for the add order item button container
	addItemButtonContainer: {
		width: "100%",
		alignItems: "flex-end",
		marginTop: 5,
		marginBottom: 7,
	},
	// Style for the add order item button
	addItemButton: {
		borderWidth: 1,
		borderColor: colors.tertiary,
		borderRadius: 8,
		height: 40,
		width: 100,
		justifyContent: "center",
		alignItems: "center",
	},
	// Style for the add order item button text
	addItemButtonText: {
		color: colors.tertiary,
		fontWeight: "bold",
        textAlign: "center",
	},
	// Style for the container of each item in the order item flatlist
	item: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "nowrap",
		justifyContent: "space-between",
		padding: 8,
		borderBottomWidth: 1,
	},
	// Style for the item name, size and color container in the order item flatlist
	itemDataName: {
		flex: 3,
	},
	// Style for the quantity and price text in the order item flatlist
	itemData: {
		flex: 2,
		textAlign: "center",
	},
	// Style for the delete button of each order item
	deleteButton: {
		padding: 5,
	},
	// Style for the total price container of the order
	totalPrice: {
		flexDirection: "row",
		flexWrap: "nowrap",
		justifyContent: "space-between",
		alignItems: "baseline",
	},
	// Style for the total price label of the order
	totalPriceLabel: {
		color: colors.text,
	},
	// Style for the total price value of the order
	totalPriceValue: {
		fontSize: 17,
	},
});
