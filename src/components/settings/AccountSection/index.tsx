import React from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import ArkhamCardsLoginButton from './auth/ArkhamCardsLoginButton';
import ArkhamDbLoginButton from './auth/ArkhamDbLoginButton';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import ArkhamCardsAccountDetails from './ArkhamCardsAccountDetails';
import { NavigationProps } from '@components/nav/types';
import space from '@styles/space';
import { ENABLE_ARKHAM_CARDS_ACCOUNT } from '@app_constants';
import { ShowAlert } from '@components/deck/dialogs';

interface Props extends NavigationProps {
  showAlert: ShowAlert;
}

export default function AccountSection({ componentId, showAlert }: Props) {
  return (
    <>
      { ENABLE_ARKHAM_CARDS_ACCOUNT && (
        <View style={[space.paddingSideS, space.paddingBottomS]}>
          <RoundedFactionBlock faction="mystic" header={<DeckSectionHeader faction="mystic" title={t`Arkham Cards Account`} />}>
            <ArkhamCardsAccountDetails componentId={componentId} />
            <ArkhamCardsLoginButton showAlert={showAlert} />
          </RoundedFactionBlock>
        </View>
      ) }
      <View style={[space.paddingSideS, space.paddingBottomS]}>
        <RoundedFactionBlock faction="neutral" header={<DeckSectionHeader faction="neutral" title={t`ArkhamDB Account`} />}>
          <ArkhamDbLoginButton last showAlert={showAlert} />
        </RoundedFactionBlock>
      </View>
    </>
  );
}

