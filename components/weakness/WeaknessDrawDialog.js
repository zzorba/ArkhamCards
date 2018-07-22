import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import WeaknessDrawComponent from './WeaknessDrawComponent';

class WeaknessDrawDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    set: PropTypes.object,
    cards: PropTypes.object, // Realm array
    cardsMap: PropTypes.object,
    editWeaknessSet: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._updateDrawnCard = this.updateDrawnCard.bind(this);
  }

  updateDrawnCard(nextCard, assignedCards) {
    const {
      set: {
        id,
        name,
        packCodes,
      },
      editWeaknessSet,
    } = this.props;
    editWeaknessSet(id, name, packCodes, assignedCards);
  }

  render() {
    const {
      navigator,
      set,
    } = this.props;

    if (!set) {
      return null;
    }

    return (
      <WeaknessDrawComponent
        navigator={navigator}
        weaknessSet={set}
        updateDrawnCard={this._updateDrawnCard}
      />
    );
  }
}

function mapStateToProps(state, props) {
  return {
    set: state.weaknesses.all[props.id],
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WeaknessDrawDialog);
