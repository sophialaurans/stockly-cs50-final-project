import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	ActivityIndicator,
	FlatList,
	Alert,
	Platform,
	Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import useAuthenticatedFetch from "../../../hooks/useAuthenticatedFetch";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import config from "../../../constants/config";
import { AnimatedFAB } from "react-native-paper";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import usePrintAndSave from "../../../hooks/usePrintAndSave";
import useDelete from "../../../hooks/useDelete";
import useNotAuthenticatedWarning from "../../../hooks/useNotAuthenticatedWarning";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

const Orders = ({ visible, animateFrom, style }) => {
    const { t } = useTranslation();

	// State to toggle displaying all items in an order
	const [showAllItems, setShowAllItems] = useState(false);

	// Handles scroll events to collapse or expand FAB based on scroll position
	const [isExtended, setIsExtended] = useState(true);
	const onScroll = ({ nativeEvent }) => {
		const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
		setIsExtended(currentScrollPosition <= 0);
	};
	// FAB styling to control its position based on the "animateFrom" prop
	const fabStyle = { [animateFrom]: 16 };

	// Hooks to navigate and check if the screen is currently focused
	const navigation = useNavigation();
	const isFocused = useIsFocused();

	// Fetches the orders data
	const { data, loading, error, refetch } = useAuthenticatedFetch("orders");

	// Local state for orders list
	const [orders, setOrders] = useState(data);

	// Custom delete hook that removes order and refetches the data
	const { handleDelete } = useDelete(setOrders, refetch);

	// Hooks for printing and saving receipts
	const { printReceipt, printToFile, selectPrinter, selectedPrinter, loadingPrint, setLoadingPrint } =
		usePrintAndSave();

	// Custom hook to handle not authenticated warning
	const { checkAuthentication } = useNotAuthenticatedWarning();

	// Refetch data whenever the screen is focused and sort data from largest to smallest by `order_id`
	useEffect(() => {
		if (data) {
			const sortedOrders = data.sort((a, b) => b.order_id - a.order_id);
            setOrders(sortedOrders);
		}
	}, [data]);

	// Update local orders state when new data is fetched
	useEffect(() => {
		if (isFocused) {
			refetch();
		}
	}, [isFocused, refetch]);

	// Show loading spinner while fetching data
	if (loading) {
		return <ActivityIndicator size="large" color={colors.primary} />;
	}

	// Display error message if the fetch fails
	if (error) {
		return <Text>{error}</Text>;
	}

	// Handle status change for an order
	const handleStatusChange = async (order_id, newStatus) => {
		try {
			const token = await AsyncStorage.getItem("access_token");
			checkAuthentication();

			// Update the order status via API
			const response = await axios.put(
				`${config.apiUrl}/orders/${order_id}/status`,
				{ status: newStatus },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				// Update the local orders state with the new status
				const updatedOrders = orders.map((order) =>
					order.order_id === order_id ? { ...order, status: newStatus } : order
				);
				setOrders(updatedOrders);
			} else {
				Alert.alert(t("Error"), t("Failed to update order status"));
			}
		} catch (error) {
			Alert.alert(t("Error"), t("An unexpected error occurred"));
		}
	};

	// Print the receipt for an order
	const handlePrintReceipt = async (order_id) => {
		setLoadingPrint(true);
		try {
			await printReceipt(order_id);
		} catch (error) {
			Alert.alert(t("Error"), t("Error printing receipt"));
		} finally {
			setLoadingPrint(false);
		}
	};

	// Save the order receipt to a file
	const handlePrintToFile = async (order_id) => {
		setLoadingPrint(true);
		try {
			await printToFile(order_id);
		} catch (error) {
			Alert.alert(t("Error"), t("Error saving to file"));
		} finally {
			setLoadingPrint(false);
		}
	};

	return (
		<View style={globalStyles.container}>
			{data && data.length > 0 ? (
				// Render a list of orders
				<FlatList
					data={orders}
					keyExtractor={(item) => item.order_id.toString()}
					renderItem={({ item, index }) => (
						// Render each order item
						<View
							style={[
								globalStyles.flatlistItem,
								index === orders.length - 1 ? { borderBottomWidth: 0 } : {},
							]}>
							<View style={styles.orderHeaderContainer}>
								<Text style={styles.orderHeaderName}>{t("Order from")} {item.client_name}</Text>
								<Text style={styles.orderHeaderPrice}>{t("Total")} {t('currency.symbol')} {item.total_price?.toFixed(2)}</Text>
							</View>
							<View style={globalStyles.flatlistItemContent}>
								<View style={globalStyles.flatlistItemData}>
									<View style={styles.orderDateContainer}>
										<Text style={styles.orderDateText}>{t("Created on")} {item.date.slice(0, 10)}</Text>
									</View>
									<View style={styles.orderItemsContainer}>
										{item.items
											// Display a limited number of items and allow toggling to see more
											.slice(0, showAllItems ? item.items.length : 5)
											.map((orderItem, index) => (
												<View key={index} style={styles.orderItems}>
													<Text style={styles.orderItemsTextShort}>{orderItem.quantity}</Text>
													<Text style={styles.orderItemsTextName}>
														{orderItem.product_name}
														{orderItem.product_size ? ` ${orderItem.product_size}` : ""}
														{orderItem.product_color ? ` ${orderItem.product_color}` : ""}
													</Text>
													<Text style={styles.orderItemsTextPrice}>
                                                        {t('currency.symbol')}{orderItem.price?.toFixed(2)} {t("each")}
													</Text>
												</View>
											))}
										{item.items.length > 5 && !showAllItems && (
											<TouchableOpacity
												onPress={() => setShowAllItems(true)}
												style={styles.seeMoreLessButton}>
												<AntDesign name="down" size={11} color={colors.primary} />
												<Text style={styles.seeMoreLessButtonText}>{t("See more")}</Text>
											</TouchableOpacity>
										)}
										{showAllItems && item.items.length > 5 && (
											<TouchableOpacity
												onPress={() => setShowAllItems(false)}
												style={styles.seeMoreLessButton}>
												<AntDesign name="up" size={11} color={colors.primary} />
												<Text style={styles.seeMoreLessButtonText}>{t("See less")}</Text>
											</TouchableOpacity>
										)}
									</View>

									{/* Picker to change the status of an order */}
									<View style={styles.pickerContainer}>
										<Text style={globalStyles.flatlistItemDetailsLabel}>{t("Status")} </Text>
										<Picker
											style={styles.orderStatusPicker}
											selectedValue={item.status}
											onValueChange={(newStatus) => handleStatusChange(item.order_id, newStatus)}>
											<Picker.Item label={t("Pending")} value="pending" />
											<Picker.Item label={t("Completed")} value="completed" />
											<Picker.Item label={t("Shipped")} value="shipped" />
										</Picker>
									</View>
								</View>

								{/* Buttons for order actions: Edit, Delete, Print Receipt, and Print to File */}
								<View style={globalStyles.flatlistItemButtons}>
									<TouchableOpacity
										onPress={() => {
											navigation.navigate("order-details", { order: item });
										}}>
										<FontAwesome5 name="edit" size={24} color={colors.text} />
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											handleDelete(item.order_id, t("Order"), "orders");
										}}>
										<FontAwesome name="trash" size={24} color={colors.text} />
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											handlePrintReceipt(item.order_id);
										}}>
										<MaterialCommunityIcons name="printer" size={24} color={colors.text} />
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											handlePrintToFile(item.order_id);
										}}>
										<FontAwesome5 name="file-download" size={20} color={colors.text} />
										{Platform.OS === "ios" && (
											<>
												<View style={styles.spacer} />
												<Button title="Select printer" onPress={selectPrinter} />
												<View style={styles.spacer} />
												{selectedPrinter ? (
													<Text
														style={
															styles.printer
														}>{`Selected printer: ${selectedPrinter.name}`}</Text>
												) : undefined}
											</>
										)}
									</TouchableOpacity>

									{/* Show loading spinner in a modal while processing print or file request */}
									<Modal visible={loadingPrint} transparent={true} animationType="fade">
										<View style={styles.modalBackground}>
											<View style={styles.modalContent}>
												<ActivityIndicator size="large" color="white" />
												<Text style={styles.modalText}>{t("Processing request")}</Text>
											</View>
										</View>
									</Modal>
								</View>
							</View>
						</View>
					)}
					onScroll={onScroll}
				/>
			) : (
				<Text>{t("No orders registered yet")}</Text>
			)}

			{/* Floating action button to create a new order */}
			<AnimatedFAB
				icon={"plus"}
				label={t("New Order")}
				color={"white"}
				extended={isExtended}
				onPress={() => navigation.navigate("new-order")}
				visible={visible}
				animateFrom={"right"}
				iconMode={"static"}
				style={[globalStyles.fabStyle, style, fabStyle]}
			/>
		</View>
	);
};

