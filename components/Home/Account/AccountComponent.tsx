import React from 'react';
import {HomeTabParamsList} from '../../../screen.types';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import FontText from '../../UI/FontText';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';

const AccountComponent = ({
  navigation,
}: BottomTabScreenProps<HomeTabParamsList, 'Account'>) => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <FontText>Nice</FontText>
      <TouchableOpacity
        onPress={() => {
          auth()
            .signOut()
            .then(() => navigation.navigate('About'));
        }}>
        <FontText>Logout</FontText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AccountComponent;
