import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Text } from './ui/Text';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 40, showText = true, className = '' }: LogoProps) {
  return (
    <View className={`flex-row items-center gap-2 ${className}`}>
      <View className="relative">
        {/* Nano Banana Icon - A stylized tech banana */}
        <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
           {/* Tech background circle/hexagon effect */}
           <Circle cx="20" cy="20" r="18" fill="#1F1F1F" />
           <Circle cx="20" cy="20" r="18" stroke="#333" strokeWidth="1.5" strokeDasharray="4 2" />
           
           {/* The Banana Shape - Neon Yellow */}
           <Path 
             d="M12 28C12 28 10 20 16 14C22 8 30 8 30 8C30 8 26 10 22 14C18 18 18 24 18 24" 
             stroke="#FFE135" 
             strokeWidth="3" 
             strokeLinecap="round" 
             strokeLinejoin="round"
           />
           {/* Nano Node - A tech dot connected */}
           <Circle cx="30" cy="8" r="3" fill="#FFE135" />
           <Circle cx="12" cy="28" r="2" fill="#FFE135" />
        </Svg>
      </View>
      
      {showText && (
        <View>
          <Text className="text-2xl font-bold text-nano-950 dark:text-gray-100 leading-tight">
            Nano<Text className="text-banana-500">Banana</Text>
          </Text>
        </View>
      )}
    </View>
  );
}
