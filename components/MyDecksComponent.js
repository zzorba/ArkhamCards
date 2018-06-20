import React from 'react';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../actions';
import DeckListComponent from './DeckListComponent';

class MyDecksComponent extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    deckClicked: PropTypes.func.isRequired,
    filterDeckIds: PropTypes.array,
    refreshMyDecks: PropTypes.func.isRequired,
    myDecks: PropTypes.array,
    myDecksUpdated: PropTypes.instanceOf(Date),
    refreshing: PropTypes.bool,
    error: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this._onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    const {
      refreshing,
      refreshMyDecks,
    } = this.props;

    if (!refreshing) {
      refreshMyDecks();
    }
  }

  componentDidMount() {
    const {
      myDecksUpdated,
      myDecks,
    } = this.props;

    const now = new Date();
    if (!myDecks ||
      myDecks.length === 0 ||
      !myDecksUpdated ||
      (myDecksUpdated.getTime() / 1000 + 120) < (now.getTime() / 1000)
    ) {
      this.onRefresh();
    }
  }

  render() {
    const {
      navigator,
      deckClicked,
      filterDeckIds = [],
      myDecks,
      refreshing,
      error,
    } = this.props;

    const filterDeckIdsSet = new Set(filterDeckIds);

    return (
      <DeckListComponent
        navigator={navigator}
        deckIds={filter(myDecks, deckId => !filterDeckIdsSet.has(deckId))}
        deckClicked={deckClicked}
        onRefresh={this._onRefresh}
        refreshing={refreshing}
        error={error}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    myDecksUpdated: state.decks.dateUpdated ? new Date(state.decks.dateUpdated) : null,
    myDecks: state.decks.myDecks || [],
    refreshing: state.decks.refreshing,
    error: state.decks.error,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyDecksComponent);
