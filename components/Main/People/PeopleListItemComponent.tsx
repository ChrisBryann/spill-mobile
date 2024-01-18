import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {User} from '../../../types/schema';
import FontText from '../../UI/FontText';
import {PEOPLE_PLACEHOLDER_IMG} from '../../../assets/images';

type Props = {
  user: User;
  onPress: () => void;
};

const PeopleListItemComponent = ({user, onPress}: Props) => {
  return (
    <TouchableOpacity className="p-2 flex-row space-x-2 items-center" onPress={onPress}>
      <Image
        className="w-16 h-16 rounded-full"
        source={PEOPLE_PLACEHOLDER_IMG}
      />
      <View className="flex space-y-2 ">
        <FontText style="text-md font-semibold">{user.name}</FontText>
        <FontText style="text-md text-gray-800">@{user.username}</FontText>
      </View>
    </TouchableOpacity>
  );
};

export default PeopleListItemComponent;
