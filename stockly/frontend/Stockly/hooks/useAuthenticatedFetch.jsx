import { useState, useCallback, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import config from "../constants/config";
import { getToken } from "./useAuth";

const useAuthenticatedFetch = (endpoint) => {
	const navigation = useNavigation();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const token = await getToken();
			const response = await axios.get(`${config.apiUrl}/${endpoint}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setData(response.data);
		} catch (error) {
            if (error.message === "Token not found" || error.message === "Error retrieving token") {
                navigation.replace("(auth)");
            } else {
                setError("Error fetching data.");
			    console.error("Error:", error.response ? error.response.data : error.message);
            }
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
