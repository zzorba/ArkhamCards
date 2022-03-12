import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import BorderWrapper from '@components/campaignguide/BorderWrapper';

interface Props {
  type: 'resolution' | 'interlude';
  title: string;
  description?: string;
  onPress: () => void;
}
export default function StoryButton({ title, description, onPress, type }: Props) {
  const { colors, typography, width } = useContext(StyleContext);
  return (
    <View style={space.paddingBottomS}>
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.resolutionBlock, { backgroundColor: colors.campaign.background[type] }]}>
          <BorderWrapper border color={type} width={width - s * 4}>
            <View style={[styles.resolutionContent, space.paddingS, space.paddingTopL]}>
              <Text style={[typography.bigGameFont, { color: colors.campaign.text[type] }]}>{title}</Text>
              { !!description && <Text style={typography.mediumGameFont}>{description}</Text> }
            </View>
          </BorderWrapper>
        </View>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  resolutionBlock: {
    borderRadius: 8,
  },
  resolutionContent: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
