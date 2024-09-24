import { Alert } from "react-native";
import axios from "axios";
import config from "../constants/config";
import { getToken } from "./useAuth";

export const useSave = async (title, endpoint, id, formData, navigation, setLoading, setError) => {
	try {
		const token = await getToken();
		const response = await axios.put(`${config.apiUrl}/${endpoint}/details/${id}`, formData, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		setLoading(true);
		setError(null);

		if (response.status === 200) {
			Alert.alert("Success", `${title} updated successfully`);
			navigation.goBack();
		} else {
			console.log("Error response:", response.data);
			Alert.alert("Error", `Failed to update ${title}`);
		}
	} catch (error) {
		if (error.message === "Token not found") {
			navigation.replace("(auth)");
		} else {
			setError("Error fetching data.");
			console.error("Error:", error.response ? error.response.data : error.message);
			Alert.alert("Error", "An unexpected error occurred.");
		}
	} finally {
		setLoading(false);
	}
};
