import React, { useContext, useMemo } from 'react';
import { Platform, Text } from 'react-native';

import StyleContext from '@styles/StyleContext';
import { map } from 'lodash';
import ArkhamIcon from '@icons/ArkhamIcon';

interface Props {
  text: string;
  iconSize: number;
}

const ICON_MATCH = /^(.*?)(\[.*?\])(.*?)?$/;

type TitlePiece = {
  type: 'text';
  text: string;
} | {
  type: 'icon';
  icon: string;
}

const parseText = (title: string): TitlePiece[] => {
  const match = title.match(ICON_MATCH);
  if (!match) {
    return [{ type: 'text', text: title }];
  }
  const matches: TitlePiece[] = [];
  if (match.length > 1 && match[1]) {
    matches.push({ type: 'text', text: match[1] });
  }
  if (match.length > 2 && match[2]) {
    matches.push({ type: 'icon', icon: match[2].substring(1, match[2].length - 1) });
  }
  if (match.length > 3 && match[3]) {
    const subMatches = parseText(match[3]);
    matches.push(...subMatches);
  }
  return matches;
}

export default function IconizedText({ text, iconSize }: Props) {
  const { colors } = useContext(StyleContext);
  const parsed: TitlePiece[] = useMemo(() => parseText(text), [text]);
  return (
    <>
      { map(parsed, (item, idx) => {
        if (item.type === 'text') {
          return <Text key={idx}>{item.text}</Text>;
        }
        return <ArkhamIcon key={idx} name={item.icon} size={iconSize} color={colors.darkText} />;
      }) }
    </>
  );
}
