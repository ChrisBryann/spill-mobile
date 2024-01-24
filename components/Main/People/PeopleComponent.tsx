import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {MainTabBarParamsList, PeopleTabParamsList} from '../../../types/screen';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import PeopleMainComponent from './PeopleMainComponent';
import PeopleProfileComponent from './PeopleProfileComponent';
import {RouteProp} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import {ChevronLeftIcon} from 'react-native-heroicons/solid';
import CustomHeaderTitle from '../../UI/CustomHeaderTitle';
import FriendRequestComponent from './FriendRequestComponent';

const PeopleTabNavigator = createNativeStackNavigator<PeopleTabParamsList>();

const PeopleComponent = ({
  navigation,
}: BottomTabScreenProps<MainTabBarParamsList, 'People'>) => {
  return (
    <PeopleTabNavigator.Navigator
      initialRouteName="PeopleMain"
      screenOptions={PeopleTabOptions}>
      <PeopleTabNavigator.Screen
        name="PeopleMain"
        component={PeopleMainComponent}
        options={{headerShown: false}}
      />
      <PeopleTabNavigator.Screen
        name="PeopleProfile"
        component={PeopleProfileComponent}
      />
    </PeopleTabNavigator.Navigator>
  );
};

const PeopleTabOptions: (props: {
  route: RouteProp<PeopleTabParamsList, keyof PeopleTabParamsList>;
  navigation: any;
}) => NativeStackNavigationOptions = ({navigation}) => ({
  headerLeft: () => (
    <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
      <ChevronLeftIcon color={'black'} />
    </TouchableOpacity>
  ),
  headerTitle: props => <CustomHeaderTitle {...props} />,
  headerShadowVisible: false,
});

export default PeopleComponent;
