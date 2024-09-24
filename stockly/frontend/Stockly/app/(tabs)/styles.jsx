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
		width: "100%",
		borderBottomWidth: 1,
		borderColor: colors.darkGrey,
		paddingBottom: 20,
		marginBottom: 20,
	},
	orderHeaderContainer: {
		flex: 1,
	},
	flatlistItemContent: {
		flexDirection: "row",
		flexWrap: "nowrap",
		justifyContent: "space-between",
		flex: 1,
		gap: 10,
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
		fontWeight: "500",
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
		borderWidth: 0.8,
		borderColor: colors.darkGrey,
		borderRadius: 8,
	},
	item: {
        flex: 1,
		flexDirection: "row",
        flexWrap: "nowrap",
		justifyContent: "space-between",
		padding: 8,
		borderBottomWidth: 1,
	},
    itemData: {
        flex: 2,
        textAlign: "center",
    },
    itemDataName: {
        flex: 3,
    },
	addItemButtonContainer: {
		width: "100%",
		alignItems: "flex-end",
		marginTop: 5,
		marginBottom: 7,
	},
	addItemButton: {
		borderWidth: 1,
		borderColor: colors.tertiary,
		borderRadius: 8,
		height: 40,
		width: 100,
		justifyContent: "center",
		alignItems: "center",
	},
	addItemButtonText: {
		color: colors.tertiary,
		fontWeight: "bold",
	},
	deleteButton: {
		padding: 5,
	},
	totalPrice: {
		flexDirection: "row",
		flexWrap: "nowrap",
		justifyContent: "space-between",
		alignItems: "baseline",
	},
	totalPriceLabel: {
		color: colors.text,
	},
	totalPriceValue: {
		fontSize: 16,
	},
});
