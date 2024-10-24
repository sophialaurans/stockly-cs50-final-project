import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../constants/config";
import colors from "../constants/colors";
import { useTranslation } from "react-i18next";
import BluetoothEscposPrinter from "react-native-bluetooth-escpos-printer";

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
                        try {
                            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                            await BluetoothEscposPrinter.setBlob(0);
                            await BluetoothEscposPrinter.printText(`${t("Order Receipt")}\n\r`, {
                                encoding: 'GBK',
                                codepage: 0,
                                widthtimes: 1,
                                heigthtimes: 1,
                                fonttype: 1
                            });
                    
                            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
                            await BluetoothEscposPrinter.printText(`${t("Client")}: ${data.client_name}\n\r`, {});
                            await BluetoothEscposPrinter.printText(`${t("Seller")}: ${data.user_name}\n\r`, {});
                            await BluetoothEscposPrinter.printText(`${t("Date")}: ${new Date().toLocaleDateString()}\n\r`, {});
                    
                            await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
                    
                            const columnWidths = [16, 6, 10, 10];
                            await BluetoothEscposPrinter.printColumn(columnWidths,
                                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                                ["ITEM", "QNT", `${t("PRICE")}`, "TOTAL"], {});
                    
                            for (let item of data.items) {
                                await BluetoothEscposPrinter.printColumn(columnWidths,
                                    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                                    [`${item.product_name} ${item.product_size || ""}`, item.quantity.toString(), `${t("currency.symbol")}${item.price.toFixed(2)}`, `${t("currency.symbol")}${(item.price * item.quantity).toFixed(2)}`], {});
                            }
                    
                            await BluetoothEscposPrinter.printText("\n\r", {});
                            await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
                    
                            await BluetoothEscposPrinter.printColumn([22, 10],
                                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                                [`${t("TOTAL PRICE")}`, `${t("currency.symbol")}${data.total_price.toFixed(2)}`], {});
                    
                            await BluetoothEscposPrinter.printText("\n\r", {});
                    
                            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                            await BluetoothEscposPrinter.printText("Obrigado pela sua compra!\n\r\n\r", {});
                            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
                        } catch (err) {
                            console.log(err.message);
                        }
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
                                                <td>${t("currency.symbol")}${item.price.toFixed(2)}</td>
                                                <td>${t("currency.symbol")}${(
														item.price * item.quantity
													).toFixed(2)}</td>
                                            </tr>
                                            `
												)
												.join("")}
                                            <tr class="total-row">
                                                <td colspan="3" class="right-align">TOTAL</td>
                                                <td>${t("currency.symbol")}${data.total_price.toFixed(2)}</td>
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
