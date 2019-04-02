import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
} from 'react-native';

import Card from '../data/Card';
import FactionGradient from './core/FactionGradient';
import ArkhamIcon from '../assets/ArkhamIcon';

interface Props {
  name: string;
  investigator?: Card;
  compact?: boolean;
  button?: ReactNode;
}

export default function DeckTitleBarComponent({
  name,
  investigator,
  compact,
  button,
}: Props) {
  const hasFactionColor = !!(investigator && investigator.faction_code);
  const faction_code = (investigator && investigator.faction_code) || 'neutral';
  const iconName = investigator &&
    (investigator.faction_code === 'neutral' ? 'elder_sign' : investigator.faction_code);
  return (
    <FactionGradient
      faction_code={faction_code}
      style={styles.titleBar}
      dark
    >
      { !!iconName && <ArkhamIcon name={iconName} size={28} color="#FFFFFF" /> }
      <Text
        style={[styles.title, { color: hasFactionColor ? '#FFFFFF' : '#000000' }]}
        numberOfLines={compact ? 1 : 2}
        ellipsizeMode="tail"
      >
        { name }
      </Text>
      { !!button && button }
    </FactionGradient>
  );
}


const styles = StyleSheet.create({
  titleBar: {
    width: '100%',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    marginLeft: 8,
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 22,
    flex: 1,
  },
});
