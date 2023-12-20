import React from 'react';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';

const CustomHeaderBackButton = (navigation: any) => (
  <ChevronLeftIcon color={'black'} onPress={() => navigation.goBack()} />
);

export default CustomHeaderBackButton;
