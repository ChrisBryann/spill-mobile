import React, {useEffect, useState} from 'react';
import {
  InputModeOptions,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontText, {FontTextStyles} from './FontText';

type Props = {
  value: string;
  onValueChange: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  inputMode?: InputModeOptions;
  maxLength?: number;
  required?: boolean;
  description?: string;
  errorDescription?: string;
  errorHandler?: (value: string) => boolean;
  customValueDisplay?: (value: string, previousValue: string) => string;
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
  errorHandler,
  customValueDisplay,
}: Props) => {
  const [error, setError] = useState<boolean>(false);

  // check for any errors everytime value
  useEffect(() => {
    if (value?.length > 0) {
      errorHandler && (errorHandler(value) ? setError(true) : setError(false));
    } else {
      setError(false);
    }
  }, [value, errorHandler]);
  return (
    <View className="py-2 space-y-1">
      <FontText style="font-semibold ">{label}</FontText>
      <TouchableOpacity
        className={`flex flex-row space-x-2 p-2 ${
          error ? 'bg-red-50' : 'bg-gray-100'
        } border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg`}>
        {icon}
        <TextInput
          className={`w-4/6 font-semibold`}
          style={FontTextStyles.text}
          placeholder={placeholder ?? ''}
          placeholderTextColor={'gray'}
          onChangeText={(val: string) => {
            onValueChange((prev: string) =>
              customValueDisplay ? customValueDisplay(val, prev) : val,
            );
          }}
          value={customValueDisplay && value}
          maxLength={maxLength}
          inputMode={inputMode}
          onBlur={
            required
              ? () => {
                  !value && setError(true);
                }
              : (() => {
                  console.log('in blur!');

                  errorHandler &&
                    (errorHandler(value) ? setError(true) : setError(false));
                }) || undefined
          }
        />
      </TouchableOpacity>
      {(!!description || !!errorDescription) && (
        <FontText
          style={`text-xs font-semibold py-1 ${error && 'text-red-500'} `}>
          {error ? errorDescription ?? description : description}
        </FontText>
      )}
    </View>
  );
};
export default CustomInputField;
