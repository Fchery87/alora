import { useMemo } from 'react';
import { MotiPressable } from 'moti/interactions';
import { cssInterop } from 'react-native-css-interop';
import { Text } from './Text';

const StyledMotiPressable = cssInterop(MotiPressable, { className: 'style' });

interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function Button({ 
  onPress, 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false
}: ButtonProps) {
  
  const containerClasses = useMemo(() => {
    let classes = "rounded-xl flex-row items-center justify-center";
    
    // Size
    if (size === 'sm') classes += " px-3 py-2";
    if (size === 'md') classes += " px-6 py-3";
    if (size === 'lg') classes += " px-8 py-4";

    // Variant
    if (variant === 'primary') classes += " bg-banana-500 border border-banana-600";
    if (variant === 'secondary') classes += " bg-nano-800 border border-nano-700";
    if (variant === 'outline') classes += " bg-transparent border-2 border-banana-500";
    if (variant === 'ghost') classes += " bg-transparent";
    if (variant === 'glass') classes += " bg-white/10 border border-white/20 backdrop-blur-md";

    if (disabled) classes += " opacity-50";
    
    return classes;
  }, [variant, size, disabled]);

  const textClasses = useMemo(() => {
    let classes = "font-bold text-center";
    
    // Size text
    if (size === 'sm') classes += " text-sm";
    if (size === 'md') classes += " text-base";
    if (size === 'lg') classes += " text-lg";

    // Variant text color
    if (variant === 'primary') classes += " text-nano-950"; // Black text on yellow
    if (variant === 'secondary') classes += " text-banana-500";
    if (variant === 'outline') classes += " text-banana-500";
    if (variant === 'ghost') classes += " text-nano-text dark:text-gray-200";
    if (variant === 'glass') classes += " text-white";

    return classes;
  }, [variant, size]);

  return (
    <StyledMotiPressable
      onPress={disabled ? undefined : onPress}
      animate={({ hovered, pressed }) => {
        'worklet';
        return {
          opacity: pressed ? 0.9 : disabled ? 0.5 : 1,
          scale: pressed ? 0.98 : 1,
        };
      }}
      className={`${containerClasses} ${className}`}
    >
      <Text className={textClasses}>{children}</Text>
    </StyledMotiPressable>
  );
}
