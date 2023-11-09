import React from 'react';
import {HomeTabParamsList} from '../../../types';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import FontText from '../../UI/FontText';
import { SafeAreaView } from 'react-native-safe-area-context';

const PeopleComponent = ({
  navigation,
}: BottomTabScreenProps<HomeTabParamsList, 'People'>) => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <FontText>Nice</FontText>
    </SafeAreaView>
  );
};

export default PeopleComponent;
