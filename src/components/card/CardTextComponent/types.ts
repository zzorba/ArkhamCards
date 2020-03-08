import { Node } from 'react-native-markdown-view';

export interface WithChildren {
  children: Node;
}

export interface WithText {
  text: string;
}

export interface WithIconName {
  name: string;
}

export interface State {
  blockquote?: boolean;
}
