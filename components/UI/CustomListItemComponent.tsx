import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import FontText from './FontText';
import {ChevronRightIcon} from 'react-native-heroicons/outline';

type Props = {
  item: string;
  onPress: () => void;
};

const CustomListItemComponent = ({item, onPress}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between border-b-0.5 border-gray-400 px-2 py-3">
      <FontText>{item}</FontText>
      <View className="">
        <ChevronRightIcon strokeWidth={3} size={20} color={'#4B5563'} />
      </View>
    </TouchableOpacity>
  );
};

export default CustomListItemComponent;
