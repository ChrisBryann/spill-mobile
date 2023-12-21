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
import {AuthStackParamsList} from '../../screen.types';
import FontText from '../UI/FontText';

const CELL_COUNT = 4;

const VerifyAccountComponent = ({
  navigation,
  route,
}: NativeStackScreenProps<AuthStackParamsList, 'VerifyAccount'>) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  // variable that holds the intended screen to navigate when code is verified successfully
  const {targetScreen, phoneNumber} = route.params;

  return (
    <KeyboardAvoidingView
      className="h-full"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex h-full items-center">
          <FontText style="text-2xl font-bold text-green-800 p-2 pt-6">
            What's the code?
          </FontText>
          <FontText style="text-center text-gray-600 font-bold p-2">
            A 4-digit code was sent to {'\n'}
            {phoneNumber}
          </FontText>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
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
          <TouchableOpacity
            className="flex flex-row p-2"
            onPress={() => {
              // do something to get the OTP code again (use Firebase Auth)
            }}>
            <FontText style="font-semibold">Didn't receive the code? </FontText>
            <FontText style="font-semibold underline text-green-600">
              Resend code
            </FontText>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-4 w-3/6 bg-green-900 rounded-full my-4 shadow-md"
            // onPress={() => navigation.navigate('VerifyAccount' || 'Home')}
          >
            <FontText style="font-bold text-center text-white text-md">
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
    width: 60,
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
  },
  focusCell: {
    borderBottomColor: '#014737',
    borderBottomWidth: 2,
  },
});
