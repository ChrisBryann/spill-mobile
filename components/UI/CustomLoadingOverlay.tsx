import React from 'react';
import {View} from 'react-native';
import * as Progress from 'react-native-progress';

const CustomLoadingOverlay = () => {
  return (
    <View className="flex-1 h-full bg-white items-center justify-center">
      <Progress.CircleSnail size={60} color="#03543F" indeterminate />
    </View>
  );
};

export default CustomLoadingOverlay;
