import React from 'react';
import PropTypes from 'prop-types';
import { values } from 'lodash';
import {
  FlatList,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import { BASIC_WEAKNESS_QUERY } from '../../../data/query';
import * as Actions from '../../../actions';
import { iconsMap } from '../../../app/NavIcons';
import WeaknessSetRow from './WeaknessSetRow';

class WeaknessSetChooserView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    weaknesses: PropTypes.array,
    cards: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._extractKey = this.extractKey.bind(this);
    this._renderItem = this.renderItem.bind(this);

    props.navigator.setButtons({
      rightButtons: [
        {
          icon: iconsMap.add,
          id: 'add',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    const {
      navigator,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        navigator.push({
          screen: 'Weakness.New',
        });
      }
    }
  }

  renderItem({ item }) {
    return (
      <WeaknessSetRow
        key={item.id}
        navigator={this.props.navigator}
        set={item}
        cards={this.props.cards}
      />
    );
  }

  extractKey(item) {
    return `${item.id}`;
  }

  render() {
    const {
      weaknesses,
    } = this.props;
    return (
      <View>
        <FlatList
          data={weaknesses}
          keyExtractor={this._extractKey}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    weaknesses: values(state.weaknesses.all || {}),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(WeaknessSetChooserView, {
    schemas: ['Card'],
    mapToProps(results) {
      return {
        cards: results.cards.filtered(BASIC_WEAKNESS_QUERY),
      };
    },
  })
);
