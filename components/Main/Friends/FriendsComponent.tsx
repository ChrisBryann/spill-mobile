import React from 'react';
import {MainTabBarParamsList} from '../../../screen.types';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import FontText from '../../UI/FontText';
import {SafeAreaView} from 'react-native-safe-area-context';

const FriendsComponent = ({
  navigation,
}: BottomTabScreenProps<MainTabBarParamsList, 'Friends'>) => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <FontText>Nice</FontText>
    </SafeAreaView>
  );
};

export default FriendsComponent;
