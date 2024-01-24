import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {User} from './schema';

export type AppStackParamsList = {
  About: undefined;
  Main: NativeStackScreenProps<MainTabParamsList>;
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

export type MainTabParamsList = {
  AddExpenseModal: undefined;
  MainTabBar: BottomTabScreenProps<MainTabBarParamsList>;
};

export type MainTabBarParamsList = {
  Home: NativeStackScreenProps<HomeTabParamsList>;
  History: undefined;
  People: NativeStackScreenProps<PeopleTabParamsList>;
  AddExpense: undefined;
  Account: NativeStackScreenProps<AccountTabParamsList>;
};

export type HomeTabParamsList = {
  HomeMain: undefined;
  HomeNotifications: {
    receivedFriendRequests: string[];
  };
};

export type PeopleTabParamsList = {
  PeopleMain: undefined;
  PeopleProfile: User;
};

export type AccountTabParamsList = {
  AccountMain: undefined;
  AccountInfo: {
    name: string;
    value: string;
    onSave: (value: string) => Promise<void>;
  }; // modal to show personal information (eg: name, username, phone number)
};
