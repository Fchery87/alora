import { Text as RNText, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  className?: string;
  variant?: 'default' | 'muted' | 'title' | 'subtitle' | 'banana';
}

export function Text({ className = '', variant = 'default', style, ...props }: CustomTextProps) {
  let baseStyle = "font-sans text-nano-text dark:text-gray-100";
  
  if (variant === 'muted') baseStyle += " text-nano-500 dark:text-gray-400";
  if (variant === 'banana') baseStyle += " text-banana-500";
  if (variant === 'title') baseStyle += " text-2xl font-bold text-banana-500";
  if (variant === 'subtitle') baseStyle += " text-lg font-medium text-nano-300 dark:text-gray-300";

  return (
    <RNText 
      className={`${baseStyle} ${className}`} 
      style={style}
      {...props} 
    />
  );
}
