import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { msgid, ngettext, t } from 'ttag';

import { ParsedDeck } from '@actions/types';
import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import MetadataLineComponent from './MetadataLineComponent';
import space from '@styles/space';

interface Props {
  parsedDeck: ParsedDeck;
}

export default function ExperienceLine({ parsedDeck: { deck, experience, availableExperience, changes } }: Props) {
  const { colors, typography, fontScale } = useContext(StyleContext);
  const title = (
    <Text style={[typography.smallLabel, typography.italic, typography.dark]}>
      { t`Experience` }
    </Text>
  );
  const icon = <AppIcon name="xp" size={36} color={colors.M} />;
  const unspentXp = availableExperience - (changes?.spentXp || 0);
  const unspentXpStr = availableExperience > 0 ? `+${unspentXp}` : `${unspentXp}`;
  const description = (
    <View style={styles.row}>
      <Text style={[typography.large, space.marginRightS]}>
        { ngettext(msgid`${experience} XP`, `${experience} XP`, experience) }
      </Text>
      { !!deck.previous_deck && (
        <Text style={[typography.small, { color: colors.M, lineHeight: 24 * fontScale }]}>
          { ngettext(msgid`${unspentXpStr} unspent`, `${unspentXpStr} unspent`, unspentXp) }
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
