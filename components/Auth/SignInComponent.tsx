import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppStackParamsList, AuthStackParamsList} from '../../screen.types';
import FontText, { FontTextStyles } from '../UI/FontText';
import {EC_EASY_SHOPPING_IMG} from '../../assets/images';
import {SafeAreaView} from 'react-native-safe-area-context';

const SigninComponent = ({
  navigation,
}: NativeStackScreenProps<AuthStackParamsList, 'Signin'>) => {
  return (
    <KeyboardAvoidingView
      className="h-full"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView className="flex-1 bg-white items-center">
        <FontText style="text-2xl font-bold text-green-800 p-2 pt-6">
          What's your number?
        </FontText>
        <TextInput
          className="text-3xl font-semibold px-6 pt-8 pb-10"
          style={FontTextStyles.text}
          placeholder="(000) 000-0000"
          placeholderTextColor={'lightgray'}
          inputMode="tel"
        />
        <FontText style="text-center text-gray-600 font-bold px-6 pt-8 pb-8">
          If you have an existing account, we'll send a confirmation code to
          your number
        </FontText>
        <TouchableOpacity
          className="p-4 w-3/6 bg-green-900 rounded-full my-4 shadow-md"
          // onPress={() => navigation.navigate('VerifyAccount' || 'Home')}
        >
          <FontText style="font-bold text-center text-white text-md">
            Continue
          </FontText>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row p-4"
          onPress={() => {
            // do something to confirm the account with phone number (use Firebase Auth)
          }}>
          <FontText style="font-semibold">Didn't receive the code? </FontText>
          <FontText style="font-semibold underline text-green-600">
            Resend code
          </FontText>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SigninComponent;
