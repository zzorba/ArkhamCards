import React, { useContext, useMemo } from 'react';
import { Platform, Text } from 'react-native';

import StyleContext from '@styles/StyleContext';
import { map } from 'lodash';
import ArkhamIcon from '@icons/ArkhamIcon';

interface Props {
  title: string;
}

const TITLE_MATCH = /^(.*?)(\[.*?\])(.*?)?$/;

type TitlePiece = {
  type: 'text';
  text: string;
} | {
  type: 'icon';
  icon: string;
}

export default function RuleTitleComponent({ title }: Props) {
  const { colors } = useContext(StyleContext);
  const parsed: TitlePiece[] = useMemo(() => {
    const match = title.match(TITLE_MATCH);
    if (!match) {
      return [{ type: 'text', text: title }];
    }
    const matches: TitlePiece[] = [];
    if (match.length > 1 && match[1]) {
      matches.push({ type: 'text', text: match[1] });
    }
    if (match.length > 2 && match[2]) {
      matches.push({ type: 'icon', icon: match[2].substring(1, match[2].length - 2) });
    }
    if (match.length > 3 && match[3]) {
      matches.push({ type: 'text', text: match[3] });
    }
    return matches;
  }, [title])
  return (
    <Text numberOfLines={1} adjustsFontSizeToFit ellipsizeMode="tail" style={{
      color: colors.darkText,
      fontFamily: 'Alegreya-Medium',
      fontSize: 20,
      marginTop: Platform.OS === 'android' ? 12 : 0,
      marginLeft: Platform.OS === 'android' ? 16 : 0,
    }}>
      { map(parsed, (item, idx) => {
        if (item.type === 'text') {
          return <Text key={idx}>{item.text}</Text>;
        }
        return <ArkhamIcon key={idx} name={item.icon} size={22} color={colors.darkText} />;
      }) }
    </Text>
  );
}
