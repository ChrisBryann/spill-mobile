import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {AppStackParamsList} from '../../screen.types';
import {NC_BILL_IMG} from '../../assets/images';
import FontText from '../UI/FontText';
import {SafeAreaView} from 'react-native-safe-area-context';

const AboutComponent = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'About'>) => {
  return (
    <SafeAreaView className="bg-white flex-1 justify-between items-center p-6">
      <FontText style="text-4xl font-bold text-green-800">spill.</FontText>
      <FontText style=" text-xl text-green-900 font-bold text-center ">
        Don't stress about the bill,
        {'\n'}
        we'll split it for you
      </FontText>
      <View className="flex justify-center gap-2">
        <TouchableOpacity
          className="p-4 bg-green-900 rounded-full shadow-md"
          onPress={() => navigation.navigate('Auth', {screen: 'Signup'})}>
          <FontText style="font-bold text-center text-white text-md ">
            Create a new account
          </FontText>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4 rounded-full shadow-md border border-green-900"
          onPress={() => navigation.navigate('Auth', {screen: 'Signin'})}>
          <FontText style="font-bold text-center text-green-900 text-md ">
            Sign in to your account
          </FontText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AboutComponent;
