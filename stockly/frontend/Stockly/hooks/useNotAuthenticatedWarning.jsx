import { useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getToken } from "./useAuth";

const useNotAuthenticatedWarning = () => {
	const navigation = useNavigation();

	const checkAuthentication = async () => {
        try {
            const token = await getToken();
        } catch (error) {
            Alert.alert(
				"Disconnected", "Your account has been disconnected. Please sign in again."
			);
            navigation.replace("(auth)");
        }
	};

	useEffect(() => {
		checkAuthentication();
	}, []);

    return {
        checkAuthentication
    };
};

export default useNotAuthenticatedWarning;
