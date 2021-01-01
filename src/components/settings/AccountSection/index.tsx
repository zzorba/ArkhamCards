import React from 'react';
import { t } from 'ttag';

import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import ArkhamCardsLoginButton from './auth/ArkhamCardsLoginButton';
import ArkhamDbLoginButton from './auth/ArkhamDbLoginButton';
import { SHOW_DISSONANT_VOICES } from '@lib/audio/narrationPlayer';
import DissonantVoicesLoginButton from './auth/DissonantVoicesLoginButton';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import ArkhamCardsAccountDetails from './ArkhamCardsAccountDetails'

export default function AccountSection() {
  return (
    <RoundedFactionBlock faction="neutral" header={<DeckSectionHeader faction="neutral" title={t`Accounts`} />}>
      <ArkhamCardsAccountDetails />
      <ArkhamCardsLoginButton>
        <ArkhamDbLoginButton last={!SHOW_DISSONANT_VOICES} />
        { SHOW_DISSONANT_VOICES && <DissonantVoicesLoginButton last /> }
      </ArkhamCardsLoginButton>
    </RoundedFactionBlock>
  );
}

