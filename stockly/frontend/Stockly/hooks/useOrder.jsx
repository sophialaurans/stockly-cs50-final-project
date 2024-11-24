import { useState, useEffect } from "react";
import { Alert } from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import config from "../constants/config";
import useNotAuthenticatedWarning from "./useNotAuthenticatedWarning";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIntl } from "react-intl";

// Custom hook for handling order functionality
const useOrder = (order_id = null) => {
	const intl = useIntl();
	const navigation = useNavigation();

	const route = useRoute(); // Hook to access route parameters
	const { order } = route.params || {}; // Destructure order from route parameters

	// States to store clients and products
	const [clients, setClients] = useState([]);
	const [products, setProducts] = useState([]);

	// State to manage form inputs
	const [formState, setFormState] = useState({
		selectedClient: order?.client_id || "",
		selectedProduct: "",
		quantity: "",
	});

	// State to manage order items
	const [items, setItems] = useState(order?.items || []);

	// State for total price
	const [totalPrice, setTotalPrice] = useState(order?.total_price || 0);

	// State variables for loading/error status
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// If order is provided, set the order_id
	if (order) {
		order_id = order.order_id;
	}

	// Function to check authentication
	const { checkAuthentication } = useNotAuthenticatedWarning();

	// Fetch data when the component mounts or order_id changes
	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = await AsyncStorage.getItem("access_token");
				checkAuthentication();

				// Fetch clients and products
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

				// If an order ID exists, fetch the order details
				if (order_id) {
					await axios
						.get(`${config.apiUrl}/orders/details/${order_id}`, {
							headers: { Authorization: `Bearer ${token}` },
						})
						.then((response) => {
							const { items: orderItems, total_price } = response.data;
							setItems(orderItems);
							setTotalPrice(total_price);
						});
				} else if (!order_id) {
					checkAuthentication();
				}
			} catch (error) {
				setError(intl.formatMessage({ id: "An unexpected error occurred"}));
			}
		};

		fetchData();
	}, [order_id]);

	// Function to handle input changes in the form
	const handleInputChange = (name, value) => {
		setFormState((prevState) => ({ ...prevState, [name]: value }));
	};

	// Function to add item to the order
	const handleAddItem = () => {
		const { selectedProduct, quantity } = formState;

		// Validate input fields
		if (!selectedProduct || !quantity || isNaN(quantity) || quantity <= 0) {
			Alert.alert(intl.formatMessage({ id: "Validation Error"}), intl.formatMessage({ id: "Please select a product and enter a valid quantity"}));
			return;
		}

		// Find the selected product in the products list
		const product = products.find((p) => p.product_id.toString() === selectedProduct.toString());
		if (!product) {
			Alert.alert(intl.formatMessage({ id: "Product Error"}), intl.formatMessage({ id: "Selected product is not valid."}));
			return;
		}

		// Update items state
		setItems((prevItems) => {
			const updatedItems = [...prevItems];
			const existingItemIndex = updatedItems.findIndex(
				(item) => item.product_id.toString() === selectedProduct.toString()
			);

			// If item exists, update its quantity and total
			if (existingItemIndex !== -1) {
				const existingItem = updatedItems[existingItemIndex];
				const newQuantity = existingItem.quantity + parseInt(quantity, 10);
				const newTotal = product.price * newQuantity;

				updatedItems[existingItemIndex] = {
					...existingItem,
					quantity: newQuantity,
					total: newTotal,
				};
				setTotalPrice((prevTotal) => prevTotal + product.price * parseInt(quantity, 10));
			} else {
				// If item doesn't exist, create a new item
				const newItem = {
					product_id: selectedProduct,
					product_name: product.name,
					product_size: product.size,
					quantity: parseInt(quantity, 10),
					price: product.price,
					total: product.price * parseInt(quantity, 10),
				};

				updatedItems.push(newItem); // Add new item to the list
				setTotalPrice((prevTotal) => prevTotal + newItem.total); // Update total price
			}

			return updatedItems; // Return updated items
		});

		handleInputChange("quantity", ""); // Reset quantity input
	};

	// Function to delete an item from the order
	const handleDeleteItem = (product_id) => {
		setItems((prevItems) => {
			// Filter out and find the deleted item
			const updatedItems = prevItems.filter((item) => item.product_id !== product_id);
			const deletedItem = prevItems.find((item) => item.product_id === product_id);

			if (deletedItem) {
				// Update total price
				setTotalPrice((prevTotal) => prevTotal - deletedItem.total);
			}
			return updatedItems; // Return updated items
		});
	};

	// Function to submit the order
	const handleSubmitOrder = async (navigation) => {
		// Destructure selected client from form state
		const { selectedClient } = formState;

		// Validate input fields
		if (!selectedClient || items.length === 0) {
			Alert.alert(intl.formatMessage({ id: "Validation Error"}), intl.formatMessage({ id: "Please select a client and add at least one item"}));
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const token = await AsyncStorage.getItem("access_token");

			// Make API call to submit the new order
			const response = await axios.post(
				`${config.apiUrl}/orders/new-order`,
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
				Alert.alert(intl.formatMessage({ id: "Success"}), intl.formatMessage({ id: "Order placed successfully"}));
				setItems([]); // Reset items
				setTotalPrice(0); // Reset total price
				handleInputChange("selectedClient", ""); // Reset selected client
				navigation.goBack(); // Navigate back
			} else {
				Alert.alert(intl.formatMessage({ id: "Error"}), intl.formatMessage({ id: "Unexpected response status"}));
			}
		} catch (error) {
			setError(intl.formatMessage({ id: "An unexpected error occurred"}));
			Alert.alert(intl.formatMessage({ id: "Error"}), error);
		} finally {
			setLoading(false);
		}
	};

	// Save existing order
	const handleSaveOrder = async (navigation) => {
		const { selectedClient } = formState;

		// Validate order saving
		if (!selectedClient || items.length === 0) {
			Alert.alert(intl.formatMessage({ id: "Validation Error"}), intl.formatMessage({ id: "Please select a client and add at least one item."}));
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const token = await AsyncStorage.getItem("access_token");

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
				Alert.alert(intl.formatMessage({ id: "Success"}), intl.formatMessage({ id: "Order updated successfully"}));
				setItems([]); // Reset items
				setTotalPrice(0); // Reset total price
				handleInputChange("selectedClient", ""); // Reset selected client
				navigation.goBack(); // Navigate back
			} else {
				Alert.alert(intl.formatMessage({ id: "Error"}), intl.formatMessage({ id: "Unexpected response status"}));
			}
		} catch (error) {
			setError(intl.formatMessage({ id: "An unexpected error occurred"}));
			Alert.alert(intl.formatMessage({ id: "Error"}), error);
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
		handleSaveOrder,
	};
};

export default useOrder;
