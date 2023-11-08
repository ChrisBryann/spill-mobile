import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {AppStackParamsList} from '../../types';
import FontText from '../UI/FontText';

const SigninComponent = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'Signin'>) => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text>this is the sign in component</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Signup');
        }}>
        <FontText style="text-blue-800 font-semibold">
          Don't have an account? Sign up
        </FontText>
      </TouchableOpacity>
    </View>
  );
};

export default SigninComponent;
