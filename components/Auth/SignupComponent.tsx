import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontText from '../UI/FontText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamsList, AuthStackParamsList} from '../../screen.types';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AtSymbolIcon, PhoneIcon, UserIcon} from 'react-native-heroicons/solid';
import CustomInputField from '../UI/CustomInputField';

const SignupComponent = ({
  navigation,
}: NativeStackScreenProps<AuthStackParamsList, 'Signup'>) => {
  return (
    <KeyboardAvoidingView
      className="h-full"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView className="flex-1 bg-white items-center justify-between">
        {/* <Image
        source={OC_HIFIVE_IMG}
        className="w-3/4 h-2/6"
        resizeMode="contain"
      /> */}
        {/* <FontText style="text-4xl font-bold p-4">Be a part of spill.</FontText> */}
        <View>
          <CustomInputField
            icon={<UserIcon color={'gray'} />}
            label="Name"
            placeholder="Full Name"
          />
          <CustomInputField
            icon={<AtSymbolIcon color={'gray'} />}
            label="Username"
            placeholder="Username"
          />
          <CustomInputField
            icon={<PhoneIcon color={'gray'} />}
            label="Phone Number"
            placeholder="(XXX) XXX-XXXX"
            inputMode="tel"
            maxLength={10}
            description="We will send a code to this number"
          />
        </View>
        <View className="flex w-full my-auto items-center">
          <TouchableOpacity
            className="p-4 w-5/6 bg-green-900 rounded-full my-4 shadow-md"
            onPress={() =>
              navigation.navigate('VerifyAccount' || 'Home', {
                targetScreen: 'Signin',
              })
            }>
            <FontText style="font-bold text-center text-white text-md">
              Create a new account
            </FontText>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-row"
            onPress={() => navigation.navigate('Signin')}>
            <FontText style="font-semibold">Already have an account? </FontText>
            <FontText style="font-semibold text-green-600">
              Sign in instead
            </FontText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignupComponent;
