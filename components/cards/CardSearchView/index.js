import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../../../actions';
import CardSearchComponent from './CardSearchComponent';

class CardSearchView extends React.Component {
  static propTypes = {
    cards: PropTypes.object,
    navigator: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      cards,
      navigator,
    } = this.props;
    return (
      <CardSearchComponent cards={cards} navigator={navigator} />
    );
  }
}

function mapStateToProps(state) {
  return {
    cards: state.cards.all,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CardSearchView);
