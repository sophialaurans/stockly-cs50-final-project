import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      throw new Error("Token not found");
    }
    return token;
  } catch (error) {
    throw new Error("Error retrieving token");
  }
};