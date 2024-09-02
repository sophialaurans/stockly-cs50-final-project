import React from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useClient from '../../../hooks/useClient';
import FormField from '../../../components/FormField';

const ClientDetails = () => {
    const navigation = useNavigation();
    const {
        formState: { name, phone_number, email },
        handleInputChange,
        handleSave,
        loading,
        error,
    } = useClient();

    return (
        <View>
            <FormField
                placeholder="Name"
                label="Name"
                value={name}
                onChangeText={(text) => handleInputChange('name', text)}
            />
            <FormField
                placeholder="Phone number"
                label="Phone number"
                value={phone_number}
                onChangeText={(text) => handleInputChange('phone_number', text)}
            />
            <FormField
                placeholder="Email"
                label="Email"
                value={email}
                onChangeText={(text) => handleInputChange('email', text)}
            />
            <Button
                title="Save"
                onPress={() => handleSave(navigation)}
            />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text>{error}</Text>}
        </View>
    );
};

export default ClientDetails;