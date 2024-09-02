import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const FormField = ({ label, value, onChangeText, placeholder, pickerOptions }) => (
  <View>
    <Text>{label}:</Text>
    {pickerOptions ? (
      <Picker
        selectedValue={value}
        onValueChange={onChangeText}
        style={{ marginBottom: 8 }}
      >
        <Picker.Item label={placeholder} value="" />
        {pickerOptions.map(option => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    ) : (
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={label === "Quantity" || label === "Price" ? "numeric" : "default"}
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 8, padding: 8 }}
      />
    )}
  </View>
);

export default FormField;
