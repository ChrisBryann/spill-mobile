import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Image, TextInput, TouchableOpacity, View} from 'react-native';
import {AppStackParamsList, AuthStackParamsList} from '../../screen.types';
import FontText from '../UI/FontText';
import {EC_EASY_SHOPPING_IMG} from '../../assets/images';
import {SafeAreaView} from 'react-native-safe-area-context';

const SigninComponent = ({
  navigation,
}: NativeStackScreenProps<AuthStackParamsList, 'Signin'>) => {
  return (
    <SafeAreaView className="flex-1 my-6 justify-start items-center">
      {/* <FontText style="text-4xl font-bold p-4"></FontText> */}
      <Image
        source={EC_EASY_SHOPPING_IMG}
        className="w-3/4 h-2/5"
        resizeMode="contain"
      />
      <View className="flex w-5/6">
        <FontText style="font-bold text-4xl py-4">
          Let's start splitting.
        </FontText>
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
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <FontText style="text-blue-800 font-semibold">
          Don't have an account? Sign up
        </FontText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SigninComponent;
