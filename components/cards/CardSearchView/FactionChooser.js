import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, map } from 'lodash';
const {
  StyleSheet,
} = require('react-native');
import { ButtonGroup } from 'react-native-elements';

import ArkhamIcon from '../../../assets/ArkhamIcon';
import { FACTION_CODES, FACTION_COLORS } from '../../../constants';

function factionToIconName(faction) {
  if (faction === 'neutral') {
    return 'elder_sign';
  }
  if (faction === 'mythos') {
    return 'auto_fail';
  }
  return faction;
}
const CARD_FACTION_CODES = [...FACTION_CODES, 'mythos'];
export default class FactionChooser extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedIndexes: [],
    };
    this._updateIndex = this.updateIndex.bind(this);
  }

  updateIndex(indexes) {
    this.setState({
      selectedIndexes: indexes,
    });
    const selection = flatMap(indexes, idx =>
      CARD_FACTION_CODES[idx].toLowerCase());
    this.props.onChange(selection);
  }

  render() {
    const {
      selectedIndexes,
    } = this.state;

    const buttons = map(CARD_FACTION_CODES, (faction, idx) => {
      const selected = selectedIndexes.indexOf(idx) !== -1;
      return {
        element: () => (
          <ArkhamIcon
            name={factionToIconName(faction)}
            size={28}
            color={selected ? FACTION_COLORS[faction] : '#bdbdbd'}
          />
        ),
      };
    });
    return (
      <ButtonGroup
        onPress={this._updateIndex}
        selectedIndexes={selectedIndexes}
        buttons={buttons}
        buttonStyle={styles.button}
        selectedButtonStyle={styles.selectedButton}
        containerStyle={styles.container}
        selectMultiple
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
  },
  button: {
    backgroundColor: '#eeeeee',
  },
  selectedButton: {
    backgroundColor: '#FFFFFF',
  },
});
