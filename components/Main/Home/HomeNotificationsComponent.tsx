import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeTabParamsList} from '../../../types/screen';
import {ScrollView, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Friends, User} from '../../../types/schema';
import {useAppSelector} from '../../../store/hooks';
import {selectUser} from '../../../store/User/userSlice';
import FontText from '../../UI/FontText';
import FriendRequestItemComponent from '../../UI/FriendRequestItemComponent';
import Toast from 'react-native-toast-message';

const HomeNotificationsComponent = ({
  navigation,
  route,
}: NativeStackScreenProps<HomeTabParamsList, 'HomeNotifications'>) => {
  const user = useAppSelector(selectUser);
  const {receivedFriendRequests} = route.params;
  const [loading, setLoading] = useState<boolean>(false);
  const [receivedUsers, setReceivedUsers] = useState<User[]>([
    {
      id: 'E1KCTgIEZtODMAhLGRlgDBQ95Q63',
      username: 'Test1',
      phoneNumber: '(123) 456-7890',
      name: 'Testing',
    },
  ]);
  useEffect(() => {
    // 1. get any new incoming friend requests
    // 2. any new app updates
    setLoading(true);
    if (receivedFriendRequests) {
      Promise.all(
        receivedFriendRequests.map(id =>
          firestore().collection('users').doc(id).get(),
        ),
      )
        .then(async response => {
          let newFriends: User[] = [];
          await response.forEach(snapshot => {
            if (snapshot.exists) {
              const person = snapshot.data() as User;
              newFriends.push({
                ...person,
                id: snapshot.id,
              });
            }
          });
          setReceivedUsers(newFriends);
        })
        .catch(() => {
          Toast.show({
            type: 'error',
            text1: 'Unable to fetch updates!',
            text2: 'Make sure you have a stable connection',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [receivedFriendRequests]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
        }}
        className="h-full">
        {receivedUsers.length > 0 &&
          receivedUsers.map((person, index) => (
            <FriendRequestItemComponent
              key={index}
              person={person}
              onAccept={() => {
                // if user accepts requests, two things to do:
                // 2 steps: 1. insert person's id to currentUser's friend collections accepted array and remove it from received array
                //          2. insert currentUser's id to person's friend collections accepted array and remove it from sent array
                if (user) {
                  const batch = firestore().batch();

                  // step 1
                  batch.update(firestore().collection('friends').doc(user), {
                    accepted: firestore.FieldValue.arrayUnion(person.id),
                    received: firestore.FieldValue.arrayRemove(person.id),
                  });
                  // step 2
                  batch.update(
                    firestore().collection('friends').doc(person.id),
                    {
                      accepted: firestore.FieldValue.arrayUnion(user),
                      sent: firestore.FieldValue.arrayRemove(user),
                    },
                  );
                  batch
                    .commit()
                    .then(() => {
                      Toast.show({
                        type: 'success',
                        text1: `${person.name} is now your friend.`,
                      });
                    })
                    .catch(() => {
                      Toast.show({
                        type: 'error',
                        text1: `Unable to accept ${person.name}'s request!`,
                        text2: 'Make sure you have a stable connection',
                      });
                    });
                }
              }}
              onDecline={() => {
                // for now, do two things:
                // 2 steps: 1. remove person's id from currentUser's friend collections received array
                //          2. remove currentUser's id from person's friend collections sent array
                if (user) {
                  const batch = firestore().batch();

                  // step 1
                  batch.update(firestore().collection('friends').doc(user), {
                    received: firestore.FieldValue.arrayRemove(person.id),
                  });
                  // step 2
                  batch.update(
                    firestore().collection('friends').doc(person.id),
                    {
                      sent: firestore.FieldValue.arrayRemove(user),
                    },
                  );
                  batch
                    .commit()
                    .then(() => {
                      Toast.show({
                        type: 'success',
                        text1: `You declined ${person.name}'s request.`,
                      });
                    })
                    .catch(() => {
                      Toast.show({
                        type: 'error',
                        text1: `Unable to decline ${person.name}'s request!`,
                        text2: 'Make sure you have a stable connection',
                      });
                    });
                }
              }}
            />
          ))}
        {/* <FontText>No requests</FontText> */}
      </ScrollView>
    </View>
  );
};

export default HomeNotificationsComponent;
