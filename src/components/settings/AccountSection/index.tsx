import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import ArkhamDbLoginButton from './auth/ArkhamDbLoginButton';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import ArkhamCardsAccountDetails from './ArkhamCardsAccountDetails';
import { NavigationProps } from '@components/nav/types';
import space from '@styles/space';
import { ShowAlert } from '@components/deck/dialogs';
import { useSelector } from 'react-redux';
import { getEnableArkhamCardsAccount } from '@reducers';
import DeckButton from '@components/deck/controls/DeckButton';
import { useShowOnboarding } from '@components/onboarding/hooks';

interface Props extends NavigationProps {
  showAlert: ShowAlert;
}

const LATEST_RELEASE_NOTES = 'rn-2022-09-20';

export default function AccountSection({ componentId, showAlert }: Props) {
  const enableArkhamCardsAccount = useSelector(getEnableArkhamCardsAccount);
  const [newNotes, onSeenNewNotes] = useShowOnboarding(LATEST_RELEASE_NOTES);
  const showReleaseNotes = useCallback(() => {
    onSeenNewNotes();
    Navigation.push(componentId, {
      component: {
        name: 'Settings.ReleaseNotes',
        options: {
          topBar: {
            title: {
              text: t`Recent updates`,
            },
            backButton: {
              title: t`Done`,
            },
          },
        },
      },
    });
  }, [onSeenNewNotes, componentId]);

  return (
    <>
      <View style={[space.paddingSideS, space.paddingBottomS]}>
        <RoundedFactionBlock faction="mystic" header={<DeckSectionHeader faction="mystic" title={t`Arkham Cards Account`} />}>
          <ArkhamCardsAccountDetails componentId={componentId} showAlert={showAlert} />
          <View style={space.paddingTopS}>
            <DeckButton
              icon="xp"
              color={newNotes ? 'gold' : 'default'}
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

