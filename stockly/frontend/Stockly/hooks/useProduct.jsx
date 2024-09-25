import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useRegister } from "./useRegister";
import { useSave } from "./useSave";
import useNotAuthenticatedWarning from "./useNotAuthenticatedWarning";
import axios from "axios";
import config from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom hook for managing product data
const useProduct = (product_id = null) => {
	const route = useRoute(); // Access current route
	const { product } = route.params || {}; // Get product data from route parameters

	// If product is provided, set product_id
	if (product) {
		product_id = product.product_id;
	}

	// Initial form state
	const initialFormState = {
		name: product?.name || "",
		size: product?.size || "",
		color: product?.color || "",
		dimensions: product?.dimensions || "",
		price: product?.price || "",
		description: product?.description || "",
		quantity: product?.quantity || "",
	};

	// State variables for form data and loading/error status
	const [formState, setFormState] = useState(initialFormState);
	const [isFormInitialized, setIsFormInitialized] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Get authentication check from the custom hook
	const { checkAuthentication } = useNotAuthenticatedWarning();

	// Effect to fetch product data on mount or when product_id changes
	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = await AsyncStorage.getItem("access_token");
				checkAuthentication();

				// Fetch product details if product_id exists and form isn't initialized
				if (product_id && !isFormInitialized) {
					await axios
						.get(`${config.apiUrl}/products/details/${product_id}`, {
							headers: { Authorization: `Bearer ${token}` },
						})
						.then((response) => {
							setFormState(response.data);
							setIsFormInitialized(true);
						});
				} else if (!product_id) {
					checkAuthentication();
				}
			} catch (error) {
				console.error("Error fetching data:", error.message);
				setError("An unexpected error occurred while fetching data.");
			}
		};

		fetchData();
	}, [product_id]);

	// Handle input changes
	const handleInputChange = (name, value) => {
		setFormState((prevState) => ({ ...prevState, [name]: value }));
	};

	// Handle product registration using a custom hook
	const handleRegister = async (navigation) => {
		try {
			await useRegister("product", formState, navigation, setLoading, setError);
		} catch (error) {
			console.error("Error during registration:", error);
		}
	};

	// Handle saving product data using a custom hook
	const handleSave = async (navigation) => {
		try {
			await useSave("Product", "products", product_id, formState, navigation, setLoading, setError);
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

export default useProduct;
