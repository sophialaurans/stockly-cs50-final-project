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

const Orders = ({ visible, animateFrom, style }) => {
	const [isExtended, setIsExtended] = React.useState(true);

	const isIOS = Platform.OS === "ios";

	const onScroll = ({ nativeEvent }) => {
		const currentScrollPosition =
			Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
		setIsExtended(currentScrollPosition <= 0);
	};

	const fabStyle = { [animateFrom]: 16 };

	const navigation = useNavigation();
	const isFocused = useIsFocused();

	const { data, loading, error, refetch } = useAuthenticatedFetch("orders");

	const [orders, setOrders] = useState(data);

	useEffect(() => {
		if (isFocused) {
			refetch();
		}
	}, [isFocused, refetch]);

	useEffect(() => {
		if (data) {
			setOrders(data);
		}
	}, [data]);

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
				navigation.replace("login");
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
					order.order_id === order_id
						? { ...order, status: newStatus }
						: order
				);
				setOrders(updatedOrders);
			} else {
				Alert.alert("Error", "Failed to update order status");
			}
		} catch (error) {
			console.log(
				"Catch Error:",
				error.response ? error.response.data : error.message
			);
			Alert.alert("Error", "An unexpected error occurred.");
		}
	};

	const handleDelete = async (order_id) => {
		Alert.alert(
			"Delete Confirmation",
			"Are you sure you want to delete this order?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					onPress: async () => {
						try {
							const token = await AsyncStorage.getItem(
								"access_token"
							);

							if (!token) {
								Alert.alert(
									"Error",
									"No authentication token found."
								);
								navigation.replace("login");
								return;
							}

							const response = await axios.delete(
								`${config.apiUrl}/orders/${order_id}`,
								{
									headers: {
										"Content-Type": "application/json",
										Authorization: `Bearer ${token}`,
									},
								}
							);

							if (response.status === 200) {
								const updatedOrders = orders.filter(
									(item) => item.order_id !== order_id
								);
								setOrders(updatedOrders);
								Alert.alert(
									"Success",
									"Order deleted successfully"
								);
							} else {
								console.log("Error response:", response.data);
								Alert.alert("Error", "Failed to delete order");
							}
						} catch (error) {
							console.log(
								"Catch Error:",
								error.response
									? error.response.data
									: error.message
							);
							Alert.alert(
								"Error",
								"An unexpected error occurred."
							);
						}
					},
					style: "destructive",
				},
			]
		);
	};

	return (
		<View style={globalStyles.container}>
			{data && data.length > 0 ? (
				<FlatList
					style={globalStyles.flatlist}
					data={orders}
					keyExtractor={(item) =>
						item.id ? item.id.toString() : Math.random().toString()
					}
					renderItem={({ item }) => (
						<View style={globalStyles.flatlistItem}>
							<View style={styles.orderHeaderContainer}>
								<Text style={styles.orderHeaderText}>
									Order from {item.client_name}
								</Text>
								<Text style={styles.orderHeaderText}>
									Total: R$ {item.total_price?.toFixed(2)}
								</Text>
							</View>
							<View style={globalStyles.flatlistItemContent}>
								<View style={globalStyles.flatlistItemData}>
									<View style={styles.orderDateContainer}>
										<Text style={styles.orderDateText}>
											Created on {item.date.slice(0, 10)}
										</Text>
									</View>
									<View style={styles.orderItemsContainer}>
										{item.items.map((orderItem, index) => (
											<View
												key={index}
												style={styles.orderItems}
											>
												<Text
													style={
														styles.orderItemsTextShort
													}
												>
													{orderItem.quantity}x
												</Text>
												<Text
													style={
														styles.orderItemsTextLong
													}
												>
													{orderItem.product_name}
												</Text>
												{orderItem.product_size ? (
													<Text
														style={
															styles.orderItemsTextShort
														}
													>
														{orderItem.product_size}
													</Text>
												) : null}
												{orderItem.product_color ? (
													<Text
														style={
															styles.orderItemsTextShort
														}
													>
														{
															orderItem.product_color
														}
													</Text>
												) : null}
												<Text
													style={
														styles.orderItemsTextLong
													}
												>
													R$
													{orderItem.price?.toFixed(
														2
													)}{" "}
													each
												</Text>
											</View>
										))}
									</View>
									<View style={styles.pickerContainer}>
										<Text
											style={
												globalStyles.flatlistItemDetailsLabel
											}
										>
											Status:{" "}
										</Text>
										<Picker
											style={styles.orderStatusPicker}
											selectedValue={item.status}
											onValueChange={(newStatus) =>
												handleStatusChange(
													item.order_id,
													newStatus
												)
											}
										>
											<Picker.Item
												label="Pending"
												value="pending"
											/>
											<Picker.Item
												label="Completed"
												value="completed"
											/>
											<Picker.Item
												label="Shipped"
												value="shipped"
											/>
										</Picker>
									</View>
								</View>
								<View style={globalStyles.flatlistItemButtons}>
									<TouchableOpacity
										onPress={() => {
											navigation.navigate(
												"order-details",
												{ order: item }
											);
										}}
									>
										<FontAwesome5
											name="edit"
											size={24}
											color={colors.text}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											handleDelete(item.order_id);
										}}
									>
										<FontAwesome
											name="trash"
											size={24}
											color={colors.text}
										/>
									</TouchableOpacity>
									<TouchableOpacity>
										<MaterialCommunityIcons
											name="printer"
											size={24}
											color={colors.text}
										/>
									</TouchableOpacity>
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
		borderBottomWidth: 1,
		borderColor: colors.grey,
		paddingBottom: 3,
		marginBottom: 3,
	},
	orderHeaderText: {
		fontWeight: "bold",
		color: colors.tertiary,
	},
	orderDateContainer: {
		marginBottom: 10,
	},
	orderDateText: {
		fontSize: 11,
		color: colors.darkGrey,
	},
	orderItemsContainer: {
		width: "100%",
		flex: 1,
	},
	orderItems: {
		flexDirection: "row",
		flexWrap: "wrap",
		flex: 1,
	},
	orderItemsTextLong: {
		flex: 5,
	},
	orderItemsTextShort: {
		flex: 1,
	},
	pickerContainer: {
		flexDirection: "row",
		flexWrap: "nowrap",
		alignItems: "center",
	},
});
