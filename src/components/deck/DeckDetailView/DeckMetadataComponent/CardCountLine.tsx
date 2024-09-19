import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { msgid, ngettext, t } from 'ttag';

import { ParsedDeck } from '@actions/types';
import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import MetadataLineComponent from './MetadataLineComponent';
import space from '@styles/space';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  parsedDeck: ParsedDeck;
  bondedCardCount: number;
  last?: boolean;
}

export default function CardCountLine({ parsedDeck: { normalCardCount, totalCardCount }, bondedCardCount, last }: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const title = (
    <Text style={[typography.smallLabel, typography.italic, typography.dark]}>
      { t`Card count` }
    </Text>
  );
  const icon = <AppIcon name="card-outline" size={32} color={colors.M} />;
  const description = (
    <View style={styles.row}>
      <Text style={[typography.large, space.marginRightXs]}>
        { ngettext(msgid`${normalCardCount} · ${totalCardCount} total`, `${normalCardCount} · ${totalCardCount} total`, totalCardCount) }
      </Text>
      { bondedCardCount > 0 && (
        <Text style={[typography.small, { color: colors.M, lineHeight: (lang === 'zh' || lang === 'zh-cn' ? 22 : 20) * fontScale }]}>
          {'· '}{ ngettext(msgid`${bondedCardCount} bound`, `${bondedCardCount} bound`, bondedCardCount) }
        </Text>
      ) }
    </View>
  );

  return (
    <MetadataLineComponent
      icon={icon}
      title={title}
      description={description}
      last={last}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
