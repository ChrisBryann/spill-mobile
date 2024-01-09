import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {MainTabBarParamsList} from '../../../types/screen';
import FontText from '../../UI/FontText';
import {SafeAreaView} from 'react-native-safe-area-context';

const HomeComponent = ({
  navigation,
}: BottomTabScreenProps<MainTabBarParamsList, 'Home'>) => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <FontText>Nice</FontText>
    </SafeAreaView>
  );
};

export default HomeComponent;
