import React from 'react';

import { FactionCodeType } from '@app_constants';
import DeckSectionHeader from './DeckSectionHeader';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import RoundedFooterButton from '@components/core/RoundedFooterButton';

interface Props {
  title: string;
  faction: FactionCodeType;
  onTitlePress?: () => void;
  children: React.ReactNode | React.ReactNode[];
  footerButton?: React.ReactNode;

  toggleCollapsed?: () => void;
  collapsed?: boolean;
  collapsedText?: string;
  noSpace?: boolean;
}

export default function DeckSectionBlock({ title, onTitlePress, children, footerButton, faction, collapsed, toggleCollapsed, noSpace, collapsedText }: Props) {
  return (
    <RoundedFactionBlock
      faction={faction}
      header={<DeckSectionHeader onPress={onTitlePress} faction={faction} title={title} />}
      footer={toggleCollapsed && collapsedText ? (
        <RoundedFooterButton
          title={collapsedText}
          icon={collapsed ? 'show' : 'hide'}
          onPress={toggleCollapsed}
        />
      ) : footerButton}
      noSpace={noSpace}
    >
      { toggleCollapsed && collapsed ? null : children }
    </RoundedFactionBlock>
  );
}
