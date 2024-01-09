import React from 'react';
import {MainTabBarParamsList} from '../../../types/screen';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import FontText from '../../UI/FontText';
import {SafeAreaView} from 'react-native-safe-area-context';

const HistoryComponent = ({
  navigation,
}: BottomTabScreenProps<MainTabBarParamsList, 'History'>) => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <FontText>Nice</FontText>
    </SafeAreaView>
  );
};

export default HistoryComponent;
