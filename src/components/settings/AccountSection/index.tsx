import React, { useCallback } from 'react';
import { View } from 'react-native';

import { t } from 'ttag';

import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import ArkhamDbLoginButton from './auth/ArkhamDbLoginButton';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import ArkhamCardsAccountDetails from './ArkhamCardsAccountDetails';
import space from '@styles/space';
import { ShowAlert } from '@components/deck/dialogs';
import DeckButton from '@components/deck/controls/DeckButton';
import { useShowOnboarding } from '@components/onboarding/hooks';
import { useNavigation } from '@react-navigation/native';

interface Props {
  showAlert: ShowAlert;
}

const LATEST_RELEASE_NOTES = 'rn-2024-02-20';

export default function AccountSection({ showAlert }: Props) {
  const navigation = useNavigation();
  const [newNotes, onSeenNewNotes] = useShowOnboarding(LATEST_RELEASE_NOTES);
  const showReleaseNotes = useCallback(() => {
    onSeenNewNotes();
    navigation.navigate('Settings.ReleaseNotes');
  }, [onSeenNewNotes, navigation]);

  return (
    <>
      <View style={[space.paddingSideS, space.paddingBottomS]}>
        <RoundedFactionBlock faction="mystic" header={<DeckSectionHeader faction="mystic" title={t`Arkham Cards Account`} />}>
          <ArkhamCardsAccountDetails showAlert={showAlert} />
          <View style={space.paddingTopS}>
            <DeckButton
              icon="xp"
              color={newNotes ? 'gold' : 'dark_gray'}
              title={t`Recent updates`}
              detail={t`Learn about recently added features`}
              onPress={showReleaseNotes}
            />
          </View>
        </RoundedFactionBlock>
      </View>
      <View style={[space.paddingSideS, space.paddingBottomS]}>
        <RoundedFactionBlock faction="neutral" header={<DeckSectionHeader faction="neutral" title={t`ArkhamDB Account`} />}>
          <ArkhamDbLoginButton last showAlert={showAlert} />
        </RoundedFactionBlock>
      </View>
    </>
  );
}

