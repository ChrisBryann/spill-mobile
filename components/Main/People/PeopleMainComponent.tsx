import React, {useCallback, useEffect, useState} from 'react';
import {PeopleTabParamsList} from '../../../types/screen';
import {FlatList, TextInput, View} from 'react-native';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {Friends, User, UserListItem} from '../../../types/schema';
import PeopleListItemComponent from './PeopleListItemComponent';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListHeaderComponent from '../../UI/ListHeaderComponent';
import ListItemSeparatorComponent from '../../UI/ListItemSeparatorComponent';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FontTextStyles} from '../../UI/FontText';
import {useAppSelector} from '../../../store/hooks';
import {selectUser} from '../../../store/User/userSlice';
import firestore from '@react-native-firebase/firestore';
import {AUTOCOMPLETE_SUFFIX, PAGINATION_LIMIT} from '../../../constants/main';
import Toast from 'react-native-toast-message';
import CustomLoadingOverlay from '../../UI/CustomLoadingOverlay';

const PeopleMainComponent = ({
  navigation,
}: NativeStackScreenProps<PeopleTabParamsList, 'PeopleMain'>) => {
  const insets = useSafeAreaInsets();
  const user = useAppSelector(selectUser);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const renderItems = useCallback(
    ({item, index}: {item: UserListItem; index: number}) => {
      return item.is_header ? (
        <ListHeaderComponent name={item.header_name!} />
      ) : (
        <PeopleListItemComponent
          user={item.user!}
          key={index}
          onPress={() => navigation.navigate('PeopleProfile', item.user!)}
        />
      );
    },
    [navigation],
  );

  const [headerIndexes, setHeaderIndexes] = useState<number[]>([]);
  const [people, setPeople] = useState<UserListItem[]>([]);
  const [friends, setFriends] = useState<UserListItem[]>([]);
  const [friendHeaderIndexes, setFriendHeaderIndexes] = useState<number[]>([]);
  const [lastPaginatedDoc, setLastPaginatedDoc] = useState<User>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const paginateSearchQuery = () => {
    if (lastPaginatedDoc) {
      let peopleData: UserListItem[] = [];
      let lastDoc: User | null = null;

      setRefreshing(true);
      firestore()
        .collection('users')
        .where(
          firestore.Filter.and(
            firestore.Filter('name', '>=', searchQuery),
            firestore.Filter('name', '<=', searchQuery + AUTOCOMPLETE_SUFFIX),
          ),
        )
        .orderBy('name')
        .orderBy('__name__')
        .startAfter(lastPaginatedDoc.name, lastPaginatedDoc.id)
        .limit(PAGINATION_LIMIT)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.id === user) {
              return;
            }
            const person = doc.data() as User;
            const _user = {
              id: doc.id,
              name: person.name,
              username: person.username,
              phoneNumber: person.phoneNumber,
              imageUri: person.imageUri,
            };
            peopleData.push({
              user: _user,
              is_header: false,
            });
            lastDoc = _user;
          });
          // set the headerIndexes and the people list data
          setPeople(prev => [...prev, ...peopleData]);
          lastDoc && setLastPaginatedDoc(lastDoc);
        })
        .catch(() => {
          Toast.show({
            type: 'error',
            text1: 'Unable to load people!',
            text2: 'Make sure you have a stable connection',
          });
        })
        .finally(() => {
          setRefreshing(false);
        });
    }
  };

  useEffect(() => {
    // for query searching
    const getSearchQuery = async () => {
      if (searchQuery) {
        let headerIndex = [0];
        let peopleData: UserListItem[] = [
          {header_name: 'People', is_header: true},
        ];
        let lastDoc: User | null = null;
        // issue with concurrency if user types and deletes character too fast then the updated data is wrong.
        // ex: type A then delete A, it will still show the result when A is typed in because no await is used.
        firestore()
          .collection('users')
          .where(
            firestore.Filter.and(
              firestore.Filter('name', '>=', searchQuery),
              firestore.Filter('name', '<=', searchQuery + AUTOCOMPLETE_SUFFIX),
            ),
          )
          .orderBy('name')
          .orderBy('__name__')
          .limit(PAGINATION_LIMIT)
          .get()
          .then(async querySnapshot => {
            await querySnapshot.forEach(doc => {
              if (doc.id === user) {
                return;
              }
              const person = doc.data();
              const _user = {
                id: doc.id,
                name: person.name,
                username: person.username,
                phoneNumber: person.phoneNumber,
                imageUri: person.imageUri,
              };
              peopleData.push({
                user: _user,
                is_header: false,
              });
              lastDoc = _user;
            });

            // set the headerIndexes and the people list data
            setPeople(peopleData);
            setHeaderIndexes(headerIndex);
            lastDoc && setLastPaginatedDoc(lastDoc);
          })
          .catch(() => {
            Toast.show({
              type: 'error',
              text1: 'Unable to load people!',
              text2: 'Make sure you have a stable connection',
            });
          });
      }
    };
    getSearchQuery();
  }, [searchQuery, user]);

  useEffect(() => {
    // check if there are any new friend request or get the current friends for display

    if (user) {
      const friends_unsubscribe = firestore()
        .collection('friends')
        .doc(user)
        .onSnapshot(
          snapshot => {
            if (snapshot.exists) {
              setLoading(true);
              let headerIndex = [0];
              let currentIdx = 1;
              let friendData: UserListItem[] = [
                {header_name: 'Friends', is_header: true},
              ];
              const data = snapshot.data() as Friends;
              Promise.all(
                data.accepted.map(friend =>
                  firestore().collection('users').doc(friend).get(),
                ),
              )
                .then(response => {
                  if (response.some(s => !s.exists)) {
                    throw Error();
                  }
                  response.forEach(snap => {
                    const person = snap.data() as User;
                    friendData.push({
                      user: {
                        ...person,
                        id: snap.id,
                      },
                      is_header: false,
                    });
                    currentIdx++;
                  });
                  setFriendHeaderIndexes(headerIndex);
                  setFriends(friendData);
                })
                .catch(() => {
                  Toast.show({
                    type: 'error',
                    text1: 'Unable to load people!',
                    text2: 'Make sure you have a stable connection',
                  });
                })
                .finally(() => {
                  setLoading(false);
                });
            }
          },
          err => {
            Toast.show({
              type: 'error',
              text1: err.message,
            });
          },
        );

      return () => {
        friends_unsubscribe();
      };
    }
  }, [user]);

  return (
    <View
      style={{paddingTop: insets.top + 2}}
      className="flex-1 bg-white justify-start items-center py-2 space-y-2">
      <View className="flex-row space-x-3 items-center">
        <View className="flex-row w-5/6 border border-gray-300 rounded-full px-3 py-3 focus:border-green-700 space-x-1">
          <MagnifyingGlassIcon color={'#6B7280'} size={20} />
          <TextInput
            className="grow"
            placeholder="Name, @username"
            style={FontTextStyles.text}
            placeholderTextColor={'#6B7280'}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      {loading ? (
        <CustomLoadingOverlay />
      ) : (
        <FlatList
          className="w-screen px-6"
          data={searchQuery ? people : friends}
          renderItem={renderItems}
          ItemSeparatorComponent={ListItemSeparatorComponent}
          keyExtractor={(_, index) => index.toString()}
          initialNumToRender={5}
          maxToRenderPerBatch={3}
          stickyHeaderIndices={
            searchQuery ? headerIndexes : friendHeaderIndexes
          }
          onEndReachedThreshold={0.05}
          onEndReached={searchQuery ? paginateSearchQuery : undefined}
        />
      )}
    </View>
  );
};

export default PeopleMainComponent;
