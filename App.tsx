/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {AppStackParamsList} from './screen.types';
import AboutComponent from './components/About/AboutComponent';
import HomeComponent from './components/Home/HomeComponent';
import {StatusBar, TouchableOpacity} from 'react-native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import CustomHeaderTitle from './components/UI/CustomHeaderTitle';
import AuthComponent from './components/Auth/AuthComponent';
// import {useColorScheme} from 'nativewind';

const AppStack = createNativeStackNavigator<AppStackParamsList>();
function App(): JSX.Element {
  // const {colorScheme} = useColorScheme();
  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <NavigationContainer>
        <AppStack.Navigator
          initialRouteName="About"
          screenOptions={{headerShown: false}}>
          <AppStack.Screen
            name="About"
            component={AboutComponent}
            options={{headerShown: false}}
          />
          <AppStack.Screen name="Auth" component={AuthComponent} />
          <AppStack.Screen
            name="Home"
            component={HomeComponent}
            options={{headerShown: false}}
          />
        </AppStack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
