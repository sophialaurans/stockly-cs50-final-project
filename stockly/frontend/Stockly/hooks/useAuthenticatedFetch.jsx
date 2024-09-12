import { useState, useCallback, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../constants/config";

const useAuthenticatedFetch = (endpoint) => {
	const navigation = useNavigation();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const token = await AsyncStorage.getItem("access_token");

			if (!token) {
				setError("Token not found");
				setLoading(false);
				navigation.replace("login");
				return;
			}

			const response = await axios.get(`${config.apiUrl}/${endpoint}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setData(response.data);
		} catch (error) {
			setError("Error fetching data.");
			console.error(
				"Error:",
				error.response ? error.response.data : error.message
			);
		} finally {
			setLoading(false);
		}
	}, [endpoint, navigation]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { data, loading, error, refetch: fetchData };
};

export default useAuthenticatedFetch;
