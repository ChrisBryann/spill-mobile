import React from 'react';
import FontText from './FontText';
import {View} from 'react-native';

type Props = {
  name: string;
};

const ListHeaderComponent = ({name}: Props) => {
  return (
    <View className="bg-white py-1">
      <FontText style="text-lg font-semibold">{name}</FontText>
    </View>
  );
};

export default ListHeaderComponent;
