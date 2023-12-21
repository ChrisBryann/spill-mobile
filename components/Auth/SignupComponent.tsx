import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import FontText from '../UI/FontText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamsList} from '../../screen.types';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AtSymbolIcon, PhoneIcon, UserIcon} from 'react-native-heroicons/solid';
import CustomInputField from '../UI/CustomInputField';
import { formatPhoneNumber } from '../../store/utils';

const SignupComponent = ({
  navigation,
}: NativeStackScreenProps<AuthStackParamsList, 'Signup'>) => {
  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const usernameErrorHandler = (val: string) => {
    // check if this username exists or not
    return false;
  };
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const phoneErrorHandler = (val: string) => {
    // check if this phone number already have an account associated with
    return val.length !== 14;
  };
  const [infoVerified, setInfoVerified] = useState<boolean>(false);
  useEffect(() => {
    fullName &&
    username &&
    !usernameErrorHandler(username) &&
    phoneNumber &&
    !phoneErrorHandler(phoneNumber)
      ? setInfoVerified(true)
      : setInfoVerified(false);
  }, [fullName, username, phoneNumber]);

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
            value={fullName}
            onValueChange={setFullName}
            required
          />
          <CustomInputField
            icon={<AtSymbolIcon color={'gray'} />}
            label="Username"
            value={username}
            onValueChange={setUsername}
            placeholder="Username"
            errorHandler={usernameErrorHandler}
            required
            errorDescription="Please enter a valid username"
            description="Enter a custom username or email"
          />
          <CustomInputField
            icon={<PhoneIcon color={'gray'} />}
            label="Phone Number"
            value={phoneNumber}
            onValueChange={setPhoneNumber}
            placeholder="(XXX) XXX-XXXX"
            inputMode="tel"
            maxLength={14}
            errorHandler={phoneErrorHandler}
            required
            customValueDisplay={formatPhoneNumber}
            errorDescription="Please enter a valid phone number"
            description="We will send a code to this number"
          />
        </View>
        <View className="flex w-full my-auto items-center">
          <TouchableOpacity
            disabled={!infoVerified}
            className={`p-4 w-5/6 ${
              infoVerified ? ' bg-green-900' : 'bg-gray-200'
            } rounded-full my-4 shadow-md `}
            onPress={() =>
              // create new user account with phone number as ID in Firebase
              navigation.navigate('VerifyAccount', {
                targetScreen: 'Signin',
                phoneNumber,
              })
            }>
            <FontText
              style={`font-bold text-center ${
                infoVerified ? 'text-white' : 'text-gray-500'
              } text-md `}>
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
