import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useRegister } from "./useRegister";
import { useSave } from "./useSave";
import useNotAuthenticatedWarning from "./useNotAuthenticatedWarning";
import axios from "axios";
import config from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom hook for managing client data
const useClient = (client_id = null) => {
	const route = useRoute(); // Access current route
	const { client } = route.params || {}; // Get client data from route parameters

	// If client is provided, set client_id
	if (client) {
		client_id = client.client_id;
	}

	// Initial form state
	const initialFormState = {
		name: client?.name || "",
		phone_number: client?.phone_number || "",
		email: client?.email || "",
	};

	// State variables for form data and loading/error status
	const [formState, setFormState] = useState(initialFormState);
	const [isFormInitialized, setIsFormInitialized] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Get authentication check from the custom hook
	const { checkAuthentication } = useNotAuthenticatedWarning();

	// Effect to fetch client data on mount or when client_id changes
	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = await AsyncStorage.getItem("access_token");
				checkAuthentication();

				// Fetch client details if client_id exists and form isn't initialized
				if (client_id && !isFormInitialized) {
					await axios
						.get(`${config.apiUrl}/clients/details/${client_id}`, {
							headers: { Authorization: `Bearer ${token}` },
						})
						.then((response) => {
							setFormState(response.data);
							setIsFormInitialized(true);
						});
				} else if (!client_id) {
					checkAuthentication();
				}
			} catch (error) {
				console.error("Error fetching data:", error.message);
				setError("An unexpected error occurred while fetching data.");
			}
		};

		fetchData();
	}, [client_id]);

	// Handle input changes
	const handleInputChange = (name, value) => {
		setFormState((prevState) => ({ ...prevState, [name]: value }));
	};

	// Handle client registration using a custom hook
	const handleRegister = async (navigation) => {
		try {
			await useRegister("client", formState, navigation, setLoading, setError);
		} catch (error) {
			console.error("Error during registration:", error);
		}
	};

	// Handle saving client data using a custom hook
	const handleSave = async (navigation) => {
		try {
			await useSave("Client", "clients", client_id, formState, navigation, setLoading, setError);
		} catch (error) {
			console.error("Error during save:", error);
		}
	};

	return {
		formState,
		handleInputChange,
		handleRegister,
		handleSave,
		loading,
		error,
	};
};

export default useClient;
