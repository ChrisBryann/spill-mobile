import React from 'react';
import FontText from './FontText';

type Props = {
  children: string;
  tintColor?: string | undefined;
};

const CustomHeaderTitle = ({children}: Props) => (
  <FontText style="font-bold text-lg">{children}</FontText>
);

export default CustomHeaderTitle;
