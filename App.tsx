/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {AppStackParamsList} from './screen.types';
import AboutComponent from './components/About/AboutComponent';
import HomeComponent from './components/Home/HomeComponent';
import {StatusBar} from 'react-native';
import AuthComponent from './components/Auth/AuthComponent';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {persistor, store} from './store/configureStore';
import {useAppDispatch, useAppSelector} from './store/hooks';
import {clearUser, selectUser, setUser} from './store/User/userSlice';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

// import {useColorScheme} from 'nativewind';

const AppStack = createNativeStackNavigator<AppStackParamsList>();

function AppWrapper(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
}

function App(): JSX.Element {
  // const {colorScheme} = useColorScheme();
  const [loading, setLoading] = useState<boolean>(false);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      if (currentUser) {
        dispatch(setUser(currentUser.uid));
      } else {
        console.log('clearing user');
        dispatch(clearUser());
      }
      console.log('user auth changed!');
      console.log(user, currentUser);

      if (loading) {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <NavigationContainer>
        <AppStack.Navigator
          initialRouteName={user ? 'Home' : 'About'}
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
      <Toast />
    </>
  );
}

export default AppWrapper;
