import React from 'react';
import {MainTabBarParamsList, MainTabParamsList} from '../../types/screen';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import AccountComponent from './Account/AccountComponent';
import HomeComponent from './Home/HomeComponent';
import {
  RouteProp,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {
  BellIcon,
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
  XMarkIcon,
} from 'react-native-heroicons/outline';
import HistoryComponent from './History/HistoryComponent';
import CustomHeaderTitle from '../UI/CustomHeaderTitle';
import AddExpenseComponent, {
  AddExpenseBaseComponent,
} from './AddExpense/AddExpenseComponent';
import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {TouchableOpacity} from 'react-native';
import PeopleComponent from './People/PeopleComponent';

const MainTabBar = createBottomTabNavigator<MainTabBarParamsList>();
const MainTab = createNativeStackNavigator<MainTabParamsList>();

const MainTabBarComponent = ({
  navigation,
}: NativeStackScreenProps<MainTabParamsList, 'MainTabBar'>) => {
  return (
    <MainTabBar.Navigator
      initialRouteName="Home"
      screenOptions={MainTabBarScreenOptions}>
      <MainTabBar.Screen
        name="Home"
        component={HomeComponent}
        options={{
          // headerTitleAlign: 'left',
          // headerTitle: 'spill.',
          // headerTintColor: '#03543F',
          // headerTitleStyle: {fontSize: 30, fontFamily: 'Inter'},
          headerShown: false,
        }}
      />
      <MainTabBar.Screen
        name="People"
        component={PeopleComponent}
        options={{
          headerShown: false,
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
      <MainTabBar.Screen
        name="Account"
        component={AccountComponent}
        options={{headerShown: false}}
      />
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
  headerLeft: () => <></>,
  headerRight: () => (
    <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
      <XMarkIcon color={'black'} />
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
    ) : route.name === 'People' ? (
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
  tabBarItemStyle: {
    marginHorizontal: 4,
    marginVertical: 6,
    borderRadius: 6,
  },
  tabBarLabelStyle: {
    fontFamily: 'Inter',
    marginBottom: '15%',
  },
  tabBarActiveTintColor: '#057A55',
  tabBarInactiveTintColor: '#6B7280',
  // tabBarItemStyle: {
  //   borderRadius: 10,
  //   marginVertical: 5,
  //   marginHorizontal: 30,
  // },
  tabBarActiveBackgroundColor: '#F3FAF7',
  headerTitle: props => <CustomHeaderTitle {...props} />,
  headerTitleStyle: {
    fontFamily: 'Inter',
  },
  headerShadowVisible: false,
  headerShown: getFocusedRouteNameFromRoute(route) !== 'HomeNotifications',
});

export default MainComponent;
