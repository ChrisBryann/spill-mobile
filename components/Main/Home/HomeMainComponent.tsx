import React, {useEffect, useState} from 'react';
import {HomeTabParamsList} from '../../../types/screen';
import FontText from '../../UI/FontText';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '../../../store/hooks';
import {selectUser} from '../../../store/User/userSlice';
import {Friends} from '../../../types/schema';
import {View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const HomeMainComponent = ({
  navigation,
}: NativeStackScreenProps<HomeTabParamsList, 'HomeMain'>) => {
  return (
    <View className="flex-1 p-3">
      {/* <FontText style="text-xl font-semibold text-gray-600">
        Friend Requests
      </FontText>
      <FriendRequestItemComponent />
      <FriendRequestItemComponent /> */}
    </View>
  );
};

export default HomeMainComponent;
