import { Alert } from "react-native";
import axios from "axios";
import config from "../constants/config";
import { getToken } from "./useAuth";

export const useRegister = async (type, formData, navigation, setLoading, setError) => {
    const { name, price, quantity, color, size, dimensions, description, email, phone_number } = formData;

    if (type === "product" && (!name || !price || !quantity)) {
        Alert.alert("Required Fields", "Please fill out all required product fields.");
        return;
    } else if (type === "client" && (!name)) {
        Alert.alert("Required Fields", "Please provide the client's name.");
        return;
    }

    setLoading(true);
    setError(null);

    try {
        const token = await getToken();

        const url = type === "product" 
            ? `${config.apiUrl}/register-product`
            : `${config.apiUrl}/register-client`;

        const payload = type === "product" 
            ? { name, color, size, dimensions, price, description, quantity }
            : { name, email, phone_number };

        const response = await axios.post(
            url,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 201) {
            Alert.alert("Success!", response.data.message);
            navigation.goBack();
        } else {
            Alert.alert("Error", "Unexpected response status, please try again");
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