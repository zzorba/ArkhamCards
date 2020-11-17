import React from 'react';

import { FactionCodeType } from '@app_constants';
import DeckSectionHeader from './DeckSectionHeader';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';

interface Props {
  title: string;
  faction: FactionCodeType;
  onTitlePress?: () => void;
  children: React.ReactNode | React.ReactNode[];
  footerButton?: React.ReactNode;
}

export default function DeckSectionBlock({ title, onTitlePress, children, footerButton, faction }: Props) {
  return (
    <RoundedFactionBlock
      faction={faction}
      header={<DeckSectionHeader onPress={onTitlePress} faction={faction} title={title} />}
      footer={footerButton}
    >
      { children }
    </RoundedFactionBlock>
  );
}
