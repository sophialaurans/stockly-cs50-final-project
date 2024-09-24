import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native-paper";
import colors from "../constants/colors";

const FormField = ({ label, value, onChangeText, placeholder, pickerOptions, keyboardType }) => {
	const isMultiline = label === "Description";

	return (
		<View style={styles.formContainer}>
			{pickerOptions ? (
				<Picker selectedValue={value} onValueChange={onChangeText} style={styles.picker}>
					<Picker.Item label={placeholder} value="" />
					{pickerOptions.map((option) => (
						<Picker.Item key={option.value} label={option.label} value={option.value} />
					))}
				</Picker>
			) : (
				<TextInput
					style={styles.input}
					outlineStyle={styles.input}
					outlineColor={colors.lightGrey}
					activeOutlineColor={colors.tertiary}
					label={label}
					mode="flat"
					value={value}
					onChangeText={onChangeText}
					keyboardType={keyboardType}
					multiline={isMultiline}
					numberOfLines={isMultiline ? 4 : 1}
				/>
			)}
		</View>
	);
};

export default FormField;

const styles = StyleSheet.create({
	formContainer: {
		flexDirection: "row",
		flexWrap: "nowrap",
		gap: 5,
		alignItems: "baseline",
	},
	picker: {
		height: 20,
		width: "100%",
		backgroundColor: "transparent",
		color: colors.text,
	},
	input: {
		width: "100%",
		minHeight: 50,
		backgroundColor: "transparent",
		marginBottom: 5,
	},
});
