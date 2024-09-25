import { useState, useCallback, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import config from "../constants/config";
import useNotAuthenticatedWarning from "./useNotAuthenticatedWarning";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom hook for authenticated API fetching
const useAuthenticatedFetch = (endpoint) => {
	const navigation = useNavigation();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Custom hook to handle not authenticated warning
	const { checkAuthentication } = useNotAuthenticatedWarning();

	// Function to fetch data from the API
	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const token = await AsyncStorage.getItem("access_token");
			checkAuthentication();

			// Make the API request using Axios with the retrieved token
			const response = await axios.get(`${config.apiUrl}/${endpoint}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// Update the data state with the response data
			setData(response.data);
		} catch (error) {
			// For other errors, set the error state and log the error
			setError("Error fetching data.");
			console.error("Error:", error.response ? error.response.data : error.message);
		} finally {
			setLoading(false); // Set loading state to false after fetch attempt
		}
	}, [endpoint, navigation]);

	// useEffect to fetch data when the component mounts or the endpoint changes
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Return the fetched data, loading state, error state, and a refetch function
	return { data, loading, error, refetch: fetchData };
};

export default useAuthenticatedFetch;
