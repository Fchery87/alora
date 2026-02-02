import { View, ViewProps } from 'react-native';
import { useMemo } from 'react';

interface CardProps extends ViewProps {
  className?: string;
  variant?: 'default' | 'glass' | 'banana' | 'outlined';
}

export function Card({ className = '', variant = 'default', children, style, ...props }: CardProps) {
  const variantClasses = useMemo(() => {
    switch (variant) {
      case 'glass':
        return 'bg-white/5 border border-white/10 backdrop-blur-md'; // Glassmorphism
      case 'banana':
        return 'bg-banana-100 border border-banana-300 dark:bg-banana-950 dark:border-banana-900';
      case 'outlined':
        return 'bg-transparent border border-nano-200 dark:border-nano-800';
      case 'default':
      default:
        return 'bg-white dark:bg-nano-surface border border-nano-100 dark:border-nano-800 shadow-sm';
    }
  }, [variant]);

  return (
    <View 
      className={`rounded-2xl p-4 ${variantClasses} ${className}`} 
      style={style}
      {...props} 
    >
      {children}
    </View>
  );
}
