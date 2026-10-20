import React from 'react';
import { View } from 'react-native';

import { t } from 'ttag';

import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import ArkhamDbLoginButton from './auth/ArkhamDbLoginButton';
import ArkhamBuildLoginButton from './auth/ArkhamBuildLoginButton';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import ArkhamCardsAccountDetails from './ArkhamCardsAccountDetails';
import space from '@styles/space';
import { ShowAlert } from '@components/deck/dialogs';

interface Props {
  showAlert: ShowAlert;
}

export default function AccountSection({ showAlert }: Props) {
  return (
    <>
      <View style={[space.paddingSideS, space.paddingBottomS]}>
        <RoundedFactionBlock faction="mystic" header={<DeckSectionHeader faction="mystic" title={t`Arkham Cards Account`} />}>
          <ArkhamCardsAccountDetails showAlert={showAlert} />
        </RoundedFactionBlock>
      </View>
      <View style={[space.paddingSideS, space.paddingBottomS]}>
        <RoundedFactionBlock faction="neutral" header={<DeckSectionHeader faction="neutral" title={t`Deck Services`} />}>
          <ArkhamBuildLoginButton showAlert={showAlert} />
          <ArkhamDbLoginButton last showAlert={showAlert} />
        </RoundedFactionBlock>
      </View>
    </>
  );
}
