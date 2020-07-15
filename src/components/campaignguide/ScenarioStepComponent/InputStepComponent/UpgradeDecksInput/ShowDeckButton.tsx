import React from 'react';
import { Button } from 'react-native';
import { connect } from 'react-redux';
import { t } from 'ttag';

import { Deck } from 'actions/types';
import { showDeckModal } from '@components/nav/helper';
import Card from '@data/Card';
import { AppState, getDeck } from '@reducers';

interface OwnProps {
  componentId: string;
  deckId: number;
  investigator: Card;
}
interface ReduxProps {
  deck?: Deck;
}

type Props = OwnProps & ReduxProps;

class ShowDeckButton extends React.Component<Props> {
  _onPress = () => {
    const {
      componentId,
      investigator,
      deck,
    } = this.props;
    if (deck) {
      showDeckModal(
        componentId,
        deck,
        investigator,
        undefined,
        true
      );
    }
  };

  render() {
    const { deck } = this.props;
    if (!deck) {
      return null;
    }
    return (
      <Button
        title={t`View deck upgrade`}
        onPress={this._onPress}
      />
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  return {
    deck: getDeck(state, props.deckId) || undefined,
  };
}
export default connect(mapStateToProps)(ShowDeckButton);
