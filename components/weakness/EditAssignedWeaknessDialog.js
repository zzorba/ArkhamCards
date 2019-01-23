import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import L from '../../app/i18n';
import EditAssignedWeaknessComponent from './EditAssignedWeaknessComponent';
import * as Actions from '../../actions';

class EditAssignedWeaknessDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    set: PropTypes.object,
    deleteWeaknessSet: PropTypes.func.isRequired,
    editWeaknessSet: PropTypes.func.isRequired,
  };

  static get options() {
    return {
      topBar: {
        title: {
          text: L('Available weaknesses'),
        },
      },
    };
  }

  constructor(props) {
    super(props);

    this._updateAssignedCards = this.updateAssignedCards.bind(this);
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
      componentId,
      set,
    } = this.props;
    if (!set) {
      return null;
    }
    return (
      <EditAssignedWeaknessComponent
        componentId={componentId}
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
