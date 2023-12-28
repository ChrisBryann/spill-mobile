import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {AppStackParamsList, AuthStackParamsList} from '../../screen.types';
import FontText from '../UI/FontText';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {CompositeScreenProps} from '@react-navigation/native';
import CustomLoadingOverlay from '../UI/CustomLoadingOverlay';
import Toast from 'react-native-toast-message';

const CELL_COUNT = 6;

const VerifyAccountComponent = ({
  navigation,
  route,
}: CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamsList, 'VerifyAccount'>,
  NativeStackScreenProps<AppStackParamsList>
>) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [code, setCode] = useState<string>('');
  const ref = useBlurOnFulfill({value: code, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });
  // variable that holds the intended screen to navigate when code is verified successfully
  const {previousScreen, phoneNumber, verificationId, fullName, userName} =
    route.params;

  const onVerify = () => {
    // create a phone auth credentials with the OTP code and verificationId
    setLoading(true);

    const phoneCredentials = auth.PhoneAuthProvider.credential(
      verificationId,
      code,
    );

    // try signing in with the phone credentials
    auth()
      .signInWithCredential(phoneCredentials)
      .then(user => {
        if (previousScreen === 'Signup') {
          // sign up successful, set a new user in users collection with the auto generated id
          // sign up assumes the full name and username is passed down to this screen

          firestore()
            .collection('users')
            .doc(user.user.uid)
            .set({
              name: fullName!,
              username: userName!,
              phoneNumber: phoneNumber.replaceAll('[()\\s-]+', '').trim(),
            });
        }
        // if we sign in, then we just let onAuthStateChanged get the user id
        // navigate to the home screen once successful
        navigation.navigate('Home');
      })
      .catch(error => {
        if (error.code === 'auth/invalid-verification-code') {
          Toast.show({
            type: 'error',
            text1: 'Invalid code!',
            text2: 'Please enter the correct verification code.',
          });
          console.log('Invalid verficiation code');
        } else if (error.code === 'auth/user-disabled') {
          Toast.show({
            type: 'error',
            text1: 'User is disabled!',
          });
          console.log('User is disabled.');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Unable to sign in!',
            text2: 'Make sure you have a stable connection.',
          });
          console.log('Unable to sign in with credentials', error);
        }
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
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex h-full items-center">
          <FontText style="text-2xl font-semibold text-green-800 p-2 pt-6">
            What's the code?
          </FontText>
          <FontText style="text-center text-gray-600 font-medium p-2">
            A 6-digit code was sent to {'\n'}
            {/* {email} */}
            {phoneNumber}
          </FontText>
          <CodeField
            ref={ref}
            {...props}
            value={code}
            onChangeText={setCode}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFiledRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <View
                // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[styles.cellRoot, isFocused && styles.focusCell]}>
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
          {/* Not a good implementation of resend code. Here's why: 
          https://stackoverflow.com/questions/76911441/how-to-regenerate-a-new-verification-code-after-resend-button-click-in-firebase */}
          {/* <TouchableOpacity
            className="flex flex-row p-2"
            onPress={() => {
              // do something to get the OTP code again (use Firebase Auth)
            }}>
            <FontText style="font-medium">Didn't receive the code? </FontText>
            <FontText style="font-medium underline text-green-600">
              Resend code
            </FontText>
          </TouchableOpacity> */}
          <TouchableOpacity
            disabled={code.length !== CELL_COUNT}
            className={`p-4 w-3/6 ${
              code.length === CELL_COUNT ? 'bg-green-900' : 'bg-gray-200'
            } rounded-full my-4`}
            onPress={onVerify}>
            <FontText
              style={`font-medium text-center ${
                code.length === CELL_COUNT ? 'text-white' : 'text-gray-500'
              } text-md`}>
              Verify
            </FontText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default VerifyAccountComponent;

const styles = StyleSheet.create({
  root: {padding: 20, minHeight: 300},
  title: {textAlign: 'center', fontSize: 30},
  codeFiledRoot: {
    paddingVertical: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 40,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#000',
    fontSize: 36,
    textAlign: 'center',
    fontFamily: 'Outfit',
  },
  focusCell: {
    borderBottomColor: '#014737',
    borderBottomWidth: 2,
  },
});
