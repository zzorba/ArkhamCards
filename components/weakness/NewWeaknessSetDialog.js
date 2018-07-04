import React from 'react';
import PropTypes from 'prop-types';
import { filter, forEach, map, max, uniqBy, values } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { Button } from 'react-native-elements';

import PackListComponent from '../PackListComponent';
import TextBox from '../core/TextBox';
import { BASIC_WEAKNESS_QUERY } from '../../data/query';
import * as Actions from '../../actions';

class NewWeaknessSetDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object,
    nextId: PropTypes.number.isRequired,
    createWeaknessSet: PropTypes.func.isRequired,
    in_collection: PropTypes.object.isRequired,
    cards: PropTypes.object,
    packs: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      name: `Set ${props.nextId}`,
      override: {},
    };

    this._renderHeader = this.renderHeader.bind(this);
    this._renderFooter = this.renderFooter.bind(this);
    this._onNameChange = this.onNameChange.bind(this);
    this._onSavePressed = this.onSavePressed.bind(this);
    this._onPackCheck = this.onPackCheck.bind(this);
  }

  onPackCheck(pack, value) {
    this.setState({
      override: Object.assign({}, this.state.override, { [pack]: !!value }),
    });
  }

  onNameChange(value) {
    this.setState({
      name: value,
    });
  }

  onSavePressed() {
    const {
      navigator,
      createWeaknessSet,
      nextId,
      in_collection,
    } = this.props;

    const {
      name,
      override,
    } = this.state;
    const includePack = Object.assign({}, in_collection, override);
    const packs = [];
    forEach(this.weaknessPacks(), pack => {
      if (includePack[pack.code]) {
        packs.push(pack.code);
      }
    });
    createWeaknessSet(nextId, name, packs);
    navigator.pop();
  }

  renderFooter() {
    return (
      <View style={styles.button}>
        <Button text="Create" onPress={this._onSavePressed} />
      </View>
    );
  }

  renderHeader() {
    const {
      name,
    } = this.state;
    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.name}>Name:</Text>
          <TextBox value={name} onChangeText={this._onNameChange} style={styles.grow} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.text}>Include Weaknesses From These Sets</Text>
        </View>
      </View>
    );
  }

  weaknessPacks() {
    const {
      cards,
      packs,
    } = this.props;
    const weaknessPackSet = new Set(uniqBy(map(values(cards), card => card.pack_code)));
    return filter(packs, pack => weaknessPackSet.has(pack.code));
  }

  render() {
    const {
      navigator,
      in_collection,
    } = this.props;
    const {
      override,
    } = this.state;
    const weaknessPacks = this.weaknessPacks();
    return (
      <View>
        <PackListComponent
          navigator={navigator}
          packs={weaknessPacks}
          checkState={Object.assign({}, in_collection, override)}
          setChecked={this._onPackCheck}
          renderHeader={this._renderHeader}
          renderFooter={this._renderFooter}
          baseQuery={'subtype_code == "basicweakness" and code != "01000"'}
          whiteBackground
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    packs: state.packs.all,
    in_collection: state.packs.in_collection || {},
    nextId: 1 + (max(map(values(state.weaknesses.all), set => set.id)) || 0),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(NewWeaknessSetDialog, {
    schemas: ['Card'],
    mapToProps(results) {
      return {
        cards: results.cards.filtered(BASIC_WEAKNESS_QUERY),
      };
    },
  })
);

const styles = StyleSheet.create({
  row: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textBlock: {
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  text: {
    margin: 16,
  },
  button: {
    marginTop: 16,
  },
  name: {
    marginRight: 8,
  },
  grow: {
    flex: 1,
  },
});
