import React from 'react';
import {MainTabBarParamsList, MainTabParamsList} from '../../../screen.types';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import FontText from '../../UI/FontText';
import {SafeAreaView} from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export const AddExpenseBaseComponent = ({
  navigation,
}: BottomTabScreenProps<MainTabBarParamsList, 'AddExpense'>) => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <FontText>Nice</FontText>
    </SafeAreaView>
  );
};
const AddExpenseComponent = ({
  navigation,
}: NativeStackScreenProps<MainTabParamsList, 'AddExpenseModal'>) => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <FontText>Nice</FontText>
    </SafeAreaView>
  );
};

export default AddExpenseComponent;
