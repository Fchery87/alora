const Reanimated = {
  createAnimatedComponent: (component: any) => component,
  View: "View",
  Text: "Text",
  ScrollView: "ScrollView",
};

export const useSharedValue = (value: any) => ({ value });
export const useAnimatedStyle = () => ({});
export const withTiming = (value: any) => value;
export const withSpring = (value: any) => value;
export const Easing = {};

export default Reanimated;
