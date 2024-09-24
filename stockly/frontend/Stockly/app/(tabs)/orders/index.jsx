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
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const Orders = ({ visible, animateFrom, style }) => {
	const [showAllItems, setShowAllItems] = useState(false);
	const [isExtended, setIsExtended] = useState(true);

	const isIOS = Platform.OS === "ios";

	const onScroll = ({ nativeEvent }) => {
		const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
		setIsExtended(currentScrollPosition <= 0);
	};

	const fabStyle = { [animateFrom]: 16 };

	const navigation = useNavigation();
	const isFocused = useIsFocused();
	const { data, loading, error, refetch } = useAuthenticatedFetch("orders");

	const [orders, setOrders] = useState(data);

	useEffect(() => {
		if (data) {
			setOrders(data);
		}
	}, [data]);

    const { handleDelete } = useDelete(setOrders, refetch);

	useEffect(() => {
		if (isFocused) {
			refetch();
		}
	}, [isFocused, refetch]);

	const { printReceipt, printToFile, selectPrinter, selectedPrinter, loadingPrint, setLoadingPrint } =
		usePrintAndSave();

	if (loading) {
		return <ActivityIndicator size="large" color={colors.primary} />;
	}

	if (error) {
		return <Text>{error}</Text>;
	}

	const handleStatusChange = async (order_id, newStatus) => {
		try {
			const token = await AsyncStorage.getItem("access_token");

			if (!token) {
				Alert.alert("Error", "No authentication token found.");
				navigation.replace("(auth)");
				return;
			}

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
				const updatedOrders = orders.map((order) =>
					order.order_id === order_id ? { ...order, status: newStatus } : order
				);
				setOrders(updatedOrders);
			} else {
				Alert.alert("Error", "Failed to update order status");
			}
		} catch (error) {
			console.log("Catch Error:", error.response ? error.response.data : error.message);
			Alert.alert("Error", "An unexpected error occurred.");
		}
	};

	const handlePrintReceipt = async (order_id) => {
		setLoadingPrint(true);
		try {
			await printReceipt(order_id);
		} catch (error) {
			Alert.alert("Error", "Error printing receipt");
		} finally {
			setLoadingPrint(false);
		}
	};

	const handlePrintToFile = async (order_id) => {
		setLoadingPrint(true);
		try {
			await printToFile(order_id);
		} catch (error) {
			Alert.alert("Error", "Error saving to file");
		} finally {
			setLoadingPrint(false);
		}
	};

	return (
		<View style={globalStyles.container}>
			{data && data.length > 0 ? (
				<FlatList
					style={globalStyles.flatlist}
					data={orders}
					keyExtractor={(item) => item.order_id.toString()}
					renderItem={({ item, index }) => (
						<View
							style={[
								globalStyles.flatlistItem,
								index === orders.length - 1 ? { borderBottomWidth: 0 } : {},
							]}>
							<View style={styles.orderHeaderContainer}>
								<Text style={styles.orderHeaderName}>Order from {item.client_name}</Text>
								<Text style={styles.orderHeaderPrice}>Total: $ {item.total_price?.toFixed(2)}</Text>
							</View>
							<View style={globalStyles.flatlistItemContent}>
								<View style={globalStyles.flatlistItemData}>
									<View style={styles.orderDateContainer}>
										<Text style={styles.orderDateText}>Created on {item.date.slice(0, 10)}</Text>
									</View>
									<View style={styles.orderItemsContainer}>
										{item.items
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
														$
														{orderItem.price?.toFixed(2)} each
													</Text>
												</View>
											))}
										{item.items.length > 5 && !showAllItems && (
											<TouchableOpacity
												onPress={() => setShowAllItems(true)}
												style={styles.seeMoreLessButton}>
												<AntDesign name="down" size={11} color={colors.primary} />
												<Text style={styles.seeMoreLessButtonText}>See more...</Text>
											</TouchableOpacity>
										)}
										{showAllItems && item.items.length > 5 && (
											<TouchableOpacity
												onPress={() => setShowAllItems(false)}
												style={styles.seeMoreLessButton}>
												<AntDesign name="up" size={11} color={colors.primary} />
												<Text style={styles.seeMoreLessButtonText}>See less</Text>
											</TouchableOpacity>
										)}
									</View>

									<View style={styles.pickerContainer}>
										<Text style={globalStyles.flatlistItemDetailsLabel}>Status: </Text>
										<Picker
											style={styles.orderStatusPicker}
											selectedValue={item.status}
											onValueChange={(newStatus) => handleStatusChange(item.order_id, newStatus)}>
											<Picker.Item label="Pending" value="pending" />
											<Picker.Item label="Completed" value="completed" />
											<Picker.Item label="Shipped" value="shipped" />
										</Picker>
									</View>
								</View>
								<View style={globalStyles.flatlistItemButtons}>
									<TouchableOpacity
										onPress={() => {
											navigation.navigate("order-details", { order: item });
										}}>
										<FontAwesome5 name="edit" size={24} color={colors.text} />
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											handleDelete(item.order_id, "Order", "orders");
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
									<Modal visible={loadingPrint} transparent={true} animationType="fade">
										<View style={styles.modalBackground}>
											<View style={styles.modalContent}>
												<ActivityIndicator size="large" color="white" />
												<Text style={styles.modalText}>Processing request...</Text>
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
				<Text>No orders registered yet.</Text>
			)}
			<AnimatedFAB
				icon={"plus"}
				label={"New Order  "}
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
		flex: 2,
		fontSize: 15,
		fontWeight: "bold",
		color: colors.tertiary,
	},
	orderHeaderPrice: {
		flex: 1,
		textAlign: "right",
		fontWeight: "bold",
		color: colors.tertiary,
	},
	orderDateContainer: {
		marginBottom: 10,
	},
	orderDateText: {
		fontSize: 11,
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
		fontSize: 12,
		lineHeight: 12,
		fontWeight: "300",
	},
	orderItemsTextShort: {
		fontSize: 12,
		lineHeight: 12,
		flex: 1,
		fontWeight: "300",
	},
	orderItemsTextPrice: {
		fontSize: 12,
		lineHeight: 12,
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
		fontSize: 11,
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
