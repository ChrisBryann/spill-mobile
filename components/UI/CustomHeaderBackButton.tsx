import React from 'react';
import {TouchableOpacity} from 'react-native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';

type Props = {
  onPress: () => void;
};

const CustomHeaderBackButton = ({onPress}: Props) => (
  <TouchableOpacity className="p-1" onPress={onPress}>
    <ChevronLeftIcon color={'black'} />
  </TouchableOpacity>
);

export default CustomHeaderBackButton;