export default Orders;

const styles = StyleSheet.create({
	orderStatusPicker: {
		height: 30,
		width: 170,
	},
	orderHeaderContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		borderBottomWidth: 0.7,
		borderColor: colors.grey,
		paddingBottom: 3,
		marginBottom: 3,
	},
	orderHeaderName: {
		flex: 3,
		fontSize: 17,
		fontWeight: "bold",
		color: colors.tertiary,
	},
	orderHeaderPrice: {
		flex: 2,
		fontSize: 17,
		textAlign: "right",
		fontWeight: "bold",
		color: colors.tertiary,
	},
	orderDateContainer: {
		marginBottom: 10,
	},
	orderDateText: {
		fontSize: 12,
		fontWeight: "300",
		color: colors.darkGrey,
	},
	orderItemsContainer: {
		width: "100%",
		flex: 1,
	},
	orderItems: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 5,
		padding: 3,
		flex: 1,
	},
	orderItemsTextName: {
		flex: 8,
		fontSize: 13,
		lineHeight: 13,
		fontWeight: "300",
	},
	orderItemsTextShort: {
		fontSize: 13,
		lineHeight: 13,
		flex: 1,
		fontWeight: "300",
	},
	orderItemsTextPrice: {
		fontSize: 13,
		lineHeight: 13,
		flex: 4,
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 3,
		fontWeight: "300",
		textAlign: "right",
	},
	seeMoreLessButton: {
		flexDirection: "row",
		flexWrap: "nowrap",
		gap: 5,
		paddingVertical: 5,
		alignSelf: "flex-end",
		alignItems: "baseline",
	},
	seeMoreLessButtonText: {
		fontSize: 12,
		color: colors.secondary,
		textAlignVertical: "top",
	},
	pickerContainer: {
		flexDirection: "row",
		flexWrap: "nowrap",
		alignItems: "center",
	},
	modalBackground: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: 200,
		padding: 20,
		alignItems: "center",
	},
	modalText: {
		color: "white",
	},
});
