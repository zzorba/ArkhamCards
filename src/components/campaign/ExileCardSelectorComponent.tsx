import React from 'react';
import {
  Text,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { t } from 'ttag';

import { Deck, Slots } from 'actions/types';
import Card from 'data/Card';
import { getDeck, AppState } from 'reducers';
import typography from 'styles/typography';
import CardSelectorComponent from '../cardlist/CardSelectorComponent';

interface OwnProps {
  componentId: string;
  id: number;
  exileCounts: Slots;
  updateExileCounts: (exileCounts: Slots) => void;
  showLabel?: boolean;
}

interface ReduxProps {
  deck?: Deck;
}

type Props = OwnProps & ReduxProps;

class ExileCardSelectorComponent extends React.Component<Props> {
  _isExile = (card: Card) => {
    return !!card.exile;
  };

  render() {
    const {
      componentId,
      deck,
      exileCounts,
      updateExileCounts,
      showLabel,
    } = this.props;
    if (!deck) {
      return null;
    }

    const header = !!showLabel && (
      <Text style={[typography.small, styles.exileText]}>
        { t`Exiled cards` }
      </Text>
    );
    return (
      <CardSelectorComponent
        componentId={componentId}
        slots={deck.slots}
        counts={exileCounts}
        updateCounts={updateExileCounts}
        filterCard={this._isExile}
        header={header}
      />
    );
  }
}


function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  return {
    deck: getDeck(state, props.id) || undefined,
  };
}

export default connect<ReduxProps, {}, OwnProps, AppState>(
  mapStateToProps
)(ExileCardSelectorComponent);

const styles = StyleSheet.create({
  exileText: {
    paddingLeft: 8,
    textTransform: 'uppercase',
  },
});
