import React, { ReactNode } from 'react';
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
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import Card, { CardsMap } from '@data/Card';

export interface DeckListProps {
  componentId: string;
  fontScale: number;
  campaignId: number;
  deckIds: number[];
  investigatorIds: string[];
  deckAdded?: (deck: Deck) => void;
  investigatorAdded?: (investigator: Card) => void;
}

interface OwnProps extends DeckListProps {
  renderDeck: (
    deckId: number,
    cards: CardsMap,
    investigators: CardsMap
  ) => ReactNode;
  renderInvestigator?: (
    investigator: string,
    investigators: CardsMap
  ) => ReactNode;
  otherProps?: any;
}

class DeckList extends React.Component<OwnProps & PlayerCardProps> {
  _showDeckSelector = () => {
    const {
      deckIds,
      investigatorIds,
      deckAdded,
      investigatorAdded,
      campaignId,
    } = this.props;
    if (deckAdded) {
      const passProps: MyDecksSelectorProps = {
        campaignId: campaignId,
        onDeckSelect: deckAdded,
        onInvestigatorSelect: investigatorAdded,
        selectedDeckIds: deckIds,
        selectedInvestigatorIds: investigatorIds,
      };
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'Dialog.DeckSelector',
              passProps,
              options: {
                modalPresentationStyle: Platform.OS === 'ios' ?
                  OptionsModalPresentationStyle.overFullScreen :
                  OptionsModalPresentationStyle.overCurrentContext,
              },
            },
          }],
        },
      });
    }
  };

  render() {
    const {
      deckIds,
      deckAdded,
      investigatorAdded,
      investigatorIds,
      cards,
      investigators,
      renderDeck,
      renderInvestigator,
    } = this.props;
    return (
      <View>
        { map(deckIds, deckId => (
          renderDeck(deckId, cards, investigators)
        )) }
        { !!renderInvestigator && map(investigatorIds, investigator => (
          renderInvestigator(investigator, investigators)
        )) }
        { !!deckAdded && (
          <BasicButton
            title={investigatorAdded ? t`Add Investigator` : t`Add Investigator Deck`}
            onPress={this._showDeckSelector}
          />
        ) }
      </View>
    );
  }
}

export default withPlayerCards<OwnProps>(DeckList);
