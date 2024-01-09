import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import FontText from '../UI/FontText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamsList} from '../../types/screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  AtSymbolIcon,
  // LockClosedIcon,
  PhoneIcon,
  UserIcon,
} from 'react-native-heroicons/solid';
import CustomInputField from '../UI/CustomInputField';
import {formatPhoneNumber} from '../../utils/utils';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import CustomLoadingOverlay from '../UI/CustomLoadingOverlay';

const SignupComponent = ({
  navigation,
}: NativeStackScreenProps<AuthStackParamsList, 'Signup'>) => {
  const [loading, setLoading] = useState<boolean>(false);

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

  // const [email, setEmail] = useState<string>('');
  // const [emailErrorDescription, setEmailErrorDescription] =
  //   useState<string>('');
  // const emailErrorHandler = (val: string) => {
  //   return !val.includes('@');
  // };
  // const [password, setPassword] = useState<string>('');
  // const passwordErrorHandler = (val: string) => {
  //   //Minimum 12 characters, at least one uppercase letter, one lowercase letter, one number and one special character:
  //   return !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_@$!%*?&])[A-Za-z\d_@$!%*?&]{12,}$/.test(
  //     val,
  //   );
  // };

  const [infoVerified, setInfoVerified] = useState<boolean>(false);

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
        if (!querySnapshot.empty) {
          // user already exists, set toast
          Toast.show({
            type: 'error',
            text1: 'User already exists with this phone number!',
            text2: 'Please use another phone number to sign up.',
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
                  // // set toast to indicate confirmation sent
                  // Toast.show({
                  //   type: 'success',
                  //   text1: 'Code sent!',
                  //   text2: 'Please check your messages for a verfication code.',
                  // });
                  console.log(
                    'Verification code sent',
                    JSON.stringify(phoneAuthSnapshot),
                  );

                  // navigate to the verifying screen
                  navigation.navigate('VerifyAccount', {
                    previousScreen: 'Signup',
                    // email,
                    phoneNumber,
                    verificationId: phoneAuthSnapshot.verificationId,
                    fullName,
                    userName: username,
                  });
                  break;
                case auth.PhoneAuthState.ERROR:
                  // error sending code
                  Toast.show({
                    type: 'error',
                    text1: 'Unable to send code!',
                    text2: 'Make sure the phone number entered is correct.',
                  });
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

  useEffect(() => {
    fullName &&
    // email &&
    // !emailErrorHandler(email) &&
    // password &&
    // !passwordErrorHandler(password)
    phoneNumber &&
    !phoneErrorHandler(phoneNumber)
      ? setInfoVerified(true)
      : setInfoVerified(false);
  }, [fullName, phoneNumber]);

  return loading ? (
    <CustomLoadingOverlay />
  ) : (
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
          {/* <CustomInputField
            icon={<AtSymbolIcon color={'gray'} />}
            value={email}
            label="Email"
            onValueChange={setEmail}
            placeholder="Email"
            errorHandler={emailErrorHandler}
            required
            errorDescription="Please enter a valid email"
          />
          <CustomInputField
            icon={<LockClosedIcon color={'gray'} />}
            value={password}
            label="Password"
            onValueChange={setPassword}
            placeholder="Password"
            errorHandler={passwordErrorHandler}
            required
            secured
            errorDescription="Please enter a valid password"
            description={`- At least 12 characters.
- At least one uppercase letter.
- At least one lowercase letter.
- At least one number.
- At least one special character (_, @, $, !, %, *,?, &).
            `}
          /> */}
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
            } rounded-full my-4 `}
            onPress={onSubmit}>
            <FontText
              style={`font-medium text-center ${
                infoVerified ? 'text-white' : 'text-gray-500'
              } text-md `}>
              Create a new account
            </FontText>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-row"
            onPress={() => navigation.navigate('Signin')}>
            <FontText style="font-medium">Already have an account? </FontText>
            <FontText style="font-medium text-green-600">
              Sign in instead
            </FontText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignupComponent;
