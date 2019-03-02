import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getDeck } from '../reducers';
import typography from '../styles/typography';
import CardSelectorComponent from './CardSelectorComponent';

class ExileCardSelectorComponent extends React.Component {
  static propTypes = {
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    exileCounts: PropTypes.object.isRequired,
    updateExileCounts: PropTypes.func.isRequired,
    showLabel: PropTypes.bool,
    // From redux.
    deck: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._isExile = this.isExile.bind(this);
  }

  isExile(card) {
    return card.exile;
  }

  render() {
    const {
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
        EXILE CARDS
      </Text>
    );
    return (
      <CardSelectorComponent
        slots={deck.slots}
        counts={exileCounts}
        updateCounts={updateExileCounts}
        filterCard={this._isExile}
        header={header}
      />
    );
  }
}


function mapStateToProps(state, props) {
  return {
    deck: getDeck(state, props.id),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ExileCardSelectorComponent);

const styles = StyleSheet.create({
  exileText: {
    paddingLeft: 8,
  },
});
