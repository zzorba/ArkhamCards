import React, { ReactNode } from 'react';
import { map } from 'lodash';
import {
  Button,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';

import { t } from 'ttag';
import { Deck } from 'actions/types';
import { MyDecksSelectorProps } from 'components/campaign/MyDecksSelectorDialog';
import withPlayerCards, { PlayerCardProps } from 'components/core/withPlayerCards';
import { CardsMap } from 'data/Card';

export interface DeckListProps {
  componentId: string;
  fontScale: number;
  campaignId: number;
  deckIds: number[];
  deckAdded?: (deck: Deck) => void;
}

interface OwnProps extends DeckListProps {
  renderDeck: (
    deckId: number,
    cards: CardsMap,
    investigators: CardsMap
  ) => ReactNode;
  otherProps?: any;
}

class DeckList extends React.Component<OwnProps & PlayerCardProps> {
  _showDeckSelector = () => {
    const {
      deckIds,
      deckAdded,
      campaignId,
    } = this.props;
    if (deckAdded) {
      const passProps: MyDecksSelectorProps = {
        campaignId: campaignId,
        onDeckSelect: deckAdded,
        selectedDeckIds: deckIds,
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
      cards,
      investigators,
      renderDeck,
    } = this.props;
    return (
      <View>
        { map(deckIds, deckId => (
          renderDeck(deckId, cards, investigators)
        )) }
        { !!deckAdded && (
          <View style={styles.button}>
            <Button
              title={t`Add Investigator Deck`}
              onPress={this._showDeckSelector}
            />
          </View>
        ) }
      </View>
    );
  }
}

export default withPlayerCards<OwnProps>(DeckList);

const styles = StyleSheet.create({
  button: {
    margin: 8,
  },
});
