import { Text as RNText, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  bold?: boolean;
}

export function Text({ className = '', bold = false, style, ...props }: CustomTextProps) {
  const fontFamily = bold ? 'Comfortaa_700Bold' : 'Comfortaa_400Regular';
  return (
    <RNText
      className={`text-white ${className}`}
      style={[{ fontFamily }, style]}
      {...props}
    />
  );
}