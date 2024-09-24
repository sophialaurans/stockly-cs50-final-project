import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import useAuthenticatedFetch from "./useAuthenticatedFetch";
import { useRegister } from "./useRegister";
import { useSave } from "./useSave";
import useNotAuthenticatedWarning from "./useNotAuthenticatedWarning";
import axios from "axios";
import config from "../constants/config";
import { getToken } from "./useAuth";

const useClient = (client_id = null) => {
	const route = useRoute();
	const { client } = route.params || {};

	if (client) {
		client_id = client.client_id;
	}

	const initialFormState = {
		name: client?.name || "",
		phone_number: client?.phone_number || "",
		email: client?.email || ""
	};

	const [formState, setFormState] = useState(initialFormState);
    const [isFormInitialized, setIsFormInitialized] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const { checkAuthentication } = useNotAuthenticatedWarning();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = await getToken();
				
				if (client_id && !isFormInitialized) {
                    const data = await axios.get(
						`${config.apiUrl}/clients/details/${client_id}`,
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
                    setFormState(data);
                    setIsFormInitialized(true);
				} else if (!client_id) {
					checkAuthentication();
				}
			} catch (error) {
				if (error.message === "Token not found" || error.message === "Error retrieving token") {
					navigation.replace("(auth)");
				} else {
					console.error("Error fetching data:", error.message);
					setError("An unexpected error occurred while fetching data.");
				}
			}
		};

		fetchData();
	}, [client_id]);

	const handleInputChange = (name, value) => {
		setFormState((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleRegister = async (navigation) => {
		try {
			await useRegister("client", formState, navigation, setLoading, setError);
		} catch (error) {
			console.error("Error during registration:", error);
		}
	};

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
