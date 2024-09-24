import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, FlatList, Alert, Platform } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import useAuthenticatedFetch from "../../../hooks/useAuthenticatedFetch";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { FontAwesome } from "@expo/vector-icons";
import { AnimatedFAB } from "react-native-paper";
import { globalStyles } from "../styles";
import colors from "../../../constants/colors";
import useDelete from "../../../hooks/useDelete";

const Clients = ({ visible, animateFrom, style }) => {
	const [isExtended, setIsExtended] = React.useState(true);

	const isIOS = Platform.OS === "ios";

	const onScroll = ({ nativeEvent }) => {
		const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
		setIsExtended(currentScrollPosition <= 0);
	};

	const fabStyle = { [animateFrom]: 16 };

	const navigation = useNavigation();
	const isFocused = useIsFocused();

	const { data, loading, error, refetch } = useAuthenticatedFetch("clients");

	const [clients, setClients] = useState(data);

    const { handleDelete } = useDelete(setClients, refetch);

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

	return (
		<View style={globalStyles.container}>
			{data && data.length > 0 ? (
				<FlatList
					style={globalStyles.flatlist}
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
									<Text style={styles.flatlistItemName}>{item.name}</Text>
									<View>
										{item.phone_number ? (
											<View style={globalStyles.flatlistItemDetails}>
												<Text style={globalStyles.flatlistItemDetailsLabel}>
													Phone number:{" "}
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
								<View style={globalStyles.flatlistItemButtons}>
									<TouchableOpacity
										onPress={() => {
											navigation.navigate("client-details", { client: item });
										}}>
										<FontAwesome5 name="edit" size={24} color={colors.text} />
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											handleDelete(item.client_id, "Client", "clients");
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
