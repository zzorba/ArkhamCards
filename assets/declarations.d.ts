declare module "*.svg" {
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps & { faction?: string; border?: string }>;
  export default content;
}