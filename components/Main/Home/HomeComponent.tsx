import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import React, {useEffect, useState} from 'react';
import {MainTabBarParamsList} from '../../../types/screen';
import FontText from '../../UI/FontText';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '../../../store/hooks';
import {selectUser} from '../../../store/User/userSlice';
import {Friends} from '../../../types/schema';

const HomeComponent = ({
  navigation,
}: BottomTabScreenProps<MainTabBarParamsList, 'Home'>) => {
  const user = useAppSelector(selectUser);
  const [receivedFriends, setReceivedFriends] = useState<string[]>([]);
  useEffect(() => {
    // check if there are any new friend request

    if (user) {
      const friends_unsubscribe = firestore()
        .collection('friends')
        .doc(user)
        .onSnapshot(snapshot => {
          if (snapshot.exists) {
            const data = snapshot.data() as Friends;
            setReceivedFriends(prev => [...prev, ...data.received]);
          }
        });
    }
  });
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <FontText>Nice</FontText>
    </SafeAreaView>
  );
};

export default HomeComponent;
