import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {AppStackParamsList} from '../../types';
import {NC_BILL_IMG} from '../../assets/images';
import FontText from '../UI/FontText';

const HomeComponent = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'Home'>) => {
  return (
    <View className="bg-white flex-1 justify-start items-center p-6">
      <FontText style="text-4xl font-bold text-base-green">spill.</FontText>
      <FontText style="mt-auto mb-0 text-xl font-bold">
        We make splitting easy.
      </FontText>
      <Image
        source={NC_BILL_IMG}
        className="w-full h-3/4"
        resizeMode="contain"
      />
      <View className="flex flex-row gap-2">
        <TouchableOpacity
          className="p-4 w-2/4 bg-base-green rounded-full shadow-md"
          onPress={() => navigation.navigate('Home')}>
          <FontText style="font-bold text-center text-md">Get Started</FontText>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4 w-2/4 bg-black rounded-full shadow-md"
          onPress={() => navigation.navigate('Home')}>
          <FontText style="font-bold text-center text-base-green text-md">
            Sign In
          </FontText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeComponent;
