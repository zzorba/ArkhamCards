import React from 'react';
import { t } from 'ttag';

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
}

export default function DeckSectionBlock({ title, onTitlePress, children, footerButton, faction, collapsed, toggleCollapsed }: Props) {
  return (
    <RoundedFactionBlock
      faction={faction}
      header={<DeckSectionHeader onPress={onTitlePress} faction={faction} title={title} />}
      footer={toggleCollapsed ? (
        <RoundedFooterButton
          title={collapsed ? t`Show cards` : t`Hide cards`}
          icon={collapsed ? 'show' : 'hide'}
          onPress={toggleCollapsed}
        />
      ) : footerButton}
    >
      { children }
    </RoundedFactionBlock>
  );
}
