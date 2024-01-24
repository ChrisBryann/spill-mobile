import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import FontText from './FontText';
import {User} from '../../types/schema';
import {PEOPLE_PLACEHOLDER_IMG} from '../../assets/images';

type Props = {
  person: User;
  onAccept: () => void;
  onDecline: () => void;
};

const FriendRequestItemComponent = ({person, onAccept, onDecline}: Props) => {
  return (
    <View className="flex-row items-center justify-between w-full px-6 py-2">
      <View className="flex-row space-x-2 items-center">
        <Image
          className="w-12 h-12 rounded-full"
          source={
            person.imageUri ? {uri: person.imageUri} : PEOPLE_PLACEHOLDER_IMG
          }
        />
        <View className="flex space-y-2 ">
          <FontText style="font-semibold">{person.name}</FontText>
          <FontText style="text-gray-800">@{person.username}</FontText>
        </View>
      </View>
      <View className="flex-row items-center space-x-2">
        <TouchableOpacity
          className="bg-green-800 rounded-lg p-2"
          onPress={onAccept}>
          <FontText style="text-xs text-white font-medium">Accept</FontText>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-gray-200 rounded-lg p-2"
          onPress={onDecline}>
          <FontText style="text-xs text-gray-800 font-medium">Decline</FontText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FriendRequestItemComponent;
