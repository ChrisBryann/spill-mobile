/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeComponent from './components/Home/HomeComponent';
import {AppStackParamsList} from './types';
import SignupComponent from './components/Auth/SignupComponent';
import SigninComponent from './components/Auth/SigninComponent';

const AppStack = createNativeStackNavigator<AppStackParamsList>();
function App(): JSX.Element {
  return (
    <NavigationContainer>
      <AppStack.Navigator initialRouteName="Home">
        <AppStack.Screen
          name="Home"
          component={HomeComponent}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="Signup"
          component={SignupComponent}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="Signin"
          component={SigninComponent}
          options={{headerShown: false}}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
