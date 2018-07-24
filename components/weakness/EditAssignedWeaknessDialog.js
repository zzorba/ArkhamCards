import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import EditAssignedWeaknessComponent from './EditAssignedWeaknessComponent';
import * as Actions from '../../actions';

class EditAssignedWeaknessDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    set: PropTypes.object,
    deleteWeaknessSet: PropTypes.func.isRequired,
    editWeaknessSet: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._updateAssignedCards = this.updateAssignedCards.bind(this);

    props.navigator.setTitle({
      title: 'Available weaknesses',
    });
  }

  updateAssignedCards(assignedCards) {
    const {
      set,
      editWeaknessSet,
    } = this.props;
    editWeaknessSet(set.id, set.name, set.packCodes, assignedCards);
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
      <EditAssignedWeaknessComponent
        navigator={navigator}
        weaknessSet={set}
        updateAssignedCards={this._updateAssignedCards}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditAssignedWeaknessDialog);
