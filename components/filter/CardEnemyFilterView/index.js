import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import ToggleFilter from '../ToggleFilter';
import withFilterFunctions from '../withFilterFunctions';

class CardEnemyFilterView extends React.Component {
  static propTypes = {
    cards: PropTypes.object,
    filters: PropTypes.object,
    onToggleChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      filters: {
        nonElite,
      },
      onToggleChange,
    } = this.props;
    return (
      <ScrollView>
        <View style={styles.toggleRow}>
          <ToggleFilter
            label="Non-Elite"
            setting="nonElite"
            value={nonElite}
            onChange={onToggleChange}
          />
        </View>
      </ScrollView>
    );
  }
}

export default withFilterFunctions(CardEnemyFilterView);

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
  },
  chooserStack: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  toggleStack: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    paddingBottom: 8,
  },
  toggleRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
