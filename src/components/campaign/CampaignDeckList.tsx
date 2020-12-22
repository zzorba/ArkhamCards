import React, { ReactNode, useCallback } from 'react';
import { map } from 'lodash';
import {
  Platform,
  View,
} from 'react-native';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { Deck } from '@actions/types';
import { MyDecksSelectorProps } from '@components/campaign/MyDecksSelectorDialog';
import Card from '@data/Card';

export interface CampaignDeckListProps {
  componentId: string;
  campaignId: number;
  deckIds: number[];
  investigatorIds: string[];
  deckAdded?: (deck: Deck) => void;
  investigatorAdded?: (investigator: Card) => void;
}

interface Props extends CampaignDeckListProps {
  renderDeck: (deckId: number) => ReactNode;
  renderInvestigator?: (investigator: string) => ReactNode;
}

export default function CampaignDeckList({
  campaignId,
  deckIds,
  investigatorIds,
  deckAdded,
  investigatorAdded,
  renderDeck,
  renderInvestigator,
}: Props) {
  const showDeckSelector = useCallback(() => {
    if (deckAdded) {
      const passProps: MyDecksSelectorProps = {
        campaignId: campaignId,
        onDeckSelect: deckAdded,
        onInvestigatorSelect: investigatorAdded,
        selectedDeckIds: deckIds,
        selectedInvestigatorIds: investigatorIds,
      };
      Navigation.showModal<MyDecksSelectorProps>({
        stack: {
          children: [{
            component: {
              name: 'Dialog.DeckSelector',
              passProps,
              options: {
                modalPresentationStyle: Platform.OS === 'ios' ?
                  OptionsModalPresentationStyle.fullScreen :
                  OptionsModalPresentationStyle.overCurrentContext,
              },
            },
          }],
        },
      });
    }
  }, [deckIds, investigatorIds, deckAdded, investigatorAdded, campaignId]);

  return (
    <View>
      { map(deckIds, deckId => (
        renderDeck(deckId)
      )) }
      { !!renderInvestigator && map(investigatorIds, investigator => (
        renderInvestigator(investigator)
      )) }
      { !!deckAdded && (
        <BasicButton
          title={investigatorAdded ? t`Add Investigator` : t`Add Investigator Deck`}
          onPress={showDeckSelector}
        />
      ) }
    </View>
  );
}
