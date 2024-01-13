import React, {useCallback, useEffect, useState} from 'react';
import FontText from '../../UI/FontText';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList, ScrollView, TouchableOpacity, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Image} from 'react-native';
import {PEOPLE_PLACEHOLDER_IMG} from '../../../assets/images';
import {selectUser} from '../../../store/User/userSlice';
import {useAppSelector} from '../../../store/hooks';
import {User} from '../../../types/schema';
import CustomListItemComponent from '../../UI/CustomListItemComponent';
import {ArrowRightOnRectangleIcon} from 'react-native-heroicons/solid';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {AccountTabParamsList} from '../../../types/screen';
import CustomLoadingOverlay from '../../UI/CustomLoadingOverlay';
import CustomHeaderBackButton from '../../UI/CustomHeaderBackButton';

const AccountInfoHeaderLeft = (onPress: () => void) => (
  <CustomHeaderBackButton onPress={onPress} />
);

const AccountMainComponent = ({
  navigation,
}: NativeStackScreenProps<AccountTabParamsList, 'AccountMain'>) => {
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<User>({
    id: '123456790asdfghjkl',
    name: 'Testing Test',
    phoneNumber: '(123) 456-7890',
    username: 'test1',
  });

  const renderItems = useCallback(
    ({
      item,
      index,
    }: {
      item: {
        key: string;
        value: string;
      };
      index: number;
    }) => {
      return (
        <CustomListItemComponent
          item={item.key}
          onPress={() => {
            navigation.navigate('AccountInfoModal', {
              name: item.key,
              value: (currentUser as any)[item.value],
              onSave: (value: string) => {
                return firestore()
                  .collection('users')
                  .doc(currentUser.id)
                  .update({
                    [item.value]: value,
                  });
              },
            });
            const headerName = navigation.getParent()?.getId();
            navigation.getParent()?.setOptions({
              title: item,
              headerLeft: () =>
                AccountInfoHeaderLeft(() => {
                  navigation.getParent()?.setOptions({
                    title: headerName,
                    headerLeft: undefined,
                  });
                  navigation.goBack();
                }),
            });
          }}
        />
      );
    },
    [navigation, currentUser],
  );

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .where('__name__', '==', user)
      .onSnapshot(querySnapshot => {
        setLoading(true);
        querySnapshot.forEach(query => {
          const data = query.data();
          setCurrentUser({
            id: user!,
            name: data.name,
            phoneNumber: data.phoneNumber,
            username: data.username,
          });
        });
        setTimeout(() => setLoading(false), 100); // useState re renders on the next snapshot, so must put in a callback
      });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return loading ? (
    <CustomLoadingOverlay />
  ) : (
    <View className="flex-1 bg-white p-4">
      {/* <FontText>Nice</FontText>
      <TouchableOpacity
        onPress={() => {
          auth()
            .signOut()
            .then(() => navigation.navigate('About'));
        }}>
        <FontText>Logout</FontText>
      </TouchableOpacity> */}
      <View className="items-center py-6">
        <Image
          className="w-36 h-36 rounded-full my-2"
          source={PEOPLE_PLACEHOLDER_IMG}
        />
        <FontText style="text-xl font-semibold">{currentUser?.name}</FontText>
        <FontText style="text-lg">@{currentUser?.username}</FontText>
      </View>
      <View className="grow">
        <View>
          <FontText style="font-semibold text-gray-600">
            Profile settings
          </FontText>
          <FlatList
            className="px-3"
            data={[
              {
                key: 'Name',
                value: 'name',
              },
              {
                key: 'Username',
                value: 'username',
              },
              {
                key: 'Phone number',
                value: 'phoneNumber',
              },
              {
                key: 'Profile picture',
                value: 'image',
              },
            ]}
            renderItem={renderItems}
            keyExtractor={(_, index) => index.toString()}
            initialNumToRender={5}
            maxToRenderPerBatch={3}
            scrollEnabled={false}
            // refreshing={true}
            // onRefresh={() => console.log('refreshing...')}
          />
          <View className="items-center my-3">
            <TouchableOpacity className="flex-row my-2 items-center">
              <ArrowRightOnRectangleIcon color={'#057A55'} />
              <FontText style="font-semibold text-green-700 pl-1">
                Sign out
              </FontText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="justify-center items-center space-y-2 mb-4">
        <FontText>Version 0.1</FontText>
        <TouchableOpacity>
          <FontText style="font-semibold text-gray-600">
            Delete Account
          </FontText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountMainComponent;
