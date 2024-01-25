import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import FontText from '../../UI/FontText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PeopleTabParamsList} from '../../../types/screen';
import {PEOPLE_PLACEHOLDER_IMG} from '../../../assets/images';
import {Image} from 'react-native';
import {CheckIcon, UserMinusIcon} from 'react-native-heroicons/outline';
import {UserPlusIcon} from 'react-native-heroicons/solid';
import {FaceSmileIcon} from 'react-native-heroicons/solid';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '../../../store/hooks';
import {selectUser} from '../../../store/User/userSlice';
import Toast from 'react-native-toast-message';
import {Friends} from '../../../types/schema';
import CustomLoadingOverlay from '../../UI/CustomLoadingOverlay';
import * as Progress from 'react-native-progress';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

const PeopleProfileComponent = ({
  navigation,
  route,
}: NativeStackScreenProps<PeopleTabParamsList, 'PeopleProfile'>) => {
  const user = useAppSelector(selectUser);
  const person = route.params;
  const [friendStatusLoading, setFriendStatusLoading] =
    useState<boolean>(false);
  const [friendStatus, setFriendStatus] = useState<
    'accepted' | 'pending' | 'blocked' | 'none'
  >('none');
  const [numOfFriends, setNumOfFriends] = useState<number>(0);
  // bottom sheet ref
  const friendBottomSheetModalRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ['30%'], []);
  const handleCancelRemoveFriend = useCallback(() => {
    friendBottomSheetModalRef.current?.dismiss();
  }, []);
  const handleRemoveFriendExpand = useCallback(() => {
    friendBottomSheetModalRef.current?.present();
  }, []);
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  useEffect(() => {
    navigation.setOptions({
      title: person.name,
    });
    // check if we already added this user
    // set activity loader on the button
    const profile_unsubscribe = firestore()
      .collection('friends')
      .doc(person.id)
      .onSnapshot(
        querySnapshot => {
          if (querySnapshot.exists) {
            try {
              setFriendStatusLoading(true);
              const data = querySnapshot.data() as Friends;
              if (data.received.some(id => id === user)) {
                setFriendStatus('pending');
              } else if (data.accepted.some(id => id === user)) {
                setFriendStatus('accepted');
              } else if (data.blocked.some(id => id === user)) {
                setFriendStatus('blocked');
              } else {
                setFriendStatus('none');
              }
              setNumOfFriends(data.accepted.length);
            } finally {
              setFriendStatusLoading(false);
            }
          }
        },
        () => {
          Toast.show({
            type: 'error',
            text1: 'Unable to load friend status!',
            text2: 'Make sure you have a stable connection',
          });
        },
      );
    return () => {
      profile_unsubscribe();
    };
  }, [person, navigation, user]);

  const onAddFriend = () => {
    // send the friend request to the person
    // 2 steps: 1. insert person's id currentUser's friend collections sent array
    //          2. insert currentUser's id to person's friend collections received array
    // once person has accepted request, both person and currentUser's id will be moved to accepted array in both
    if (user) {
      setFriendStatusLoading(true);
      const batch = firestore().batch();

      // step 1
      batch.update(firestore().collection('friends').doc(person.id), {
        received: firestore.FieldValue.arrayUnion(user),
      });
      // step 2
      batch.update(firestore().collection('friends').doc(user), {
        sent: firestore.FieldValue.arrayUnion(person.id),
      });

      batch
        .commit()
        .then(() => {
          Toast.show({
            type: 'success',
            text1: 'Friend request sent!',
          });
        })
        .catch(() => {
          Toast.show({
            type: 'error',
            text1: `Unable to add ${person.name}!`,
            text2: 'Make sure you have a stable connection',
          });
        })
        .finally(() => {
          setFriendStatusLoading(false);
        });
    }
  };

  const onRemoveFriend = () => {
    // 2 steps: 1. remove person's id from currentUser's friend collections accepted array
    //          2. insert currentUser's id from person's friend collections accepted array
    if (user) {
      setFriendStatusLoading(true);
      const batch = firestore().batch();

      // step 1
      batch.update(firestore().collection('friends').doc(person.id), {
        accepted: firestore.FieldValue.arrayRemove(user),
      });
      // step 2
      batch.update(firestore().collection('friends').doc(user), {
        accepted: firestore.FieldValue.arrayRemove(person.id),
      });

      batch
        .commit()
        .catch(() => {
          Toast.show({
            type: 'error',
            text1: `Unable to remove ${person.name} as friend!`,
            text2: 'Make sure you have a stable connection',
          });
        })
        .finally(() => {
          setFriendStatusLoading(false);
        });
    }
  };
  return friendStatusLoading ? (
    <CustomLoadingOverlay />
  ) : (
    <View className="flex-1 bg-white">
      <View className="items-center py-12 px-4 space-y-4">
        <Image
          className="w-36 h-36 rounded-full my-2"
          source={
            person.imageUri ? {uri: person.imageUri} : PEOPLE_PLACEHOLDER_IMG
          }
        />
        <View>
          <FontText style="text-center text-xl font-semibold">
            {person.name}
          </FontText>
          <FontText style="text-center text-lg">@{person.username}</FontText>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            disabled={friendStatus === 'pending'}
            onPress={
              friendStatus === 'none'
                ? onAddFriend
                : friendStatus === 'accepted'
                ? handleRemoveFriendExpand
                : undefined
            }
            className={`flex-row items-center p-2 mx-2 ${
              friendStatus === 'accepted' && 'border border-green-700'
            } rounded-lg ${
              friendStatus === 'none'
                ? 'bg-green-700'
                : friendStatus === 'pending' && 'bg-gray-200'
            }`}>
            {friendStatusLoading ? (
              <Progress.CircleSnail size={24} color="white" indeterminate />
            ) : friendStatus === 'none' ? (
              <UserPlusIcon size={16} color={'white'} />
            ) : friendStatus === 'accepted' ? (
              <UserMinusIcon size={16} color={'#046C4E'} />
            ) : friendStatus === 'pending' ? (
              <CheckIcon size={16} color={'#1F2A37'} />
            ) : undefined}
            <FontText
              style={`pl-1 text-sm font-medium ${
                friendStatus === 'none'
                  ? 'text-white'
                  : friendStatus === 'pending'
                  ? 'text-gray-800'
                  : 'text-green-700'
              }`}>
              {friendStatus === 'none'
                ? 'Add Friend'
                : friendStatus === 'accepted'
                ? 'Remove Friend'
                : friendStatus === 'pending'
                ? 'Requested'
                : 'Blocked'}
            </FontText>
          </TouchableOpacity>

          {numOfFriends > 0 && (
            <TouchableOpacity className="flex-row items-center p-2 mx-2 border border-green-700 rounded-lg">
              <FaceSmileIcon size={16} color={'#046C4E'} />
              <FontText style="pl-1 text-sm font-medium text-green-700">
                {numOfFriends} Friends
              </FontText>
            </TouchableOpacity>
          )}
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
      <BottomSheetModal
        ref={friendBottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        enableDismissOnClose>
        <BottomSheetView>
          <View className="items-center space-y-4">
            <FontText style="text-center text-lg font-medium">
              Are you sure you want to unfriend {person.name}?
            </FontText>
            <TouchableOpacity
              onPress={onRemoveFriend}
              className="w-4/6 bg-green-900 p-3 rounded-full items-center">
              {friendStatusLoading ? (
                <Progress.CircleSnail size={24} color="white" indeterminate />
              ) : (
                <FontText style="text-center text-white font-semibold">
                  Unfriend
                </FontText>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelRemoveFriend}>
              <FontText style="text-center text-green-800 font-semibold">
                Cancel
              </FontText>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
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
