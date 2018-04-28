import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map, last, sortBy, values } from 'lodash';
import {
  ScrollView,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import * as Actions from '../../actions';
import { iconsMap } from '../../app/NavIcons';
import { getAllDecks } from '../../reducers';

class AddScenarioResultView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    decks: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      campaign,
      decks,
    } = this.props;
    return null;
  }
}

function mapStateToProps(state) {
  return {
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(AddScenarioResultView),
  {
    schemas: ['Card'],
    mapToProps(results, realm) {
      return {
        realm,
      };
    },
  },
);
