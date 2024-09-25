import { Alert } from "react-native";
import axios from "axios";
import config from "../constants/config";
import useNotAuthenticatedWarning from "./useNotAuthenticatedWarning";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom hook to handle deletion of data
const useDelete = (setData, refetch) => {
	// Get authentication check
	const { checkAuthentication } = useNotAuthenticatedWarning();

	// Function to handle the delete action
	const handleDelete = async (id, dataName, endpoint) => {
		// Confirm deletion with the user
		Alert.alert(`Delete ${dataName}`, `Are you sure you want to delete this ${dataName}?`, [
			{ text: "Cancel", style: "cancel" }, // Cancel button
			{
				text: "Delete", // Delete button
				onPress: async () => {
					try {
						const token = await AsyncStorage.getItem("access_token");
						checkAuthentication();

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
							Alert.alert("Success", `${dataName} deleted successfully`);
							refetch(); // Refetch data to update the view
						} else {
							console.log("Error response:", response.data);
							Alert.alert("Error", `Failed to delete ${dataName}`);
						}
					} catch (error) {
						console.log("Catch Error:", error.response ? error.response.data : error.message);
						Alert.alert("Error", "An unexpected error occurred.");
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
