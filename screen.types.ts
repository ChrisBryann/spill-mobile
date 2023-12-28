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
    // targetScreen: string; // targetScreen is always going to be Home since after signup or signin, user will be directed to Home
    previousScreen: string;
    phoneNumber: string;
    verificationId: string;
    fullName?: string; // only needed when signup
    userName?: string; // only needed when signup
  };
};

export type HomeTabParamsList = {
  Dashboard: undefined;
  Expenses: undefined;
  People: undefined;
  Account: undefined;
};
