import React from 'react';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {AppStackParamsList, AuthStackParamsList} from '../../screen.types';
import SignupComponent from './SignupComponent';
import SigninComponent from './SigninComponent';
import {TouchableOpacity} from 'react-native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import CustomHeaderTitle from '../UI/CustomHeaderTitle';
import VerifyAccountComponent from './VerifyAccountComponent';

const AuthStack = createNativeStackNavigator<AuthStackParamsList>();

const AuthComponent = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'Auth'>) => {
  return (
    <AuthStack.Navigator
      initialRouteName="Signin"
      screenOptions={({navigation}) => ({
        headerLeft: () => (
          <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
            <ChevronLeftIcon color={'black'} />
          </TouchableOpacity>
        ),
        headerTitle: props => <CustomHeaderTitle {...props} />,
      })}>
      <AuthStack.Screen
        name="Signup"
        component={SignupComponent}
        options={{title: 'Create a new account'}}
      />
      <AuthStack.Screen
        name="Signin"
        component={SigninComponent}
        options={{title: 'Sign in'}}
      />
      <AuthStack.Screen
        name="VerifyAccount"
        component={VerifyAccountComponent}
        options={{title: ''}}
      />
    </AuthStack.Navigator>
  );
};

export default AuthComponent;
