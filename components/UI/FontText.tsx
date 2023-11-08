import React from 'react';
import {Text} from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: string | undefined;
};
const FontText = ({children, style}: Props) => {
  return (
    <Text className={`${style}`} style={{fontFamily: 'Quicksand'}}>
      {children}
    </Text>
  );
};

export default FontText;
