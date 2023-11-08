import React from 'react';
import {Image, TextInput, TouchableOpacity, View} from 'react-native';
import FontText from '../UI/FontText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamsList} from '../../types';
import {SafeAreaView} from 'react-native-safe-area-context';
import {OC_HIFIVE_IMG} from '../../assets/images';

const SignupComponent = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'Signup'>) => {
  return (
    <SafeAreaView className="flex-1 my-12 justify-start items-center">
      <Image
        source={OC_HIFIVE_IMG}
        className="w-3/4 h-2/6"
        resizeMode="contain"
      />
      {/* <FontText style="text-4xl font-bold p-4">Be a part of spill.</FontText> */}
      <View className="flex w-5/6">
        <FontText style="font-bold text-4xl py-6">Be a part of spill.</FontText>
      </View>
      <View className="flex flex-row w-5/6">
        <View className="flex w-[50%] my-1 mr-2">
          <FontText style="font-semibold py-2">First Name</FontText>
          <TextInput className="w-full rounded-md border-b border-gray-300 py-1" />
        </View>
        <View className="flex w-[48%] my-1">
          <FontText style="font-semibold py-2">Last Name</FontText>
          <TextInput className="w-full rounded-md border-b border-gray-300 py-1" />
        </View>
      </View>
      <View className="flex w-5/6 my-1">
        <FontText style="font-semibold py-2">Email</FontText>
        <TextInput className="w-full rounded-md border-b border-gray-300 py-1" />
      </View>
      <View className="flex w-5/6 my-1">
        <FontText style="font-semibold py-2">Password</FontText>
        <TextInput
          secureTextEntry={true}
          className="w-full rounded-md border-b border-gray-300 py-1"
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
    </SafeAreaView>
  );
};

export default SignupComponent;
