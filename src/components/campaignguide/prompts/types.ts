import { DynamicColorIOS, PlatformColor } from 'react-native';

type Color = string | DynamicColorIOS | PlatformColor;

export interface CustomColor {
  tint: Color;
  primary: Color;
}
