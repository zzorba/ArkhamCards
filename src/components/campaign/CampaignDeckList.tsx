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
  deckIds: number[];
  investigatorIds: string[];
}

interface Props extends CampaignDeckListProps {
  renderDeck: (deckId: number) => ReactNode;
  renderInvestigator?: (investigator: string) => ReactNode;
}

export default function CampaignDeckList({
  deckIds,
  investigatorIds,
  renderDeck,
  renderInvestigator,
}: Props) {
  return (
    <View>
      { map(deckIds, deckId => (
        renderDeck(deckId)
      )) }
      { !!renderInvestigator && map(investigatorIds, investigator => (
        renderInvestigator(investigator)
      )) }
    </View>
  );
}
