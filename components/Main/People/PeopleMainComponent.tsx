import React, {useCallback, useEffect, useRef, useState} from 'react';
import {PeopleTabParamsList} from '../../../types/screen';
import {FlatList, TextInput, TouchableOpacity, View} from 'react-native';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {Friends, User, UserListItem} from '../../../types/schema';
import PeopleListItemComponent from './PeopleListItemComponent';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListHeaderComponent from '../../UI/ListHeaderComponent';
import ListItemSeparatorComponent from '../../UI/ListItemSeparatorComponent';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BellIcon} from 'react-native-heroicons/solid';
import {FontTextStyles} from '../../UI/FontText';
import {useAppSelector} from '../../../store/hooks';
import {selectUser} from '../../../store/User/userSlice';
import firestore, {Filter} from '@react-native-firebase/firestore';
import {AUTOCOMPLETE_SUFFIX, PAGINATION_LIMIT} from '../../../constants/main';
import Toast from 'react-native-toast-message';

const peopleTestData: User[] = [
  {
    id: 'E1KCTgIEZtODMAhLGRlgDBQ95Q63',
    username: 'Test1',
    phoneNumber: '(123) 456-7890',
    name: 'Testing',
  },
  {
    id: 'k0QKnxm6eAV9A4iOU60T192zTv43',
    username: 'Cbryan',
    phoneNumber: '(949) 537-1151',
    name: 'Christopher Bryan',
  },
  {
    id: 'E1KCTgIEZtODMAhLGRlgDBQ95Q63',
    username: 'johnsmith123',
    phoneNumber: '(123) 456-7890',
    name: 'John Smith',
  },
  {
    id: 'k0QKnxm6eAV9A4iOU60T192zTv43',
    username: 'jandoe',
    phoneNumber: '(949) 537-1151',
    name: 'Jane Doe',
  },
  {
    id: 'E1KCTgIEZtODMAhLGRlgDBQ95Q63',
    username: 'bob-jones',
    phoneNumber: '(123) 456-7890',
    name: 'Bob Jones',
  },
  {
    id: 'k0QKnxm6eAV9A4iOU60T192zTv43',
    username: 'hgranger',
    phoneNumber: '(949) 537-1151',
    name: 'Hermione Granger',
  },
];

const topPeopleTestData: User[] = [
  {
    id: 'E1KCTgIEZtODMAhLGRlgDBQ95Q63',
    username: 'Test1',
    phoneNumber: '(123) 456-7890',
    name: 'Testing',
  },
  {
    id: 'k0QKnxm6eAV9A4iOU60T192zTv43',
    username: 'Cbryan',
    phoneNumber: '(949) 537-1151',
    name: 'Christopher Bryan',
  },
  {
    id: 'k0QKnxm6eAV9A4iOU60T192zTv43',
    username: 'jandoe',
    phoneNumber: '(949) 537-1151',
    name: 'Jane Doe',
  },
];

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

  const fetchFriends = async () => {
    // use onSnapshot to listen to new friends
    // First fetch your Top People, and then Friends
    let headerIndex = [0];
    let currentIdx = 1;
    let friendsData: UserListItem[] = [
      {header_name: 'Top People', is_header: true},
    ];
    // Top People (always going to be the first index)
    // search database for top people that are associated with this user
    await topPeopleTestData.forEach(person => {
      friendsData.push({
        user: person,
        is_header: false,
      });
      currentIdx++;
    });
    // Friends
    friendsData.push({header_name: 'Friends', is_header: true});
    headerIndex.push(currentIdx);
    await peopleTestData.forEach(person => {
      friendsData.push({
        user: person,
        is_header: false,
      });
      currentIdx++;
    });
    // set the headerIndexes and the people list data

    setFriends(friendsData);
    setFriendHeaderIndexes(headerIndex);
  };

  const paginateSearchQuery = () => {
    if (lastPaginatedDoc) {
      let peopleData: UserListItem[] = [];
      let lastDoc: User | null = null;

      setRefreshing(true);
      firestore()
        .collection('users')
        .where('name', '>=', searchQuery)
        .where('name', '<=', searchQuery + AUTOCOMPLETE_SUFFIX)
        .orderBy('name')
        .orderBy('__name__')
        .startAfter(lastPaginatedDoc.name, lastPaginatedDoc.id)
        .limit(PAGINATION_LIMIT)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
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
    fetchFriends();
  }, []);

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
          .where('name', '>=', searchQuery)
          .where('name', '<=', searchQuery + AUTOCOMPLETE_SUFFIX)
          .orderBy('name')
          .orderBy('__name__')
          .limit(PAGINATION_LIMIT)
          .get()
          .then(async querySnapshot => {
            await querySnapshot.forEach(doc => {
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
  }, [searchQuery]);

  useEffect(() => {
    // check if there are any new friend request or get the current friends for display

    if (user) {
      const friends_unsubscribe = firestore()
        .collection('friends')
        .doc(user)
        .onSnapshot(snapshot => {
          if (snapshot.exists) {
            const data = snapshot.data() as Friends;
            setReceivedFriends(data.received);
          }
        });

      return () => {
        friends_unsubscribe();
      };
    }
  });

  //   useEffect(() => {
  //     if (user) {
  //       const friends_unsubscribe = firestore()
  //         .collection('friends')
  //         .where('__name__', '==', user)
  //         .onSnapshot(querySnapshot => {
  //           let headerIndex = [0];
  //           let currentIdx = 1;
  //           let peopleData: UserListItem[] = [
  //             {header_name: 'Friends', is_header: true},
  //           ];
  //           querySnapshot.docChanges().forEach(friend => {
  //             // Get all the friends, or the new ones if a doc changes
  //             const doc = friend.doc;
  //             console.log(doc);
  //           });
  //         });

  //       return () => {
  //         friends_unsubscribe();
  //       };
  //     }
  //   }, [user]);

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
      <FlatList
        className="w-screen px-6"
        data={searchQuery ? people : friends}
        renderItem={renderItems}
        ItemSeparatorComponent={ListItemSeparatorComponent}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={5}
        maxToRenderPerBatch={3}
        stickyHeaderIndices={searchQuery ? headerIndexes : friendHeaderIndexes}
        onEndReachedThreshold={0.05}
        onEndReached={searchQuery ? paginateSearchQuery : undefined}
      />
    </View>
  );
};

export default PeopleMainComponent;
