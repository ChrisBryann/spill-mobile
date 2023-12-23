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
import {StatusBar} from 'react-native';
import AuthComponent from './components/Auth/AuthComponent';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {persistor, store} from './store/configureStore';
// import {useColorScheme} from 'nativewind';

const AppStack = createNativeStackNavigator<AppStackParamsList>();
function App(): JSX.Element {
  // const {colorScheme} = useColorScheme();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <>
          <StatusBar barStyle={'dark-content'} />
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
      </PersistGate>
    </Provider>
  );
}

export default App;
