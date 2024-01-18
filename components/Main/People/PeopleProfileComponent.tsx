import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import FontText from '../../UI/FontText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PeopleTabParamsList} from '../../../types/screen';
import {PEOPLE_PLACEHOLDER_IMG} from '../../../assets/images';
import {Image} from 'react-native';
import {UserPlusIcon} from 'react-native-heroicons/outline';
import {FaceSmileIcon} from 'react-native-heroicons/solid';

const PeopleProfileComponent = ({
  navigation,
  route,
}: NativeStackScreenProps<PeopleTabParamsList, 'PeopleProfile'>) => {
  const user = route.params;
  useEffect(() => {
    navigation.setOptions({
      title: user.name,
    });
  }, [user, navigation]);
  return (
    <View className="flex-1 bg-white">
      <View className="items-center py-12 space-y-4">
        <Image
          className="w-36 h-36 rounded-full my-2"
          source={user.imageUri ? {uri: user.imageUri} : PEOPLE_PLACEHOLDER_IMG}
        />
        <View>
          <FontText style="text-center text-xl font-semibold">
            {user.name}
          </FontText>
          <FontText style="text-center text-lg">@{user.username}</FontText>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity className="flex-row items-center p-2 mx-2 border border-green-700 rounded-lg">
            <UserPlusIcon size={16} color={'#046C4E'} />
            <FontText style="pl-1 text-sm font-medium text-green-700">
              Add Friend
            </FontText>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-2 mx-2 border border-green-700 rounded-lg">
            <FaceSmileIcon size={16} color={'#046C4E'} />
            <FontText style="pl-1 text-sm font-medium text-green-700">
              27 Friends
            </FontText>
          </TouchableOpacity>
        </View>
      </View>
      <View className="border-0.5 border-gray-300 mx-6" />
      <ScrollView contentContainerStyle={styles.ScrollViewContent}>
        <FontText style="text-center text-xl font-semibold text-gray-700">
          No joint spills yet
        </FontText>
        <FontText style="text-center text-gray-700">
          Start a new spill by tapping the plus button
        </FontText>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PeopleProfileComponent;
