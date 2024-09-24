import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useRegister } from "./useRegister";
import { useSave } from "./useSave";
import useNotAuthenticatedWarning from "./useNotAuthenticatedWarning";
import axios from "axios";
import config from "../constants/config";
import { getToken } from "./useAuth";

const useProduct = (product_id = null) => {
	const route = useRoute();
	const { product } = route.params || {};

	if (product) {
		product_id = product.product_id;
	}

	const initialFormState = {
		name: product?.name || "",
		size: product?.size || "",
		color: product?.color || "",
		dimensions: product?.dimensions || "",
		price: product?.price || "",
		description: product?.description || "",
		quantity: product?.quantity || "",
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
				
				if (product_id && !isFormInitialized) {
                    const data = await axios.get(
						`${config.apiUrl}/products/details/${product_id}`,
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
                    setFormState(data);
                    setIsFormInitialized(true);
				} else if (!product_id) {
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
	}, [product_id]);

	const handleInputChange = (name, value) => {
		setFormState((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleRegister = async (navigation) => {
		try {
			await useRegister("product", formState, navigation, setLoading, setError);
		} catch (error) {
			console.error("Error during registration:", error);
		}
	};

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
