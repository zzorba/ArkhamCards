import React, { useCallback } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import { Deck } from '@actions/types';
import DeckButton from '@components/deck/controls/DeckButton';
import space from '@styles/space';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';

interface Props {
  deck: Deck;
  investigator: CampaignInvestigator;
  onPress: (deck: Deck, investigator: CampaignInvestigator) => void;
}

export default function UpgradeDeckButton({ deck, investigator, onPress }: Props) {
  const buttonOnPress = useCallback(() => {
    onPress(deck, investigator);
  }, [deck, investigator, onPress]);

  return (
    <View style={[space.paddingTopS, space.paddingBottomS, space.paddingRightM]}>
      <DeckButton
        thin
        icon="upgrade"
        color="gold"
        title={t`Upgrade deck`}
        onPress={buttonOnPress}
      />
    </View>
  );
}