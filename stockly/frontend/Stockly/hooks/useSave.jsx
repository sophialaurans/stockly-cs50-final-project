import { Alert } from "react-native";
import axios from "axios";
import config from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

// Custom hook to save or update data for a specific entity
export const useSave = async (title, endpoint, id, formData, navigation, setLoading, setError) => {
	const { t } = useTranslation();
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
			Alert.alert(t("Success"), `${title} ${t("updated successfully")}`);
			navigation.goBack(); // Navigate back on success
		} else {
			Alert.alert(t("Error"), `${t("Failed to update")} ${title}`);
		}
	} catch (error) {
        setError(t("An unexpected error occurred"));
        Alert.alert(t("Error"), error);
	} finally {
		setLoading(false);
	}
};
