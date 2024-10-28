import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, ActivityIndicator, FlatList } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import useAuthenticatedFetch from "../../../hooks/useAuthenticatedFetch";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { FontAwesome } from "@expo/vector-icons";
import { AnimatedFAB } from "react-native-paper";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";
import useDelete from "../../../hooks/useDelete";
import { useTranslation } from "react-i18next";

const Clients = ({ visible, animateFrom, style }) => {
    const { t } = useTranslation();

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

	// Fetches the clients data
	const { data, loading, error, refetch } = useAuthenticatedFetch("clients");

	// Local state for clients list
	const [clients, setClients] = useState(data);

	// Custom delete hook that removes clients and refetches the data
	const { handleDelete } = useDelete(setClients, refetch);
    
	// Update local clients state when new data is fetched and sort data from largest to smallest by `client_id`
	useEffect(() => {
		if (data) {
            const sortedClients = data.sort((a, b) => b.client_id - a.client_id);
			setClients(sortedClients);
		}
	}, [data]);

	// Refetch data whenever the screen is focused
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

	return (
		<View style={globalStyles.container}>
			{data && data.length > 0 ? (
				// FlatList to render a list of clients
				<FlatList
					data={clients}
					keyExtractor={(item) => (item.client_id ? item.client_id.toString() : Math.random().toString())}
					renderItem={({ item, index }) => (
						<View
							style={[
								globalStyles.flatlistItem,
								index === clients.length - 1 ? { borderBottomWidth: 0 } : {},
							]}>
							<View style={globalStyles.flatlistItemContent}>
								<View style={globalStyles.flatlistItemData}>
									<Text style={globalStyles.flatlistItemTitle}>{item.name}</Text>
									<View>
										{item.phone_number ? (
											<View style={globalStyles.flatlistItemDetails}>
												<Text style={globalStyles.flatlistItemDetailsLabel}>
													{t("Phone number")}:{" "}
												</Text>
												<Text style={globalStyles.flatlistItemDetailsValue}>
													{item.phone_number}
												</Text>
											</View>
										) : null}
										{item.email ? (
											<View style={globalStyles.flatlistItemDetails}>
												<Text style={globalStyles.flatlistItemDetailsLabel}>Email: </Text>
												<Text style={globalStyles.flatlistItemDetailsValue}>{item.email}</Text>
											</View>
										) : null}
									</View>
								</View>

								{/* Edit and delete buttons */}
								<View style={globalStyles.flatlistItemButtons}>
									<TouchableOpacity
										onPress={() => {
											navigation.navigate("client-details", { client: item });
										}}>
										<FontAwesome5 name="edit" size={24} color={colors.text} />
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											handleDelete(item.client_id, t("Client"), "clients");
										}}>
										<FontAwesome name="trash" size={24} color={colors.text} />
									</TouchableOpacity>
								</View>
							</View>
						</View>
					)}
					onScroll={onScroll}
				/>
			) : (
				<Text>{t("No clients registered yet")}.</Text>
			)}
			{/* FAB button to navigate to the client registration screen */}
			<AnimatedFAB
				icon={"plus"}
				label={t("Add Client")}
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
