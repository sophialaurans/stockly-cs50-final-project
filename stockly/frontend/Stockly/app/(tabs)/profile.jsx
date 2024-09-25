import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	StyleSheet,
	ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthenticatedFetch from "../../hooks/useAuthenticatedFetch";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import config from "../../constants/config";
import { globalStyles } from "./styles";
import colors from "../../constants/colors";
import useNotAuthenticatedWarning from "../../hooks/useNotAuthenticatedWarning";

const ProfileScreen = () => {
	const navigation = useNavigation();

	// Hook to check if the screen is focused
	const isFocused = useIsFocused();

	// Custom hook to fetch user profile data
	const { data, loading, error, refetch } = useAuthenticatedFetch("profile");

	// State to hold profile information
	const [profile, setProfile] = useState({
		user_id: "",
		name: "",
		email: "",
		phone_number: "",
	});

	// State to track if the profile is being edited
	const [isEditing, setIsEditing] = useState(false);

	// State to keep the original profile data for cancellation
	const [originalProfile, setOriginalProfile] = useState({});

	// Custom hook to handle not authenticated warning
	const { checkAuthentication } = useNotAuthenticatedWarning();

	// Effect to refetch profile data when the screen is focused
	useEffect(() => {
		if (isFocused) {
			refetch();
		}
	}, [isFocused, refetch]);

	// Effect to update the profile state when new data is fetched
	useEffect(() => {
		if (data) {
			setProfile(data);
			setOriginalProfile(data);
		}
	}, [data]);

	// Show loading indicator while data is being fetched
	if (loading) {
		return <ActivityIndicator size="large" color={colors.primary} />;
	}

	// Display error message if there was an error fetching data
	if (error) {
		return <Text>{error}</Text>;
	}

	// Function to handle canceling the edit operation
	const handleCancel = () => {
		setProfile(originalProfile);
		setIsEditing(false);
	};

	// Function to handle saving the updated profile
	const handleSave = async () => {
		try {
			const token = await AsyncStorage.getItem("access_token");
			checkAuthentication();

			// Send a PUT request to update the profile
			const response = await axios.put(`${config.apiUrl}/edit-profile`, profile, {
				headers: { Authorization: `Bearer ${token}` },
			});
			Alert.alert(null, response.data.message);
			setIsEditing(false);
		} catch (error) {
			console.log("Error response data:", error.response ? error.response.data : error.message);
			Alert.alert("Error", "Failed to update profile");
		}
	};

	// Function to handle user logout
	const handleLogout = async () => {
		try {
			checkAuthentication();

			// Remove token from storage and navigate to authentication screen
			await AsyncStorage.removeItem("access_token");

			navigation.replace("(auth)");
		} catch (error) {
			console.error("Logout Error:", error);
			Alert.alert("Error", "Failed to log out");
		}
	};

	// Function to handle account deletion
	const handleDeleteAccount = async (user_id) => {
		// Confirm deletion with the user
		Alert.alert(
			"Delete Account",
			"Are you sure you want to delete your account? This action cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					onPress: async () => {
						try {
							const token = await AsyncStorage.getItem("access_token");
							checkAuthentication();

							// Send a DELETE request to remove the account
							const response = await axios.delete(`${config.apiUrl}/profile/${user_id}`, {
								headers: {
									"Content-Type": "application/json",
									Authorization: `Bearer ${token}`,
								},
							});
							// Check for successful deletion
							if (response.status === 200) {
								await AsyncStorage.removeItem("access_token");
								Alert.alert("Account Deleted", "Your account has been deleted.");
								navigation.replace("(auth)");
							} else {
								Alert.alert("Error", "Failed to delete account.");
							}
						} catch (error) {
							console.error("Catch Error:", error.response ? error.response.data : error.message);
							Alert.alert("Error", "An unexpected error occurred.");
						}
					},
					style: "destructive", // Style for the delete button
				},
			],
			{ cancelable: true } // Allow cancellation of the alert
		);
	};

	return (
		<ScrollView contentContainerStyle={globalStyles.container}>
			{/* Input of the user's name */}
			<Text style={styles.inputTitle}>Name</Text>
			<TextInput
				value={profile.name}
				editable={isEditing}
				onChangeText={(text) => setProfile({ ...profile, name: text })}
				style={[
					{
						/* Change input style if the profile is being edited */
						borderColor: isEditing ? colors.text : colors.grey,
						color: isEditing ? colors.text : colors.darkGrey,
					},
					styles.input,
				]}
			/>

			{/* Input of the user's email */}
			<Text style={styles.inputTitle}>Email</Text>
			<TextInput
				value={profile.email}
				editable={isEditing}
				onChangeText={(text) => setProfile({ ...profile, email: text })}
				style={[
					{
						/* Change input style if the profile is being edited */
						borderColor: isEditing ? colors.text : colors.grey,
						color: isEditing ? colors.text : colors.darkGrey,
					},
					styles.input,
				]}
			/>

			{/* Input of the user's phone number */}
			<Text style={styles.inputTitle}>Phone number</Text>
			<TextInput
				value={profile.phone_number || ""}
				editable={isEditing}
				onChangeText={(text) => setProfile({ ...profile, phone_number: text })}
				style={[
					{
						/* Change input style if the profile is being edited */
						borderColor: isEditing ? colors.text : colors.grey,
						color: isEditing ? colors.text : colors.darkGrey,
					},
					styles.input,
				]}
			/>

			<View>
				{/* Buttons to cancel or save changes if profile is being edited */}
				{isEditing ? (
					<View style={styles.buttonPack}>
						<TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
							<Text style={styles.saveButtonText}>Save</Text>
						</TouchableOpacity>
					</View>
				) : (
					/* Button to start editing profile */
					<TouchableOpacity style={globalStyles.submitButton} onPress={() => setIsEditing(true)}>
						<Text style={globalStyles.submitButtonText}>Edit Profile</Text>
					</TouchableOpacity>
				)}
			</View>
			{isEditing ? null : (
				/* Buttons to sign out or delete user account */
				<View style={styles.redContainer}>
					<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
						<Text style={styles.logoutButtonText}>Sign out</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteAccount(profile.user_id)}>
						<Text style={styles.deleteButtonText}>Delete account</Text>
					</TouchableOpacity>
				</View>
			)}
		</ScrollView>
	);
};

