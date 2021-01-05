import React, { useMemo } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import ArkhamCardsLoginButton from './auth/ArkhamCardsLoginButton';
import ArkhamDbLoginButton from './auth/ArkhamDbLoginButton';
import { SHOW_DISSONANT_VOICES } from '@lib/audio/narrationPlayer';
import DissonantVoicesLoginButton from './auth/DissonantVoicesLoginButton';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import ArkhamCardsAccountDetails from './ArkhamCardsAccountDetails';
import { NavigationProps } from '@components/nav/types';
import space from '@styles/space';

const SHOW_ARKHAM_CARDS_ACCOUNT = true;
export default function AccountSection({ componentId }: NavigationProps) {
  const otherHeader = useMemo(() => {
    if (SHOW_ARKHAM_CARDS_ACCOUNT) {
      return SHOW_DISSONANT_VOICES ? t`Other Accounts` : t`ArkhamDB Account`;
    }
    return SHOW_DISSONANT_VOICES ? t`Accounts` : t`ArkhamDB Account`;
  }, []);
  return (
    <>
      { SHOW_ARKHAM_CARDS_ACCOUNT && (
        <View style={[space.paddingSideS, space.paddingBottomS]}>
          <RoundedFactionBlock faction="mystic" header={<DeckSectionHeader faction="mystic" title={t`Arkham Cards Account`} />}>
            <ArkhamCardsAccountDetails componentId={componentId} />
            <ArkhamCardsLoginButton />
          </RoundedFactionBlock>
        </View>
      ) }
      <View style={[space.paddingSideS, space.paddingBottomS]}>
        <RoundedFactionBlock faction="neutral" header={<DeckSectionHeader faction="neutral" title={otherHeader} />}>
          <ArkhamDbLoginButton last={!SHOW_DISSONANT_VOICES} />
          { SHOW_DISSONANT_VOICES && <DissonantVoicesLoginButton last /> }
        </RoundedFactionBlock>
      </View>
    </>
  );
}

