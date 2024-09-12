import { useState, useEffect } from "react";
import { Alert } from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../constants/config";

const useOrder = (order_id = null) => {
	const route = useRoute();
	const { order } = route.params || {};
	const [clients, setClients] = useState([]);
	const [products, setProducts] = useState([]);
	const [formState, setFormState] = useState({
		selectedClient: order?.client_id || "",
		selectedProduct: "",
		quantity: "",
	});
	const [items, setItems] = useState(order?.items || []);
	const [totalPrice, setTotalPrice] = useState(order?.total_price || 0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = await AsyncStorage.getItem("access_token");
				if (!token) {
					Alert.alert("Error", "No authentication token found.");
					return;
				}

				const [clientsResponse, productsResponse] = await Promise.all([
					axios.get(`${config.apiUrl}/clients`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
					axios.get(`${config.apiUrl}/products`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
				]);

				setClients(clientsResponse.data);
				setProducts(productsResponse.data);

				if (order_id) {
					const orderResponse = await axios.get(
						`${config.apiUrl}/orders/${order_id}`,
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);

					const { items: orderItems, total_price } =
						orderResponse.data;
					setItems(orderItems);
					setTotalPrice(total_price);
				}
			} catch (error) {
				console.error("Error fetching data:", error.message);
				setError("An unexpected error occurred while fetching data.");
			}
		};

		fetchData();
	}, [order_id]);

	const handleInputChange = (name, value) => {
		setFormState((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleAddItem = () => {
		const { selectedProduct, quantity } = formState;

		if (!selectedProduct || !quantity || isNaN(quantity) || quantity <= 0) {
			Alert.alert(
				"Validation Error",
				"Please select a product and enter a valid quantity."
			);
			return;
		}

		const product = products.find(
			(p) => p.product_id.toString() === selectedProduct.toString()
		);
		if (!product) {
			Alert.alert("Product Error", "Selected product is not valid.");
			return;
		}

		setItems((prevItems) => {
			const updatedItems = [...prevItems];
			const existingItemIndex = updatedItems.findIndex(
				(item) =>
					item.product_id.toString() === selectedProduct.toString()
			);

			if (existingItemIndex !== -1) {
				const existingItem = updatedItems[existingItemIndex];
				const newQuantity =
					existingItem.quantity + parseInt(quantity, 10);
				const newTotal = product.price * newQuantity;

				updatedItems[existingItemIndex] = {
					...existingItem,
					quantity: newQuantity,
					total: newTotal,
				};
				setTotalPrice(
					(prevTotal) =>
						prevTotal + product.price * parseInt(quantity, 10)
				);
			} else {
				const newItem = {
					product_id: selectedProduct,
					product_name: product.name,
					product_size: product.size,
					quantity: parseInt(quantity, 10),
					price: product.price,
					total: product.price * parseInt(quantity, 10),
				};

				updatedItems.push(newItem);
				setTotalPrice((prevTotal) => prevTotal + newItem.total);
			}

			return updatedItems;
		});

		handleInputChange("quantity", "");
	};

	const handleDeleteItem = (product_id) => {
		Alert.alert(
			"Delete Confirmation",
			"Are you sure you want to delete this item?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					onPress: () => {
						setItems((prevItems) => {
							const updatedItems = prevItems.filter(
								(item) => item.product_id !== product_id
							);
							const deletedItem = prevItems.find(
								(item) => item.product_id === product_id
							);
							if (deletedItem) {
								setTotalPrice(
									(prevTotal) => prevTotal - deletedItem.total
								);
							}
							return updatedItems;
						});
					},
					style: "destructive",
				},
			]
		);
	};

	const handleSubmitOrder = async (navigation) => {
		const { selectedClient } = formState;

		if (!selectedClient || items.length === 0) {
			Alert.alert(
				"Validation Error",
				"Please select a client and add at least one item."
			);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const token = await AsyncStorage.getItem("access_token");
			if (!token) {
				Alert.alert("Error", "No authentication token found.");
				navigation.replace("login");
				return;
			}

			const response = await axios.post(
				`${config.apiUrl}/new-order`,
				{
					client_id: selectedClient,
					items: items.map((item) => ({
						product_id: item.product_id,
						quantity: item.quantity,
						price: item.price,
					})),
					status: "pending",
					total_price: totalPrice,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 201) {
				Alert.alert("Success!", "Order placed successfully");
				setItems([]);
				setTotalPrice(0);
				handleInputChange("selectedClient", "");
				navigation.goBack();
			} else {
				Alert.alert(
					"Error",
					"Unexpected response status, please try again"
				);
			}
		} catch (error) {
			console.error("Error:", error.message);
			console.error("Error Response:", error.response?.data);
			setError("An unexpected error occurred.");
			Alert.alert("Error", "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async (navigation) => {
		const { selectedClient } = formState;

		if (!selectedClient || items.length === 0) {
			Alert.alert(
				"Validation Error",
				"Please select a client and add at least one item."
			);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const token = await AsyncStorage.getItem("access_token");
			if (!token) {
				Alert.alert("Error", "No authentication token found.");
				navigation.replace("login");
				return;
			}

			const response = await axios.put(
				`${config.apiUrl}/orders/details/${order.order_id}`,
				{
					client_id: selectedClient,
					items: items.map((item) => ({
						product_id: item.product_id,
						quantity: item.quantity,
						price: item.price,
					})),
					status: "pending",
					total_price: totalPrice,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				Alert.alert("Success!", "Order saved successfully");
				setItems([]);
				setTotalPrice(0);
				handleInputChange("selectedClient", "");
				navigation.goBack();
			} else {
				Alert.alert(
					"Error",
					"Unexpected response status, please try again"
				);
			}
		} catch (error) {
			console.error("Error:", error.message);
			console.error("Error Response:", error.response?.data);
			setError("An unexpected error occurred.");
			Alert.alert("Error", "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	return {
		clients,
		products,
		formState,
		items,
		totalPrice,
		loading,
		error,
		setItems,
		setTotalPrice,
		handleInputChange,
		handleAddItem,
		handleDeleteItem,
		handleSubmitOrder,
		handleSave,
	};
};

export default useOrder;
