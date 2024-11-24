import { Alert } from "react-native";
import axios from "axios";
import config from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIntl } from "react-intl";

// Custom hook to handle deletion of data
const useDelete = (setData, refetch) => {
	const intl = useIntl();
    // Function to handle the delete action
	const handleDelete = async (id, dataName, endpoint) => {
		// Confirm deletion with the user
		Alert.alert(`${intl.formatMessage({ id: "Delete"})} ${dataName}`, `${intl.formatMessage({ id: "Are you sure you want to delete this"})} ${dataName}?`, [
			{ text: intl.formatMessage({ id: "Cancel"}), style: "cancel" }, // Cancel button
			{
				text: intl.formatMessage({ id: "Delete"}), // Delete button
				onPress: async () => {
					try {
						const token = await AsyncStorage.getItem("access_token");

						// Make DELETE request to remove the specified data
						const response = await axios.delete(`${config.apiUrl}/${endpoint}/${id}`, {
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
						});

						if (response.status === 200) {
							// Update local data by filtering out the deleted item
							setData((prevData) => prevData.filter((item) => item.id !== id));
							Alert.alert(intl.formatMessage({ id: "Success"}), `${dataName} ${intl.formatMessage({ id: "deleted successfully"})}`);
							refetch(); // Refetch data to update the view
						} else {
							Alert.alert(intl.formatMessage({ id: "Error"}), `${intl.formatMessage({ id: "Failed to delete"})} ${dataName}`);
						}
					} catch (error) {
						Alert.alert(intl.formatMessage({ id: "Error"}), intl.formatMessage({ id: "An unexpected error occurred"}));
					}
				},
				style: "destructive", // Style for delete button
			},
		]);
	};

	return {
		handleDelete,
	};
};

export default useDelete;
