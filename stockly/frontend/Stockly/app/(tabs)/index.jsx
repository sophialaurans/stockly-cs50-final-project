import React, { useState, useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import useAuthenticatedFetch from "../../hooks/useAuthenticatedFetch";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../constants/colors";
import { useIntl } from "react-intl";
import { LanguageProvider } from "../IntlManager";

const Dashboard = () => {
    const intl = useIntl();

	// Get screen width for responsive design
	const screenWidth = Dimensions.get("window").width;

	// Check if the screen is currently focused
	const isFocused = useIsFocused();

	// Fetch data using a custom authenticated fetch hook
	const { data, loading, error, refetch } = useAuthenticatedFetch("");

	// State to hold dashboard data and selected month/data for revenue
	const [dashboard, setDashboard] = useState(data);
	const [selectedData, setSelectedData] = useState(null);
	const [selectedMonth, setSelectedMonth] = useState(null);

	// Array of month names for display purposes
	const monthNames = [
		intl.formatMessage({ id: "January"}),
		intl.formatMessage({ id: "February"}),
		intl.formatMessage({ id: "March"}),
		intl.formatMessage({ id: "April"}),
		intl.formatMessage({ id: "May"}),
		intl.formatMessage({ id: "June"}),
		intl.formatMessage({ id: "July"}),
		intl.formatMessage({ id: "August"}),
		intl.formatMessage({ id: "September"}),
		intl.formatMessage({ id: "October"}),
		intl.formatMessage({ id: "November"}),
		intl.formatMessage({ id: "December"}),
	];

	// Data structure for the revenue chart
	const revenue = {
		labels: dashboard?.labels || [],
		datasets: [
			{
				data: dashboard?.revenueData || [],
				color: (opacity = 1) => `rgba(39, 185, 185, ${opacity})`, // Set color (app's secondary color) to the chart's data button
			},
		],
	};

	// Effect to refetch data when the screen is focused
	useEffect(() => {
		if (isFocused) {
            setSelectedData(null);
            setSelectedMonth(null);
			refetch();
		}
	}, [isFocused, refetch]);

	// Effect to update the dashboard state when new data is received
	useEffect(() => {
		if (data) {
			setDashboard(data);
		}
	}, [data]);

	// Show loading indicator while data is being fetched
	if (loading) {
		return <ActivityIndicator size="large" color={colors.primary} />;
	}

	// Show error message if there was an error fetching data
	if (error) {
		return <Text>{error}</Text>;
	}

	return (
        <PaperProvider style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Cards for displaying product and stock information */}
                <View style={styles.cardPack}>
                    <LinearGradient colors={["transparent", colors.darkBlue]} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{intl.formatMessage({ id: "Products"})}</Text>
                            <FontAwesome6 name="boxes-stacked" size={20} color="white" />
                        </View>
                        <Text style={styles.cardValue}>{data.totalProducts}</Text>
                    </LinearGradient>
                    <LinearGradient colors={["transparent", colors.darkBlue]} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{intl.formatMessage({ id: "Items in Stock"})}</Text>
                            <MaterialIcons name="inventory" size={20} color="white" />
                        </View>
                        <Text style={styles.cardValue}>{data.totalStock}</Text>
                    </LinearGradient>
                </View>

                {/* Cards for displaying orders and clients information */}
                <View style={styles.cardPack}>
                    <LinearGradient colors={["transparent", colors.darkBlue]} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{intl.formatMessage({ id: "Orders in Progress"})}</Text>
                            <FontAwesome6 name="boxes-packing" size={20} color="white" />
                        </View>
                        <Text style={styles.cardValue}>{data.pendingOrders}</Text>
                    </LinearGradient>
                    <LinearGradient colors={["transparent", colors.darkBlue]} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{intl.formatMessage({ id: "Clients"})}</Text>
                            <MaterialCommunityIcons name="folder-account" size={20} color="white" />
                        </View>
                        <Text style={styles.cardValue}>{data.totalClients}</Text>
                    </LinearGradient>
                </View>

                {/* Card for displaying monthly revenue chart */}
                <LinearGradient colors={["transparent", colors.darkBlue]} style={styles.cardChart}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{intl.formatMessage({ id: "Monthly Revenue"})}</Text>
                        <FontAwesome6 name="hand-holding-dollar" size={20} color="white" />
                    </View>
                    <View style={styles.dotDataContainer}>
                        <Octicons name="dot-fill" size={24} color={colors.turquoise} />
                        <Text style={styles.dotData}>
                            {selectedMonth !== null
                                ? `${monthNames[selectedMonth]}: ${intl.formatMessage({ id: "currency.symbol"})} ${selectedData.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                : `${intl.formatMessage({ id: "Current month"})}: ${intl.formatMessage({ id: "currency.symbol"})} ${Number(data.currentMonthRevenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        </Text>
                    </View>
                    <LineChart
                        data={revenue}
                        width={screenWidth - 80}
                        height={230}
                        verticalLabelRotation={30}
                        chartConfig={{
                            backgroundColor: colors.tertiary,
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientToOpacity: 0,
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                        }}
                        getDotProps={(value, index) => {
                            return {
                                r: "6",
                                strokeWidth: "2",
                                stroke: index === selectedMonth ? "white" : "transparent",
                            };
                        }}
                        bezier
                        onDataPointClick={({ value, index }) => {
                            setSelectedData(value);
                            setSelectedMonth(index);
                        }}
                    />
                </LinearGradient>
            </ScrollView>
        </PaperProvider>
	);
};

export default function DashboardWrapper() {
    return (
		<LanguageProvider>
            <Dashboard />
        </LanguageProvider>
	);
};

// Styles for the index screen
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	contentContainer: {
		padding: 20,
	},
	cardPack: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	card: {
		padding: 20,
		width: "48%",
		minHeight: 130,
		backgroundColor: colors.tertiary,
		borderRadius: 5,
		justifyContent: "space-between",
		shadowColor: colors.black,
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	cardTitle: {
		color: "white",
		maxWidth: "80%",
	},
	cardValue: {
		color: "white",
		fontSize: 40,
		textAlign: "center",
	},
	dotDataContainer: {
		margin: 20,
		flexDirection: "row",
		gap: 5,
		alignSelf: "center",
		alignItems: "center",
	},
	dotData: {
		color: "white",
	},
	cardChart: {
		padding: 20,
		height: 370,
		width: "100%",
		backgroundColor: colors.tertiary,
		borderRadius: 5,
		shadowColor: colors.black,
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6,
	},
});
