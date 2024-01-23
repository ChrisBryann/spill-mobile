import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AccountTabParamsList} from '../../../types/screen';
import FontText from '../../UI/FontText';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomInputField from '../../UI/CustomInputField';
import {AtSymbolIcon, PhoneIcon, UserIcon} from 'react-native-heroicons/solid';
import {formatPhoneNumber} from '../../../utils/utils';
import {useAppSelector} from '../../../store/hooks';
import {selectUser} from '../../../store/User/userSlice';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import CustomLoadingOverlay from '../../UI/CustomLoadingOverlay';
import {PEOPLE_PLACEHOLDER_IMG} from '../../../assets/images';
import {User} from '../../../types/schema';
import * as ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

const AccountInfoComponent = ({
  navigation,
  route,
}: NativeStackScreenProps<AccountTabParamsList, 'AccountInfo'>) => {
  const user = useAppSelector(selectUser);

  const [imageURI, setImageURI] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>();

  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const usernameErrorHandler = (val: string) => {
    // check if this username exists or not
    return false;
  };
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const phoneErrorHandler = (val: string) => {
    // check if this phone number already have an account associated with
    return val.length !== 14;
  };

  const [infoChanged, setInfoChanged] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const unsubscribe = firestore()
        .collection('users')
        .where('__name__', '==', user)
        .onSnapshot(querySnapshot => {
          setLoading(true);
          querySnapshot.forEach(query => {
            const data = query.data();
            setCurrentUser({
              id: query.id,
              name: data.name,
              username: data.username,
              phoneNumber: data.phoneNumber,
              imageUri: data.imageUri,
            });
            setFullName(data.name);
            setUsername(data.username);
            setPhoneNumber(data.phoneNumber);
            setImageURI(data.imageUri);
          });
          setTimeout(() => setLoading(false), 200); // useState re renders on the next snapshot, so must put in a callback
        });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    currentUser?.name !== fullName ||
    currentUser?.username !== username ||
    currentUser?.imageUri !== imageURI
      ? setInfoChanged(true)
      : setInfoChanged(false);
  }, [currentUser, fullName, username, imageURI]);

  return loading ? (
    <CustomLoadingOverlay />
  ) : (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.ScrollViewContent}
      className="flex-1 bg-white">
      <View className="items-center pt-10 pb-6">
        <Image
          className="w-36 h-36 rounded-full my-2"
          source={imageURI ? {uri: imageURI} : PEOPLE_PLACEHOLDER_IMG}
        />
        <TouchableOpacity
          activeOpacity={1}
          onPress={async () => {
            ImagePicker.launchImageLibrary({
              mediaType: 'photo',
              includeBase64: false,
              includeExtra: true,
            }).then(result => {
              if (result.errorCode) {
                switch (result.errorCode) {
                  case 'permission':
                    Toast.show({
                      type: 'error',
                      text1: 'Error opening image library!',
                      text2: 'Please make sure permission is enabled.',
                    });
                    break;
                  default:
                    Toast.show({
                      type: 'error',
                      text1: 'Error opening image library!',
                      text2: result.errorMessage,
                    });
                    break;
                }

                return;
              }
              if (!result.didCancel) {
                result.assets?.map(({uri}) => {
                  setImageURI(uri!);
                });
              }
            });
          }}>
          <FontText style="text-center text-green-500 text-xs font-medium">
            Edit picture
          </FontText>
        </TouchableOpacity>
      </View>
      <View className="flex items-center grow">
        <CustomInputField
          icon={<UserIcon color={'gray'} />}
          label="Name"
          placeholder="Full Name"
          value={fullName}
          defaultValue={fullName}
          onValueChange={setFullName}
          required
        />
        <CustomInputField
          icon={<AtSymbolIcon color={'gray'} />}
          label="Username"
          value={username}
          defaultValue={username}
          onValueChange={setUsername}
          placeholder="Username"
          errorHandler={usernameErrorHandler}
          required
          errorDescription="Please enter a valid username"
        />
        <CustomInputField
          icon={<PhoneIcon color={'gray'} />}
          label="Phone Number"
          value={phoneNumber}
          defaultValue={phoneNumber}
          onValueChange={setPhoneNumber}
          placeholder="(XXX) XXX-XXXX"
          inputMode="tel"
          maxLength={14}
          editable={false}
          customValueDisplay={formatPhoneNumber}
          errorDescription="Please enter a valid phone number"
          description="Your phone number cannot be changed"
        />
        <View className="grow">
          <TouchableOpacity
            disabled={!infoChanged}
            className={`p-4 w-5/6 ${
              infoChanged ? ' bg-green-900' : 'bg-gray-200'
            } rounded-full my-4 `}
            onPress={async () => {
              // update user's info in the database
              let imageURL = imageURI;
              let invalidImage = false;
              setLoading(true);
              if (user) {
                if (imageURL !== currentUser?.imageUri) {
                  let uploadURI =
                    Platform.OS === 'ios'
                      ? imageURL.replace('file://', '')
                      : imageURL;

                  await storage()
                    .ref(`/profile-images/${user}`)
                    .putFile(uploadURI)
                    .catch(() => {
                      Toast.show({
                        type: 'error',
                        text1: 'Unable to update user info!',
                        text2: 'Make sure you have a stable connection',
                      });
                      invalidImage = true;
                    });
                  if (!invalidImage) {
                    const imageResult = await storage()
                      .ref(`/profile-images/${user}`)
                      .getDownloadURL();

                    if (imageResult) {
                      imageURL = imageResult;
                    }
                  }
                }

                !invalidImage &&
                  firestore()
                    .collection('users')
                    .doc(user)
                    .update({
                      name: fullName,
                      phoneNumber,
                      username,
                      imageUri: imageURL,
                    })
                    .then(() => {
                      Toast.show({
                        type: 'success',
                        text1: 'User info updated!',
                      });
                      setInfoChanged(false);
                    })
                    .catch(() => {
                      Toast.show({
                        type: 'error',
                        text1: 'Unable to update user info!',
                        text2: 'Make sure you have a stable connection',
                      });
                    });
              }
              setLoading(false);
            }}>
            <FontText
              style={`font-medium text-center ${
                infoChanged ? 'text-white' : 'text-gray-500'
              } text-md `}>
              Save changes
            </FontText>
          </TouchableOpacity>
        </View>

        <View className="items-center space-y-2 pb-6">
          <FontText>Version 0.1</FontText>
          <TouchableOpacity
            onPress={() => {
              // set user's isActive to false in the database
            }}>
            <FontText style="font-semibold text-red-600">
              Delete Account
            </FontText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ScrollViewContent: {flexGrow: 1},
});

export default AccountInfoComponent;