export default ProfileScreen;

// Styles for the profile screen
const styles = StyleSheet.create({
	input: {
		borderBottomWidth: 1,
		marginBottom: 20,
	},
	buttonPack: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
		justifyContent: "flex-end",
	},
	cancelButton: {
		backgroundColor: "transparent",
		borderRadius: 8,
		marginTop: 30,
		borderWidth: 1,
		borderColor: colors.text,
	},
	cancelButtonText: {
		color: colors.text,
		margin: 10,
		textAlign: "center",
	},
	saveButton: {
		backgroundColor: colors.secondary,
		borderRadius: 8,
		marginTop: 30,
	},
	saveButtonText: {
		color: "white",
		margin: 10,
		textAlign: "center",
	},
	redContainer: {
		flex: 1,
		justifyContent: "flex-end",
	},
	logoutButton: {
		backgroundColor: colors.lightGrey,
		borderWidth: 1,
		borderColor: "red",
		paddingVertical: 8,
		marginTop: 10,
		borderRadius: 8,
	},
	logoutButtonText: {
		color: "red",
		textAlign: "center",
		fontWeight: "bold",
	},
	deleteButton: {
		backgroundColor: "red",
		paddingVertical: 8,
		marginTop: 10,
		borderRadius: 8,
	},
	deleteButtonText: {
		color: "white",
		textAlign: "center",
		fontWeight: "bold",
	},
});
