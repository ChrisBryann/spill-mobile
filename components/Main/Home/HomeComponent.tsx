import React, {useEffect, useState} from 'react';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {HomeTabParamsList, MainTabBarParamsList} from '../../../types/screen';
import HomeMainComponent from './HomeMainComponent';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import HomeNotificationsComponent from './HomeNotificationsComponent';
import {RouteProp} from '@react-navigation/native';
import CustomHeaderTitle from '../../UI/CustomHeaderTitle';
import {TouchableOpacity, View} from 'react-native';
import {BellIcon, ChevronLeftIcon} from 'react-native-heroicons/solid';
import FontText from '../../UI/FontText';
import {useAppSelector} from '../../../store/hooks';
import {selectUser} from '../../../store/User/userSlice';
import firestore from '@react-native-firebase/firestore';
import {Friends} from '../../../types/schema';

const HomeTab = createNativeStackNavigator<HomeTabParamsList>();

const HomeComponent = ({
  navigation,
}: BottomTabScreenProps<MainTabBarParamsList, 'Home'>) => {
  const user = useAppSelector(selectUser);
  const [receivedFriends, setReceivedFriends] = useState<string[]>([]);
  useEffect(() => {
    if (user) {
      firestore()
        .collection('friends')
        .doc(user)
        .onSnapshot(querySnapshot => {
          if (querySnapshot.exists) {
            const data = querySnapshot.data() as Friends;
            setReceivedFriends(data.received);
          }
        });
    }
  }, [user]);
  return (
    <HomeTab.Navigator screenOptions={HomeTabScreenOptions}>
      <HomeTab.Screen
        name="HomeMain"
        component={HomeMainComponent}
        options={({navigation: nav, route}) => {
          return HomeMainOptions({
            navigation: nav,
            route,
            receivedFriendRequests: receivedFriends,
          });
        }}
      />
      <HomeTab.Screen
        name="HomeNotifications"
        component={HomeNotificationsComponent}
        options={{title: ''}}
      />
    </HomeTab.Navigator>
  );
};

const HomeTabScreenOptions: (props: {
  route: RouteProp<HomeTabParamsList, keyof HomeTabParamsList>;
  navigation: any;
}) => NativeStackNavigationOptions = ({navigation}) => {
  return {
    headerLeft: () => (
      <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
        <ChevronLeftIcon color={'black'} />
      </TouchableOpacity>
    ),
    headerTitle: props => (
      <View>
        <CustomHeaderTitle {...props} />
      </View>
    ),
    headerShadowVisible: false,
  };
};

const HomeMainOptions: (props: {
  route: RouteProp<HomeTabParamsList, 'HomeMain'>;
  navigation: any;
  receivedFriendRequests: string[];
}) => NativeStackNavigationOptions = ({
  navigation,
  receivedFriendRequests,
}) => ({
  title: '',
  headerLeft: () => (
    <View>
      <FontText style="text-3xl text-[#03543F] font-semibold">spill.</FontText>
    </View>
  ),
  headerRight: () => (
    <TouchableOpacity
      className="p-1"
      onPress={() => {
        navigation.navigate('HomeNotifications', {
          receivedFriendRequests,
        });
      }}>
      <BellIcon size={24} color={'black'} />
      {receivedFriendRequests.length > 0 && (
        <View className="absolute flex justify-center items-center w-2 h-2 bg-red-500 rounded-full top-0.5 right-1.5" />
      )}
    </TouchableOpacity>
  ),
});

export default HomeComponent;
