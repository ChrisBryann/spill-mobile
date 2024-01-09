import React from 'react';
import {StyleSheet, Text} from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: string | undefined;
};
const FontText = ({children, style}: Props) => {
  return (
    <Text className={`${style}`} style={FontTextStyles.text}>
      {children}
    </Text>
  );
};

export default FontText;

export const FontTextStyles = StyleSheet.create({
  text: {fontFamily: 'Inter'},
});
