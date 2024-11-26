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
import { useIntl } from "react-intl";

const Products = ({ visible, animateFrom, style }) => {
    const intl = useIntl();

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

	// Fetches the products data
	const { data, loading, error, refetch } = useAuthenticatedFetch("products");

	// Local state for products list
	const [products, setProducts] = useState(data);

	// Custom delete hook that removes product and refetches the data
	const { handleDelete } = useDelete(setProducts, refetch);
    
	// Update local products state when new data is fetched and sort data from largest to smallest by `product_id`
	useEffect(() => {
        if (data) {
            const sortedProducts = [...data].sort((a, b) => {
                const nameComparison = a.name.localeCompare(b.name);
                if (nameComparison === 0) {
                    return a.product_id - b.product_id;
                }
                return nameComparison;
            });
            setProducts(sortedProducts);
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
				// FlatList to render a list of products
				<FlatList
					data={products}
					keyExtractor={(item) => (item.product_id ? item.product_id.toString() : Math.random().toString())}
					renderItem={({ item, index }) => (
						<View
							style={[
								globalStyles.flatlistItem,
								index === products.length - 1 ? { borderBottomWidth: 0 } : {},
							]}>
							<View style={globalStyles.flatlistItemContent}>
								<View style={globalStyles.flatlistItemData}>
									<Text style={globalStyles.flatlistItemTitle}>{item.name}</Text>
									<View>
										{item.size ? (
											<View style={globalStyles.flatlistItemDetails}>
												<Text style={globalStyles.flatlistItemDetailsLabel}>{intl.formatMessage({ id: "Size"})}: </Text>
												<Text style={globalStyles.flatlistItemDetailsValue}>{item.size}</Text>
											</View>
										) : null}
										{item.color ? (
											<View style={globalStyles.flatlistItemDetails}>
												<Text style={globalStyles.flatlistItemDetailsLabel}>{intl.formatMessage({ id: "Color"})} </Text>
												<Text style={globalStyles.flatlistItemDetailsValue}>{item.color}</Text>
											</View>
										) : null}
										<View style={globalStyles.flatlistItemDetails}>
											<Text style={globalStyles.flatlistItemDetailsLabel}>{intl.formatMessage({ id: "Price"})} </Text>
											<Text style={globalStyles.flatlistItemDetailsValue}>
                                                {intl.formatMessage({ id: "currency.symbol" })} {item.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
											</Text>
										</View>
										<View style={globalStyles.flatlistItemDetails}>
											<Text style={globalStyles.flatlistItemDetailsLabel}>{intl.formatMessage({ id: "In Stock"})} </Text>
											<Text style={globalStyles.flatlistItemDetailsValue}>{item.quantity}</Text>
										</View>
									</View>
								</View>

								{/* Edit and delete buttons */}
								<View style={globalStyles.flatlistItemButtons}>
									<TouchableOpacity
										onPress={() => {
											navigation.navigate("product-details", { product: item });
										}}>
										<FontAwesome5 name="edit" size={24} color={colors.text} />
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											handleDelete(item.product_id, intl.formatMessage({ id: "Product"}), "products");
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
				<Text>{intl.formatMessage({ id: "No products registered yet"})}</Text>
			)}

			{/* FAB button to navigate to the product registration screen */}
			<AnimatedFAB
				icon={"plus"}
				label={intl.formatMessage({ id: "Add Product"})}
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
