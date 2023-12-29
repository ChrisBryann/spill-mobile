import React from 'react';
import {MainTabBarParamsList, MainTabParamsList} from '../../screen.types';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import AccountComponent from './Account/AccountComponent';
import HomeComponent from './Home/HomeComponent';
import {RouteProp} from '@react-navigation/native';
import {
  ChevronLeftIcon,
  CurrencyDollarIcon as CurrencyDollarSolidIcon,
  HomeIcon as HomeSolidIcon,
  PlusCircleIcon,
  UserCircleIcon as UserCircleSolidIcon,
  UserGroupIcon as UserGroupSolidIcon,
} from 'react-native-heroicons/solid';
import {
  CurrencyDollarIcon,
  HomeIcon,
  UserGroupIcon,
} from 'react-native-heroicons/outline';
import FriendsComponent from './Friends/FriendsComponent';
import HistoryComponent from './History/HistoryComponent';
import CustomHeaderTitle from '../UI/CustomHeaderTitle';
import AddExpenseComponent, {
  AddExpenseBaseComponent,
} from './AddExpense/AddExpenseComponent';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {TouchableOpacity} from 'react-native';

const MainTabBar = createBottomTabNavigator<MainTabBarParamsList>();
const MainTab = createNativeStackNavigator<MainTabParamsList>();

const MainTabBarComponent = () => {
  return (
    <MainTabBar.Navigator
      initialRouteName="Home"
      screenOptions={MainTabBarScreenOptions}>
      <MainTabBar.Screen
        name="Home"
        component={HomeComponent}
        options={{
          headerTitleAlign: 'left',
          headerTitle: 'spill.',
          headerTintColor: '#03543F',
          headerTitleStyle: {fontSize: 30, fontFamily: 'Outfit'},
        }}
      />
      <MainTabBar.Screen
        name="Friends"
        component={FriendsComponent}
        options={{
          headerTitle: 'Your Friends',
        }}
      />
      <MainTabBar.Screen
        name="AddExpense"
        component={AddExpenseBaseComponent}
        options={{tabBarLabel: () => null}}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('AddExpenseModal');
          },
        })}
      />
      <MainTabBar.Screen name="History" component={HistoryComponent} />
      <MainTabBar.Screen name="Account" component={AccountComponent} />
    </MainTabBar.Navigator>
  );
};

const MainComponent = () => {
  return (
    <MainTab.Navigator
      initialRouteName="MainTabBar"
      screenOptions={{headerShown: false}}>
      <MainTab.Screen name="MainTabBar" component={MainTabBarComponent} />
      <MainTab.Screen
        name="AddExpenseModal"
        component={AddExpenseComponent}
        options={AddExpenseModalOptions}
      />
    </MainTab.Navigator>
  );
};

const AddExpenseModalOptions: (props: {
  navigation: any;
}) => NativeStackNavigationOptions = ({navigation}: {navigation: any}) => ({
  headerLeft: () => (
    <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
      <ChevronLeftIcon color={'black'} />
    </TouchableOpacity>
  ),
  headerTitle: props => <CustomHeaderTitle {...props} />,
  headerShown: true,
  animation: 'slide_from_bottom',
  title: 'Create a new spill',
});

const MainTabBarScreenOptions: (props: {
  route: RouteProp<MainTabBarParamsList, keyof MainTabBarParamsList>;
  navigation: any;
}) => BottomTabNavigationOptions = ({
  route,
  navigation,
}: {
  route: RouteProp<MainTabBarParamsList, keyof MainTabBarParamsList>;
  navigation: any;
}) => ({
  tabBarIcon: ({focused, color, size}) => {
    return route.name === 'Home' ? (
      focused ? (
        <HomeSolidIcon color={color} size={30} />
      ) : (
        <HomeIcon color={color} size={30} />
      )
    ) : route.name === 'Friends' ? (
      focused ? (
        <UserGroupSolidIcon color={color} size={30} />
      ) : (
        <UserGroupIcon color={color} size={30} />
      )
    ) : route.name === 'History' ? (
      focused ? (
        <CurrencyDollarSolidIcon color={color} size={30} />
      ) : (
        <CurrencyDollarIcon color={color} size={30} />
      )
    ) : route.name === 'Account' ? (
      <UserCircleSolidIcon color={color} size={30} />
    ) : (
      <PlusCircleIcon color="#057A55" size={56} />
    );
  },
  // tabBarLabel: ({focused, color, size, position, children}) => {
  //   return (
  //     route.name !== 'AddExpense' && (
  //       <FontText style={`text-xs text-[${color}]  `}>{children}</FontText>
  //     )
  //   );
  // },
  tabBarShowLabel: true,
  tabBarStyle: {
    borderTopWidth: 0,
    height: '10%',
  },
  tabBarLabelStyle: {
    fontFamily: 'Outfit',
    marginBottom: '15%',
  },
  tabBarActiveTintColor: '#057A55',
  tabBarInactiveTintColor: '#6B7280',
  // tabBarItemStyle: {
  //   borderRadius: 10,
  //   marginVertical: 5,
  //   marginHorizontal: 30,
  // },
  // tabBarActiveBackgroundColor: '#DBEAFE',
  headerTitle: props => <CustomHeaderTitle {...props} />,
  headerTitleStyle: {
    fontFamily: 'Outfit',
  },
});

export default MainComponent;
