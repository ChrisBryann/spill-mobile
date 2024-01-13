import React, {useEffect} from 'react';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {
  AccountTabParamsList,
  MainTabBarParamsList,
} from '../../../types/screen';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import AccountMainComponent from './AccountMainComponent';
import AccountInfoComponent from './AccountInfoComponent';
import {TouchableOpacity} from 'react-native';
import {
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
} from 'react-native-heroicons/solid';
import auth from '@react-native-firebase/auth';
import CustomHeaderTitle from '../../UI/CustomHeaderTitle';
import {RouteProp} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const AccountTabNavigator = createNativeStackNavigator<AccountTabParamsList>();

const AccountComponent = ({
  navigation,
}: BottomTabScreenProps<MainTabBarParamsList, 'Account'>) => {
  return (
    <AccountTabNavigator.Navigator
      initialRouteName="AccountInfo"
      screenOptions={({navigation: nav, route}) => ({
        headerTitle: props => <CustomHeaderTitle {...props} />,
        headerTitleStyle: {
          fontFamily: 'Inter',
        },
      })}>
      <AccountTabNavigator.Screen
        name="AccountMain"
        component={AccountMainComponent}
        options={{title: 'Account'}}
      />
      <AccountTabNavigator.Screen
        name="AccountInfo"
        component={AccountInfoComponent}
        options={AccountInfoOptions}
      />
    </AccountTabNavigator.Navigator>
  );
};

const AccountInfoOptions: (props: {
  route: RouteProp<AccountTabParamsList, 'AccountInfo'>;
  navigation: any;
}) => NativeStackNavigationOptions = ({navigation}) => ({
  title: 'Profile',
  headerRight: () => (
    <TouchableOpacity
      className="px-2"
      onPress={() => {
        auth()
          .signOut()
          .then(() => {
            navigation.navigate('About');
          })
          .catch(() => {
            Toast.show({
              type: 'error',
              text1: 'Unable to sign out!',
              text2: 'Make sure you have a stable connection.',
            });
          });
      }}>
      <ArrowRightOnRectangleIcon color={'black'} />
    </TouchableOpacity>
  ),
});

export default AccountComponent;
