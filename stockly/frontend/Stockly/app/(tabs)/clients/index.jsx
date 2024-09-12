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

const Clients = ({ visible, animateFrom, style }) => {
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

	const { data, loading, error, refetch } = useAuthenticatedFetch("clients");

	const [clients, setClients] = useState(data);

	useEffect(() => {
		if (isFocused) {
			refetch();
		}
	}, [isFocused, refetch]);

	useEffect(() => {
		if (data) {
			setClients(data);
		}
	}, [data]);

	if (loading) {
		return <ActivityIndicator size="large" color={colors.primary} />;
	}

	if (error) {
		return <Text>{error}</Text>;
	}

	const handleDelete = async (client_id) => {
		Alert.alert(
			"Delete Confirmation",
			"Are you sure you want to delete this client?",
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
								`${config.apiUrl}/clients/${client_id}`,
								{
									headers: {
										"Content-Type": "application/json",
										Authorization: `Bearer ${token}`,
									},
								}
							);

							if (response.status === 200) {
								const updatedClients = clients.filter(
									(item) => item.client_id !== client_id
								);
								setClients(updatedClients);
								Alert.alert(
									"Success",
									"Client deleted successfully"
								);
							} else {
								console.log("Error response:", response.data);
								Alert.alert("Error", "Failed to delete client");
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
					data={clients}
					keyExtractor={(item) =>
						item.id ? item.id.toString() : Math.random().toString()
					}
					renderItem={({ item }) => (
						<View style={globalStyles.flatlistItem}>
							<View style={globalStyles.flatlistItemContent}>
								<View style={globalStyles.flatlistItemData}>
									<Text style={styles.flatlistItemName}>
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
												Phone number:{" "}
											</Text>
											<Text
												style={
													globalStyles.flatlistItemDetailsValue
												}
											>
												{item.phone_number}
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
												Email:{" "}
											</Text>
											<Text
												style={
													globalStyles.flatlistItemDetailsValue
												}
											>
												{item.email}
											</Text>
										</View>
									</View>
								</View>
								<View style={globalStyles.flatlistItemButtons}>
									<TouchableOpacity
										onPress={() => {
											navigation.navigate(
												"client-details",
												{ client: item }
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
											handleDelete(item.client_id);
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
				<Text>No clients registered yet.</Text>
			)}
			<AnimatedFAB
				icon={"plus"}
				label={"Add Client  "}
				color={"white"}
				extended={isExtended}
				onPress={() => navigation.navigate("register-client")}
				visible={visible}
				animateFrom={"right"}
				iconMode={"static"}
				style={[globalStyles.fabStyle, style, fabStyle]}
			/>
		</View>
	);
};

export default Clients;

const styles = StyleSheet.create({
	flatlistItemName: {
		fontSize: 15,
		fontWeight: "bold",
		color: colors.tertiary,
	},
});
