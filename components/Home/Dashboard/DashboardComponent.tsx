import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {HomeTabParamsList} from '../../../screen.types';
import FontText from '../../UI/FontText';
import { SafeAreaView } from 'react-native-safe-area-context';

const DashboardComponent = ({
  navigation,
}: BottomTabScreenProps<HomeTabParamsList, 'Dashboard'>) => {
  return (
    <SafeAreaView className='flex-1 justify-center items-center'>
      <FontText>Nice</FontText>
    </SafeAreaView>
  );
};

export default DashboardComponent;
