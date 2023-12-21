import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type AppStackParamsList = {
  About: undefined;
  Home: BottomTabScreenProps<HomeTabParamsList>;
  Auth: NativeStackScreenProps<AuthStackParamsList>;
};

export type AuthStackParamsList = {
  Signup: undefined;
  Signin: undefined;
  VerifyAccount: {
    targetScreen: string;
    phoneNumber: string;
  };
};

export type HomeTabParamsList = {
  Dashboard: undefined;
  Expenses: undefined;
  People: undefined;
  Account: undefined;
};
