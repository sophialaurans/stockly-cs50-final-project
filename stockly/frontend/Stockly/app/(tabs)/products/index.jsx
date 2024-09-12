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
import { useNavigation, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthenticatedFetch from "../../../hooks/useAuthenticatedFetch";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { FontAwesome } from "@expo/vector-icons";
import config from "../../../constants/config";
import { AnimatedFAB } from "react-native-paper";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";

const Products = ({ visible, animateFrom, style }) => {
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

	const { data, loading, error, refetch } = useAuthenticatedFetch("products");

	const [products, setProducts] = useState(data);

	useEffect(() => {
		if (isFocused) {
			refetch();
		}
	}, [isFocused, refetch]);

	useEffect(() => {
		if (data) {
			setProducts(data);
		}
	}, [data]);

	if (loading) {
		return <ActivityIndicator size="large" color={colors.primary} />;
	}

	if (error) {
		return <Text>{error}</Text>;
	}

	const handleDelete = async (product_id) => {
		Alert.alert(
			"Delete product",
			"Are you sure you want to delete this item from your account?",
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
								`${config.apiUrl}/products/${product_id}`,
								{
									headers: {
										"Content-Type": "application/json",
										Authorization: `Bearer ${token}`,
									},
								}
							);

							if (response.status === 200) {
								const updatedProducts = products.filter(
									(item) => item.product_id !== product_id
								);
								setProducts(updatedProducts);
								Alert.alert(
									null,
									"Product deleted successfully"
								);
							} else {
								console.log("Error response:", response.data);
								Alert.alert(
									"Error",
									"Failed to delete product"
								);
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
					data={products}
					keyExtractor={(item) =>
						item.product_id
							? item.product_id.toString()
							: Math.random().toString()
					}
					renderItem={({ item }) => (
						<View style={globalStyles.flatlistItem}>
							<View style={globalStyles.flatlistItemContent}>
								<View style={globalStyles.flatlistItemData}>
									<Text style={styles.flatlistItemTitle}>
										{item.name}
									</Text>
									<View>
										<View
											style={
												globalStyles.flatlistItemDetails
											}
										>
											<Text
												style={
													globalStyles.flatlistItemDetailsLabel
												}
											>
												Size:{" "}
											</Text>
											<Text
												style={
													globalStyles.flatlistItemDetailsValue
												}
											>
												{item.size}
											</Text>
										</View>
										<View
											style={
												globalStyles.flatlistItemDetails
											}
										>
											<Text
												style={
													globalStyles.flatlistItemDetailsLabel
												}
											>
												Price:{" "}
											</Text>
											<Text
												style={
													globalStyles.flatlistItemDetailsValue
												}
											>
												R$ {item.price?.toFixed(2)}
											</Text>
										</View>
										<View
											style={
												globalStyles.flatlistItemDetails
											}
										>
											<Text
												style={
													globalStyles.flatlistItemDetailsLabel
												}
											>
												In Stock:{" "}
											</Text>
											<Text
												style={
													globalStyles.flatlistItemDetailsValue
												}
											>
												{item.quantity}
											</Text>
										</View>
									</View>
								</View>
								<View style={globalStyles.flatlistItemButtons}>
									<TouchableOpacity
										onPress={() => {
											navigation.navigate(
												"product-details",
												{ product: item }
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
											handleDelete(item.product_id);
										}}
									>
										<FontAwesome
											name="trash"
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
				<Text>No products registered yet.</Text>
			)}

			<AnimatedFAB
				icon={"plus"}
				label={"Add Product"}
				color={"white"}
				extended={isExtended}
				onPress={() => navigation.navigate("register-product")}
				visible={visible}
				animateFrom={"right"}
				iconMode={"static"}
				style={[globalStyles.fabStyle, style, fabStyle]}
			/>
		</View>
	);
};

export default Products;

const styles = StyleSheet.create({
	flatlistItemTitle: {
		fontSize: 15,
		fontWeight: "bold",
		color: colors.tertiary,
	},
});
