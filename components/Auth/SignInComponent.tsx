import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppStackParamsList, AuthStackParamsList} from '../../screen.types';
import FontText, {FontTextStyles} from '../UI/FontText';
import {EC_EASY_SHOPPING_IMG} from '../../assets/images';
import {SafeAreaView} from 'react-native-safe-area-context';
import {formatPhoneNumber} from '../../utils/utils';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import CustomLoadingOverlay from '../UI/CustomLoadingOverlay';

const SigninComponent = ({
  navigation,
}: NativeStackScreenProps<AuthStackParamsList, 'Signin'>) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = () => {
    // create new user account in Firebase
    // check if user exists already, i.e.: if there is an account with the given phone number
    setLoading(true);
    firestore()
      .collection('users')
      .where(
        'phoneNumber',
        '==',
        phoneNumber.replaceAll('[()\\s-]+', '').trim(),
      )
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          // user doesn't exists, set toast
          Toast.show({
            type: 'error',
            text1: "User doesn't exists!",
            text2: 'Please use another phone number to sign in.',
          });
          return;
        }

        // set loading or something to change status

        // start verifying the phone number
        auth()
          .verifyPhoneNumber(
            `+1${phoneNumber.replaceAll('[()\\s-]+', '').trim()}`,
          )
          .on(
            'state_changed',
            phoneAuthSnapshot => {
              switch (phoneAuthSnapshot.state) {
                case auth.PhoneAuthState.CODE_SENT:
                  console.log(
                    'Verification code sent',
                    JSON.stringify(phoneAuthSnapshot),
                  );
                  // set toast to indicate confirmation sent

                  // navigate to the verifying screen
                  navigation.navigate('VerifyAccount', {
                    previousScreen: 'Signin',
                    // email,
                    phoneNumber,
                    verificationId: phoneAuthSnapshot.verificationId,
                  });
                  break;
                case auth.PhoneAuthState.ERROR:
                  Toast.show({
                    type: 'error',
                    text1: 'Unable to send code!',
                    text2: 'Make sure the phone number entered is correct.',
                  });
                  // error sending code
                  console.log(
                    'Verification error: ',
                    JSON.stringify(phoneAuthSnapshot),
                  );
                // set toast
              }
            },
            error => {
              Toast.show({
                type: 'error',
                text1: 'Unable to verify phone number!',
                text2: 'Make sure the phone number entered is correct.',
              });
              console.log('Error verifying phone number', error);
            },
          );
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Unable to sign up!',
          text2: 'Make sure you have a stable connection.',
        });
        console.log('Error during firebase operation', JSON.stringify(error));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return loading ? (
    <CustomLoadingOverlay />
  ) : (
    <KeyboardAvoidingView
      className="h-full"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView className="flex-1 bg-white items-center">
        <FontText style="text-2xl font-semibold text-green-800 p-2 pt-6">
          What's your number?
        </FontText>
        <TextInput
          className="text-3xl font-semibold px-6 pt-8 pb-10"
          style={FontTextStyles.text}
          placeholder="(000) 000-0000"
          placeholderTextColor={'lightgray'}
          onChangeText={(val: string) => {
            setPhoneNumber(prev => formatPhoneNumber(val, prev));
          }}
          maxLength={14}
          value={phoneNumber}
          inputMode="tel"
        />
        <FontText style="text-center text-gray-600 px-6 pt-8 pb-8">
          If you have an existing account, we'll send a confirmation code to
          your number
        </FontText>
        <TouchableOpacity
          disabled={phoneNumber.length !== 14}
          className={`p-4 w-3/6 ${
            phoneNumber.length === 14 ? 'bg-green-900' : 'bg-gray-200'
          } rounded-full my-4`}
          onPress={onSubmit}>
          <FontText
            style={`font-medium text-center ${
              phoneNumber.length === 14 ? 'text-white' : 'text-gray-500'
            } text-md`}>
            Continue
          </FontText>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row"
          onPress={() => navigation.navigate('Signup')}>
          <FontText style="font-medium">Are you new to Spill? </FontText>
          <FontText style="font-medium text-green-600">
            Create a new account
          </FontText>
        </TouchableOpacity>
        {/* <TouchableOpacity
          className="flex flex-row p-4"
          onPress={() => {
            // do something to confirm the account with phone number (use Firebase Auth)
          }}>
          <FontText style="font-semibold">Didn't receive the code? </FontText>
          <FontText style="font-semibold underline text-green-600">
            Resend code
          </FontText>
        </TouchableOpacity> */}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SigninComponent;
