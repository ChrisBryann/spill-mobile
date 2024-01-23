import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PeopleTabParamsList} from '../../../types/screen';
import {View} from 'react-native';
import FontText from '../../UI/FontText';

const FriendRequestComponent = ({
  navigation,
}: NativeStackScreenProps<PeopleTabParamsList, 'FriendRequest'>) => {
  return (
    <View className="flex-1 bg-white">
      <View className="justify-center items-center h-full">
        <FontText style="text-lg font-medium">
          No friend request at this moment!
        </FontText>
      </View>
    </View>
  );
};

export default FriendRequestComponent;
