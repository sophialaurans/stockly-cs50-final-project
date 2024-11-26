import { Alert } from "react-native";
import axios from "axios";
import config from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIntl } from "react-intl";

// Custom hook for registering products or clients
export const useRegister = () => {
	const intl = useIntl();

    const register = async (title, type, formData, navigation, setLoading, setError) => {
        // Destructure form data based on type
        const { name, price, quantity, color, size, dimensions, description, email, phone_number } = formData;

        // Validate required fields for product or client registration
        if (type === "product" && (!name || !price || !quantity)) {
            Alert.alert(intl.formatMessage({ id: "Required Fields"}), intl.formatMessage({ id: "Product name price and quantity are required"}));
            return;
        } else if (type === "client" && !name) {
            Alert.alert(intl.formatMessage({ id: "Required Fields"}), intl.formatMessage({ id: "Client name is required"}));
            return;
        } else if (type === "product" && !Number.isInteger(product)) {
            Alert.alert(intl.formatMessage({ id: "Error" }), intl.formatMessage({ id: "Product must be an integer"}));
            return;
        }

        // Set loading state and reset error state
        setLoading(true);
        setError(null);

        try {
            const token = await AsyncStorage.getItem("access_token");
            // Determine the correct URL based on registration type
            const url =
                type === "product"
                    ? `${config.apiUrl}/products/register-product`
                    : `${config.apiUrl}/clients/register-client`;

            // Prepare payload based on registration type
            const payload =
                type === "product"
                    ? { name, color, size, dimensions, price, description, quantity }
                    : { name, email, phone_number };

            // Make POST request to register the product or client
            const response = await axios.post(url, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                Alert.alert(intl.formatMessage({ id: "Success"}), `${title} ${intl.formatMessage({ id: "registered successfully"})}`);
            } else {
                Alert.alert(intl.formatMessage({ id: "Error"}), intl.formatMessage({ id: "Unexpected response status"}));
            }
        } catch (error) {
            setError(intl.formatMessage({ id: "Error fetching data"}));
            Alert.alert(intl.formatMessage({ id: "Error"}), intl.formatMessage({ id: "An unexpected error occurred"}));
        } finally {
            setLoading(false); // Reset loading state
            navigation.goBack();
        }
    };
    
    return { register };
};
