import { Alert } from "react-native";
import axios from "axios";
import config from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIntl } from "react-intl";

// Custom hook to save or update data for a specific entity
export const useSave = () => {
	const intl = useIntl();

    const save = async (title, endpoint, id, formData, navigation, setLoading, setError) => {
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
                Alert.alert(intl.formatMessage({ id: "Success"}), `${title} ${intl.formatMessage({ id: "updated successfully"})}`);
            } else {
                Alert.alert(intl.formatMessage({ id: "Error"}), `${intl.formatMessage({ id: "Failed to update"})} ${title}`);
            }
        } catch (error) {
            setError(intl.formatMessage({ id: "An unexpected error occurred"}));
            Alert.alert(intl.formatMessage({ id: "Error"}), error);
        } finally {
            setLoading(false);
            navigation.goBack(); // Navigate back on success
        }
    };
    
    return { save }
};
