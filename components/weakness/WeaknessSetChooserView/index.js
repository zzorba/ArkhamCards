import React from 'react';
import PropTypes from 'prop-types';
import { throttle, values } from 'lodash';
import {
  FlatList,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { Navigation } from 'react-native-navigation';

import WeaknessSetRow from './WeaknessSetRow';
import { BASIC_WEAKNESS_QUERY } from '../../../data/query';
import * as Actions from '../../../actions';
import { iconsMap } from '../../../app/NavIcons';
import typography from '../../../styles/typography';

class WeaknessSetChooserView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    weaknesses: PropTypes.array,
    cards: PropTypes.object,
  };

  static get options() {
    return {
      topBar: {
        rightButtons: [{
          icon: iconsMap.add,
          id: 'add',
        }],
      },
    };
  }

  constructor(props) {
    super(props);

    this._extractKey = this.extractKey.bind(this);
    this._renderItem = this.renderItem.bind(this);
    this._renderFooter = this.renderFooter.bind(this);
    this._showNewWeaknessDialog = throttle(this.showNewWeaknessDialog.bind(this), 200);

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'add') {
      this._showNewWeaknessDialog();
    }
  }

  showNewWeaknessDialog() {
    const {
      componentId,
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'Weakness.New',
      },
    });
  }

  renderItem({ item }) {
    return (
      <WeaknessSetRow
        key={item.id}
        componentId={this.props.componentId}
        set={item}
        cards={this.props.cards}
      />
    );
  }

  extractKey(item) {
    return `${item.id}`;
  }

  renderFooter() {
    return (
      <Text style={[typography.small, styles.margin]}>
        Note: This weakness set chooser will probably go away in a future
        version of the app. It's functionality has been folded into the campaign
        tracker.
      </Text>
    );
  }

  render() {
    const {
      weaknesses,
    } = this.props;
    return (
      <View>
        <FlatList
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          data={weaknesses}
          keyExtractor={this._extractKey}
          renderItem={this._renderItem}
          ListFooterComponent={this._renderFooter}
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

const styles = StyleSheet.create({
  margin: {
    margin: 8,
  },
});
