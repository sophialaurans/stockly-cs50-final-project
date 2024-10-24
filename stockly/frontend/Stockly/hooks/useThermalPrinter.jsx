import { useState, useEffect, useCallback } from "react";
import {
	DeviceEventEmitter,
	NativeEventEmitter,
	PermissionsAndroid,
	Platform,
	ToastAndroid,
} from "react-native";
import { BluetoothManager } from "react-native-bluetooth-escpos-printer";
import { PERMISSIONS, requestMultiple, RESULTS } from "react-native-permissions";

const useThermalPrinter = () => {
	const [pairedDevices, setPairedDevices] = useState([]);
	const [foundDs, setFoundDs] = useState([]);
	const [bleOpend, setBleOpend] = useState(false);
	const [thermalLoading, setThermalLoading] = useState(true);
	const [name, setName] = useState("");
	const [boundAddress, setBoundAddress] = useState("");

	useEffect(() => {
		BluetoothManager.isBluetoothEnabled().then(
			(enabled) => {
				setBleOpend(Boolean(enabled));
				setThermalLoading(false);
			},
			(err) => {
				err;
			}
		);

		if (Platform.OS === "ios") {
			let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
			bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, (rsp) => {
				deviceAlreadPaired(rsp);
			});
			bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, (rsp) => {
				deviceFoundEvent(rsp);
			});
			bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
				setName("");
				setBoundAddress("");
			});
		} else if (Platform.OS === "android") {
			DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, (rsp) => {
				deviceAlreadPaired(rsp);
			});
			DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, (rsp) => {
				deviceFoundEvent(rsp);
			});
			DeviceEventEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
				setName("");
				setBoundAddress("");
			});
			DeviceEventEmitter.addListener(BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, () => {
				ToastAndroid.show("Device Not Support Bluetooth !", ToastAndroid.LONG);
			});
		}

		console.log(pairedDevices.length);
		if (pairedDevices.length < 1) {
			scan();
			console.log("scanning...");
		} else {
			const firstDevice = pairedDevices[0];
			console.log("length  :" + pairedDevices.length);
			console.log(firstDevice);
			connect(firstDevice);

			// connect(firstDevice);
			// console.log(pairedDevices.length + "hello");
		}
	}, [pairedDevices]);
	// deviceFoundEvent,pairedDevices,scan,boundAddress
	// boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan

	const deviceAlreadPaired = useCallback(
		(rsp) => {
			var ds = null;
			if (typeof rsp.devices === "object") {
				ds = rsp.devices;
			} else {
				try {
					ds = JSON.parse(rsp.devices);
				} catch (e) {}
			}
			if (ds && ds.length) {
				let pared = pairedDevices;
				if (pared.length < 1) {
					pared = pared.concat(ds || []);
				}
				setPairedDevices(pared);
			}
		},
		[pairedDevices]
	);
	// const deviceAlreadPaired = useCallback(
	//   async rsp => {
	//     try {
	//       var ds = null;
	//       if (typeof rsp.devices === 'object') {
	//         ds = rsp.devices;
	//       } else {
	//         try {
	//           ds = JSON.parse(rsp.devices);
	//         } catch (e) {}
	//       }
	//       if (ds && ds.length) {
	//         let pared = pairedDevices;
	//         if (pared.length < 1) {
	//           pared = pared.concat(ds || []);
	//         }
	//         setPairedDevices(pared);
	//       }
	//     } catch (error) {
	//       // Handle any errors that occurred during the asynchronous operations
	//       console.error(error);
	//     }
	//   },
	//   [pairedDevices],
	// );

	const deviceFoundEvent = useCallback(
		(rsp) => {
			var r = null;
			try {
				if (typeof rsp.device === "object") {
					r = rsp.device;
				} else {
					r = JSON.parse(rsp.device);
				}
			} catch (e) {
				// ignore error
			}

			if (r) {
				let found = foundDs || [];
				if (found.findIndex) {
					let duplicated = found.findIndex(function (x) {
						return x.address == r.address;
					});
					if (duplicated == -1) {
						found.push(r);
						setFoundDs(found);
					}
				}
			}
		},
		[foundDs]
	);

	// const connect = (row) => {
	//   setThermalLoading(true);
	//   BluetoothManager.connect(row.address).then(
	//     (s) => {
	//       setThermalLoading(false);
	//       setBoundAddress(row.address);
	//       setName(row.name || "UNKNOWN");
	//       console.log("Connected to device:", row.name);
	//     },
	//     (e) => {
	//       setThermalLoading(false);
	//       alert(e);
	//     }
	//   );
	// };

	const connect = async (row) => {
		try {
			setThermalLoading(true);
			await BluetoothManager.connect(row.address);
			setThermalLoading(false);
			setBoundAddress(row.address);
			setName(row.name || "UNKNOWN");
			console.log("Connected to device:", row);
		} catch (e) {
			setThermalLoading(false);
			alert(e);
		}
	};

	const unPair = (address) => {
		setThermalLoading(true);
		BluetoothManager.unpaire(address).then(
			(s) => {
				setThermalLoading(false);
				setBoundAddress("");
				setName("");
			},
			(e) => {
				setThermalLoading(false);
				alert(e);
			}
		);
	};

	const scanDevices = useCallback(() => {
		setThermalLoading(true);
		BluetoothManager.scanDevices().then(
			(s) => {
				// const pairedDevices = s.paired;
				var found = s.found;
				try {
					found = JSON.parse(found); //@FIX_it: the parse action too weired..
				} catch (e) {
					//ignore
				}
				var fds = foundDs;
				if (found && found.length) {
					fds = found;
				}
				setFoundDs(fds);
				setThermalLoading(false);
			},
			(er) => {
				setThermalLoading(false);
				// ignore
			}
		);
	}, [foundDs]);

	const scan = useCallback(() => {
		try {
			async function blueTooth() {
				const permissions = {
					title: "HSD bluetooth meminta izin untuk mengakses bluetooth",
					message:
						"HSD bluetooth memerlukan akses ke bluetooth untuk proses koneksi ke bluetooth printer",
					buttonNeutral: "Lain Waktu",
					buttonNegative: "Tidak",
					buttonPositive: "Boleh",
				};

				const bluetoothConnectGranted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
					permissions
				);
				if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
					const bluetoothScanGranted = await PermissionsAndroid.request(
						PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
						permissions
					);
					if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
						scanDevices();
					}
				} else {
					// ignore akses ditolak
				}
			}
			blueTooth();
		} catch (err) {
			console.warn(err);
		}
	}, [scanDevices]);

	const scanBluetoothDevice = async () => {
		setThermalLoading(true);
		try {
			const request = await requestMultiple([
				PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
				PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
				PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
			]);

			if (request["android.permission.ACCESS_FINE_LOCATION"] === RESULTS.GRANTED) {
				scanDevices();
				setThermalLoading(false);
			} else {
				setThermalLoading(false);
			}
		} catch (err) {
			setThermalLoading(false);
		}
	};

	return (
        deviceAlreadPaired,
        deviceFoundEvent,
        connect,
        unPair,
        scanDevices,
        scan,
        scanBluetoothDevice,
        pairedDevices,
        foundDs,
        bleOpend,
        thermalLoading,
        name,
        boundAddress
    );
};

export default useThermalPrinter;
