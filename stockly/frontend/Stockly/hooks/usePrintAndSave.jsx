import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../constants/config";
import colors from "../constants/colors";
import { useTranslation } from "react-i18next";
import { startActivityAsync } from "expo-intent-launcher";

// Custom hook for printing and saving order receipts
const usePrintAndSave = () => {
	const { t } = useTranslation();
	const [data, setData] = useState(null);
	const [loadingPrint, setLoadingPrint] = useState(false);
	const [error, setError] = useState(null);
	const [selectedPrinter, setSelectedPrinter] = useState(null);
	const [orderId, setOrderId] = useState(null);
	const [action, setAction] = useState(null);

	// Function to initiate receipt printing
	const printReceipt = async (order_id) => {
		setLoadingPrint(true);
		setOrderId(order_id);
		setAction("print");
		await fetchData(order_id);
	};

	// Function to initiate printing to a file
	const printToFile = async (order_id) => {
		setLoadingPrint(true);
		setOrderId(order_id);
		setAction("file");
		await fetchData(order_id);
	};

	// Function to fetch order data from the API
	const fetchData = async (order_id) => {
		try {
			const token = await AsyncStorage.getItem("access_token");
			const response = await axios.get(`${config.apiUrl}/orders/${order_id}/print`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setData(response.data);
		} catch (error) {
			setError(t("Error fetching data"));
		}
	};

	// Effect to handle printing action
	useEffect(() => {
		const handlePrintAction = async () => {
			if (data && orderId) {
				try {
					if (action === "print") {
						// HTML template for the printed receipt
						const receiptHtml = `
                        <html>
                            <head>
                                <style>
                                    @media print {
                                        @page {
                                            size: 80mm auto;
                                            margin: 10px;
                                        }
                                    }
                                    body { font-family: "Courier New", Courier, monospace; font-size: 16px; width: 90%; height: auto; margin: 0; padding: 30px; }
                                    h1 { text-align: center; font-size: 14px; }
                                    table { width: 100%; border-collapse: collapse; }
                                    th { font-size: 12px; font-weight: bold; padding: 4px; text-align: center; vertical-align: top; }
                                    td { font-size: 12px; padding: 4px; text-align: left; vertical-align: top; }
                                    td:last-child { text-align: right; }
                                    .total { text-align: right; font-weight: bold; padding-top: 8px; vertical-align: bottom; }
                                </style>
                            </head>
                            <body>
                                <h1>${t("Order Receipt")}</h1>
                                
                                <p>${t("Client")}: ${data.client_name}</p>
                                <p>${t("Seller")}: ${data.user_name}</p>
                                <p>${t("Date")}: ${new Date().toLocaleDateString()}</p>

                                <table>
                                    <thead>
                                        <tr>
                                            <th>ITEM</th>
                                            <th>QNT</th>
                                            <th>${t("PRICE")}</th>
                                            <th>TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${data.items
											.map(
												(item) => `
                                        <tr>
                                            <td>${item.product_name} ${item.product_size || ""}</td>
                                            <td>${item.quantity}</td>
                                            <td>${t('currency.symbol')}${item.price.toFixed(2)}</td>
                                            <td>${t('currency.symbol')}${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                        `
											)
											.join("")}
                                        <tr>
                                            <td colspan="3" class="total">${t("TOTAL PRICE")}</td>
                                            <td class="total">${t('currency.symbol')}${data.total_price.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </body>
                        </html>
                        `;
						// Execute printing
						await Print.printAsync({
							html: receiptHtml,
							printerUrl: selectedPrinter?.url, // Use the selected printer's URL
						});
					} else if (action === "file") {
						// HTML template for the PDF file
						const pdfHtml = `
                            <html>
                                <head>
                                    <style>
                                        body {
                                            font-family: Arial, sans-serif;
                                            margin: 20px;
                                        }
                                        table {
                                            width: 100%;
                                            border-collapse: collapse;
                                            margin-bottom: 20px;
                                        }
                                        table, th, td {
                                            border: 1px solid black;
                                            text-align: left;
                                        }
                                        th {
                                            background-color: ${colors.primary};
                                            color: white;
                                            padding: 10px;
                                        }
                                        td {
                                            padding: 10px;
                                            background-color: #FFFFFF;
                                        }
                                        tr:nth-child(even) td {
                                            background-color: #F2F2F2;
                                        }
                                        h1 {
                                            text-align: center;
                                            font-size: 24px;
                                            margin-bottom: 20px;
                                        }
                                        .total-row {
                                            font-weight: bold;
                                            background-color: ${colors.secondary};
                                        }
                                        .right-align {
                                            text-align: right;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <h1>${t("Order Receipt")}</h1>
                                    
                                    <p><strong>${t("Client")}:</strong> ${data.client_name}</p>
                                    <p><strong>${t("Seller")}:</strong> ${data.user_name}</p>
                                    <p><strong>${t("Order ID")}:</strong> ${data.order_id}</p>
                                    <p><strong>${t("Date")}:</strong> ${new Date().toLocaleDateString()}</p>

                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Item</th>
                                                <th>Quantity</th>
                                                <th>${t("Price")}</th>
                                                <th>Total</th>
                                            </tr>
                                            ${data.items
												.map(
													(item) => `
                                            <tr>
                                                <td>${item.product_name} ${item.product_size || ""}</td>
                                                <td>${item.quantity}</td>
                                                <td>${t('currency.symbol')}${item.price.toFixed(2)}</td>
                                                <td>${t('currency.symbol')}${(item.price * item.quantity).toFixed(2)}</td>
                                            </tr>
                                            `
												)
												.join("")}
                                            <tr class="total-row">
                                                <td colspan="3" class="right-align">TOTAL</td>
                                                <td>${t('currency.symbol')}${data.total_price.toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </body>
                            </html>

                        `;
						// Create a PDF file from HTML
						const { uri } = await Print.printToFileAsync({ html: pdfHtml });
						await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" }); // Share the generated PDF
					}
				} catch (error) {
                    Alert.alert(t("Error"), error);
				} finally {
					setLoadingPrint(false);
					setData(null);
					setOrderId(null);
					setAction(null);
				}
			}
		};

		handlePrintAction(); // Execute the print action if conditions are met
	}, [data, orderId, action, selectedPrinter]);

	// Function to select a printer
	const selectPrinter = async () => {
		try {
			const printer = await Print.selectPrinterAsync(); // iOS only
			setSelectedPrinter(printer);
		} catch (error) {
            Alert.alert(t("Error"), error);
		}
	};

	return {
		printReceipt,
		printToFile,
		selectPrinter,
		selectedPrinter,
		loadingPrint,
		setLoadingPrint,
	};
};

export default usePrintAndSave;
