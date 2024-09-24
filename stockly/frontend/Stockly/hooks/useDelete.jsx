import { Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../constants/config";
import { router } from "expo-router";

const useDelete = (setData, refetch) => {
	const handleDelete = async (id, dataName, endpoint ) => {
        Alert.alert(`Delete ${dataName}`, `Are you sure you want to delete this ${dataName}?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem("access_token");
    
                        if (!token) {
                            Alert.alert("Error", "No authentication token found.");
                            router.replace("/(auth)");
                            return;
                        }
    
                        const response = await axios.delete(`${config.apiUrl}/${endpoint}/${id}`, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        });
    
                        if (response.status === 200) {
                            setData((prevData) => prevData.filter((item) => item.id !== id));
                            Alert.alert("Success", `${dataName} deleted successfully`);
                            refetch();
                        } else {
                            console.log("Error response:", response.data);
                            Alert.alert("Error", `Failed to delete ${dataName}`);
                        }
                    } catch (error) {
                        console.log("Catch Error:", error.response ? error.response.data : error.message);
                        Alert.alert("Error", "An unexpected error occurred.");
                    }
                },
                style: "destructive",
            },
        ]);
    };

	return {
		handleDelete,
	};
};

export default useDelete;