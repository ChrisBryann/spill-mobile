import React, {useCallback, useEffect, useState} from 'react';
import {MainTabBarParamsList} from '../../../types/screen';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {FlatList, TextInput, TouchableOpacity, View} from 'react-native';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {User, UserListItem} from '../../../types/schema';
import PeopleListItemComponent from './PeopleListItemComponent';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListHeaderComponent from '../../UI/ListHeaderComponent';
import ListItemSeparatorComponent from '../../UI/ListItemSeparatorComponent';

const peopleTestData: User[] = [
  {
    id: 'E1KCTgIEZtODMAhLGRlgDBQ95Q63',
    username: 'Test1',
    phoneNumber: '(123) 456-7890',
    full_name: 'Testing',
  },
  {
    id: 'k0QKnxm6eAV9A4iOU60T192zTv43',
    username: 'Cbryan',
    phoneNumber: '(949) 537-1151',
    full_name: 'Christopher Bryan',
  },
  {
    id: 'E1KCTgIEZtODMAhLGRlgDBQ95Q63',
    username: 'johnsmith123',
    phoneNumber: '(123) 456-7890',
    full_name: 'John Smith',
  },
  {
    id: 'k0QKnxm6eAV9A4iOU60T192zTv43',
    username: 'jandoe',
    phoneNumber: '(949) 537-1151',
    full_name: 'Jane Doe',
  },
  {
    id: 'E1KCTgIEZtODMAhLGRlgDBQ95Q63',
    username: 'bob-jones',
    phoneNumber: '(123) 456-7890',
    full_name: 'Bob Jones',
  },
  {
    id: 'k0QKnxm6eAV9A4iOU60T192zTv43',
    username: 'hgranger',
    phoneNumber: '(949) 537-1151',
    full_name: 'Hermione Granger',
  },
];

const topPeopleTestData: User[] = [
  {
    id: 'E1KCTgIEZtODMAhLGRlgDBQ95Q63',
    username: 'Test1',
    phoneNumber: '(123) 456-7890',
    full_name: 'Testing',
  },
  {
    id: 'k0QKnxm6eAV9A4iOU60T192zTv43',
    username: 'Cbryan',
    phoneNumber: '(949) 537-1151',
    full_name: 'Christopher Bryan',
  },
  {
    id: 'k0QKnxm6eAV9A4iOU60T192zTv43',
    username: 'jandoe',
    phoneNumber: '(949) 537-1151',
    full_name: 'Jane Doe',
  },
];

const PeopleComponent = ({
  navigation,
}: BottomTabScreenProps<MainTabBarParamsList, 'People'>) => {
  const insets = useSafeAreaInsets();
  const renderItems = useCallback(
    ({item, index}: {item: UserListItem; index: number}) => {
      return item.is_header ? (
        <ListHeaderComponent name={item.header_name!} />
      ) : (
        <PeopleListItemComponent user={item.user!} key={index} />
      );
    },
    [],
  );

  const [headerIndexes, setHeaderIndexes] = useState<number[]>([]);
  const [people, setPeople] = useState<UserListItem[]>([]);

  const fetchPeople = async () => {
    // First fetch your Top People, and then Friends
    let headerIndex = [0];
    let currentIdx = 1;
    let peopleData: UserListItem[] = [
      {header_name: 'Top People', is_header: true},
    ];
    // Top People (always going to be the first index)
    // search database for top people that are associated with this user
    topPeopleTestData.forEach(person => {
      peopleData.push({
        user: person,
        is_header: false,
      });
      currentIdx++;
    });
    // Friends
    peopleData.push({header_name: 'Friends', is_header: true});
    headerIndex.push(currentIdx);
    peopleTestData.forEach(person => {
      peopleData.push({
        user: person,
        is_header: false,
      });
      currentIdx++;
    });
    // set the headerIndexes and the people list data
    setPeople(peopleData);
    setHeaderIndexes(headerIndex);
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  return (
    <View
      style={{paddingTop: insets.top}}
      className="flex-1 bg-white justify-start items-center py-2 space-y-2">
      <View className="flex-row w-5/6 border border-gray-300 rounded-full px-3 py-4 focus:border-green-700 space-x-1">
        <TouchableOpacity
          className="justify-center items-center"
          onPress={() => {
            console.log('Search people pressed!');
          }}>
          <MagnifyingGlassIcon color={'#6B7280'} size={20} />
        </TouchableOpacity>
        <TextInput
          className="grow"
          placeholder="Name, @username"
          placeholderTextColor={'#6B7280'}
        />
      </View>
      <FlatList
        className="w-screen px-6"
        data={people}
        renderItem={renderItems}
        ItemSeparatorComponent={ListItemSeparatorComponent}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={5}
        maxToRenderPerBatch={3}
        stickyHeaderIndices={headerIndexes}
        // refreshing={true}
        // onRefresh={() => console.log('refreshing...')}
      />
    </View>
  );
};

export default PeopleComponent;
