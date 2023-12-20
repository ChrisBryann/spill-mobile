import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {AppStackParamsList, HomeTabParamsList} from '../../screen.types';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DashboardComponent from './Dashboard/DashboardComponent';
import ExpensesComponent from './Expenses/ExpensesComponent';
import PeopleComponent from './People/PeopleComponent';
import AccountComponent from './Account/AccountComponent';

const HomeTab = createBottomTabNavigator<HomeTabParamsList>();

const HomeComponent = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'Home'>) => {
  return (
    <HomeTab.Navigator screenOptions={{headerShown: false}}>
      <HomeTab.Screen name="Dashboard" component={DashboardComponent} />
      <HomeTab.Screen name="Expenses" component={ExpensesComponent} />
      <HomeTab.Screen name="People" component={PeopleComponent} />
      <HomeTab.Screen name="Account" component={AccountComponent} />
    </HomeTab.Navigator>
  );
};

export default HomeComponent;
