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
import { StatusBar } from "expo-status-bar";

const ProfileScreen = () => {
	const navigation = useNavigation();
	const isFocused = useIsFocused();

	const { data, loading, error, refetch } = useAuthenticatedFetch("profile");

	const [profile, setProfile] = useState({
		user_id: "",
		name: "",
		email: "",
		phone_number: "",
	});
	const [isEditing, setIsEditing] = useState(false);
	const [originalProfile, setOriginalProfile] = useState({});

	useEffect(() => {
		if (isFocused) {
			refetch();
		}
	}, [isFocused, refetch]);

	useEffect(() => {
		if (data) {
			setProfile(data);
			setOriginalProfile(data);
		}
	}, [data]);

	if (loading) {
		return <ActivityIndicator size="large" color={colors.primary} />;
	}

	if (error) {
		return <Text>{error}</Text>;
	}

	const handleCancel = () => {
		setProfile(originalProfile);
		setIsEditing(false);
	};

	const handleSave = async () => {
		try {
			const token = await AsyncStorage.getItem("access_token");

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

	const handleLogout = async () => {
		try {
			const token = await AsyncStorage.getItem("access_token");
			if (!token) {
				Alert.alert("Error", "No token found");
				return;
			}

			await AsyncStorage.removeItem("access_token");

			navigation.replace("(auth)");
		} catch (error) {
			console.error("Logout Error:", error);
			Alert.alert("Error", "Failed to log out");
		}
	};

	const handleDeleteAccount = async (user_id) => {
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

							if (!token) {
								Alert.alert("Error", "No authentication token found.");
								navigation.replace("(auth)");
								return;
							}

							const response = await axios.delete(`${config.apiUrl}/profile/${user_id}`, {
								headers: {
									"Content-Type": "application/json",
									Authorization: `Bearer ${token}`,
								},
							});

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
					style: "destructive",
				},
			],
			{ cancelable: true }
		);
	};

	return (
		<ScrollView contentContainerStyle={globalStyles.container}>
			<StatusBar style="dark" backgroundColor={colors.background} />
			<Text style={styles.inputTitle}>Name</Text>
			<TextInput
				value={profile.name}
				editable={isEditing}
				onChangeText={(text) => setProfile({ ...profile, name: text })}
				style={[
					{
						borderColor: isEditing ? colors.text : colors.grey,
						color: isEditing ? colors.text : colors.darkGrey,
					},
					styles.input,
				]}
			/>
			<Text style={styles.inputTitle}>Email</Text>
			<TextInput
				value={profile.email}
				editable={isEditing}
				onChangeText={(text) => setProfile({ ...profile, email: text })}
				style={[
					{
						borderColor: isEditing ? colors.text : colors.grey,
						color: isEditing ? colors.text : colors.darkGrey,
					},
					styles.input,
				]}
			/>
			<Text style={styles.inputTitle}>Phone number</Text>
			<TextInput
				value={profile.phone_number || ""}
				editable={isEditing}
				onChangeText={(text) => setProfile({ ...profile, phone_number: text })}
				style={[
					{
						borderColor: isEditing ? colors.text : colors.grey,
						color: isEditing ? colors.text : colors.darkGrey,
					},
					styles.input,
				]}
			/>
			<View>
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
					<TouchableOpacity style={globalStyles.submitButton} onPress={() => setIsEditing(true)}>
						<Text style={globalStyles.submitButtonText}>Edit Profile</Text>
					</TouchableOpacity>
				)}
			</View>
			{isEditing ? null : (
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
