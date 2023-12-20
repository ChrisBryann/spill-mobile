import React, {useState} from 'react';
import {
  InputModeOptions,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontText, {FontTextStyles} from './FontText';

type Props = {
  icon?: React.ReactNode;
  value?: string;
  onValueChange: (text: string) => void;
  label: string;
  placeholder?: string;
  inputMode?: InputModeOptions;
  maxLength?: number;
  required?: boolean;
  description?: string;
  errorDescription?: string;
};

const CustomInputField = ({
  icon,
  label,
  onValueChange,
  value,
  placeholder,
  inputMode,
  maxLength,
  required,
  description,
  errorDescription,
}: Props) => {
  const [error, setError] = useState<boolean>(false);
  return (
    <View className="py-2 space-y-1">
      <FontText style="font-semibold ">{label}</FontText>
      <TouchableOpacity
        className={`flex flex-row space-x-2 p-2 ${
          error ? 'bg-red-50' : 'bg-gray-100'
        } border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg`}>
        {icon}
        <TextInput
          className={`w-4/6 font-semibold ${error && 'text-red-500'}`}
          style={FontTextStyles.text}
          placeholder={placeholder ?? ''}
          placeholderTextColor={'gray'}
          onChangeText={onValueChange}
          value={value}
          maxLength={maxLength}
          inputMode={inputMode}
        />
      </TouchableOpacity>
      {(!!description || !!errorDescription) && (
        <FontText style={`text-xs font-semibold ${error && 'text-red-500'} `}>
          {description ?? errorDescription}
        </FontText>
      )}
    </View>
  );
};
export default CustomInputField;
