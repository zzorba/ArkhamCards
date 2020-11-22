import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import { ParsedDeck } from '@actions/types';
import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import MetadataLineComponent from './MetadataLineComponent';
import space from '@styles/space';
import { useDeckXpStrings } from '@components/deck/hooks';

interface Props {
  parsedDeck: ParsedDeck;
}

export default function ExperienceLine({ parsedDeck }: Props) {
  const { colors, typography, fontScale } = useContext(StyleContext);
  const [xpString, xpDetailString] = useDeckXpStrings(parsedDeck);
  const title = (
    <Text style={[typography.smallLabel, typography.italic, typography.dark]}>
      { t`Experience` }
    </Text>
  );
  const icon = <AppIcon name="xp" size={36} color={colors.M} />;
  const description = (
    <View style={styles.row}>
      <Text style={[typography.large, space.marginRightS]}>
        { xpString }
      </Text>
      { !!xpDetailString && (
        <Text style={[typography.small, { color: colors.M, lineHeight: 24 * fontScale }]}>
          { xpDetailString }
        </Text>
      ) }
    </View>
  );

  return (
    <MetadataLineComponent
      icon={icon}
      title={title}
      description={description}
      last
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
