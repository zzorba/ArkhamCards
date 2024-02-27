import React, { useCallback } from 'react';

import DeckButton from '@components/deck/controls/DeckButton';
import space, { s } from '@styles/space';
import { View } from 'react-native';
import StoryButton from './StoryButton';

interface Props {
  index: number;
  icon: string;
  text: string;
  description?: string,
  onPress: (index: number) => void;
  style?: 'interlude';
}

export default function BranchButton({ index, text, description, icon, onPress, style }: Props) {
  const handleOnPress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);
  if (style === 'interlude') {
    return (
      <View style={space.paddingBottomS}>
        <StoryButton
          type="interlude"
          title={text}
          description={description}
          onPress={handleOnPress}
        />
      </View>
    );
  }
  return (
    <DeckButton
      color="dark_gray"
      title={text}
      detail={description}
      encounterIcon={icon !== 'xp' ? icon : undefined}
      icon={icon === 'xp' ? icon : undefined}
      onPress={handleOnPress}
      bottomMargin={s}
      noShadow
    />
  );
}
