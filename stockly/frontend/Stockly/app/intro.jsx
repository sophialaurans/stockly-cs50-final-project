import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const IntroScreen = () => {
    const navigation = useNavigation();
    return (
        <View>
            <Button
                title="Sign in"
                onPress={() => navigation.navigate('login')}>
            </Button>
            <Button
                title="Create an account"
                onPress={() => navigation.navigate('register')}>
            </Button>
        </View>
    );
};

export default IntroScreen;