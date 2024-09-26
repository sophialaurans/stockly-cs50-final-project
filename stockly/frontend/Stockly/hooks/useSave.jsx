import { Alert } from "react-native";
import axios from "axios";
import config from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom hook to save or update data for a specific entity
export const useSave = async (title, endpoint, id, formData, navigation, setLoading, setError) => {
	try {
		const token = await AsyncStorage.getItem("access_token");

        // Make PUT request to update the data for the specified entity
		const response = await axios.put(`${config.apiUrl}/${endpoint}/details/${id}`, formData, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		setLoading(true);
		setError(null);

		if (response.status === 200) {
			Alert.alert("Success!", `${title} updated successfully`);
			navigation.goBack(); // Navigate back on success
		} else {
			console.log("Error response:", response.data);
			Alert.alert("Error", `Failed to update ${title}`);
		}
	} catch (error) {
        setError("Error fetching data.");
        console.error("Error:", error.response ? error.response.data : error.message);
        Alert.alert("Error", "An unexpected error occurred.");
	} finally {
		setLoading(false);
	}
};
