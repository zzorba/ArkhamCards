import React from 'react';
import { debounce } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PlusMinusButtons from 'components/core/PlusMinusButtons';
import typography from 'styles/typography';

interface Props {
  countChanged: (index: number, count: number) => void;
  index: number;
  title: string;
  count?: number;
  isInvestigator?: boolean;
}

interface State {
  count?: number;
}

export default class EditCountComponent extends React.Component<Props, State> {
  _countChanged!: (index: number, count: number) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      count: props.count,
    };

    this._countChanged = debounce(props.countChanged, 200, { trailing: true });
  }

  _increment = () => {
    this.setState(state => {
      const count = (state.count || 0) + 1;
      this._countChanged(this.props.index, count);
      return { count };
    });
  };

  _decrement = () => {
    this.setState(state => {
      const count = Math.max((state.count || 0) - 1, 0);
      this._countChanged(this.props.index, count);
      return { count };
    });
  };

  render() {
    const {
      title,
      isInvestigator,
    } = this.props;
    const {
      count,
    } = this.state;
    return (
      <View style={[styles.marginTop, isInvestigator ? {} : styles.container]}>
        <View style={styles.row}>
          <View style={styles.textColumn}>
            <Text style={typography.small} ellipsizeMode="tail">
              { title.toUpperCase() }
            </Text>
            <Text style={[styles.margin, typography.text]}>
              { count }
            </Text>
          </View>
          <PlusMinusButtons
            count={count || 0}
            onIncrement={this._increment}
            onDecrement={this._decrement}
            size={36}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  marginTop: {
    marginTop: 4,
  },
  container: {
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  margin: {
    marginBottom: 4,
  },
  textColumn: {
    flex: 1,
    marginRight: 8,
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
