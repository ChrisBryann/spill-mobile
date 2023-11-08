import React from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import FontText from '../UI/FontText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamsList} from '../../types';

const SignupComponent = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'Signup'>) => {
  return (
    <View className="flex-1 my-12 justify-start items-center pt-8">
      <FontText style="text-4xl font-bold p-4">Be a part of spill.</FontText>
      <View className="flex w-5/6 my-1">
        <FontText style="font-semibold py-2">First Name</FontText>
        <TextInput className="w-full rounded-md border border-gray-300 bg-gray-200 py-1" />
      </View>
      <View className="flex w-5/6 my-1">
        <FontText style="font-semibold py-2">Last Name</FontText>
        <TextInput className="w-full rounded-md border border-gray-300 bg-gray-200 py-1" />
      </View>
      <View className="flex w-5/6 my-1">
        <FontText style="font-semibold py-2">Email</FontText>
        <TextInput className="w-full rounded-md border border-gray-300 bg-gray-200 py-1" />
      </View>
      <View className="flex w-5/6 my-1">
        <FontText style="font-semibold py-2">Password</FontText>
        <TextInput
          secureTextEntry={true}
          className="w-full rounded-md border border-gray-300 bg-gray-200 py-1"
        />
      </View>
      <TouchableOpacity
        className="p-4 w-5/6 bg-black rounded-full my-4 shadow-md"
        onPress={() => navigation.navigate('Home')}>
        <FontText style="font-bold text-center text-base-green text-md">
          Sign In
        </FontText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
        <FontText style="text-blue-800 font-semibold">
          Have an account? Log in
        </FontText>
      </TouchableOpacity>
    </View>
  );
};

export default SignupComponent;
