import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DialogComponent from 'react-native-dialog';

import { t } from 'ttag';
import Dialog from './Dialog';
import PlusMinusButtons from './PlusMinusButtons';

interface Props {
  title: string;
  visible: boolean;
  count?: number;
  viewRef?: View;
  onCountChange?: (count: number) => void;
  toggleVisible: () => void;
}

interface State {
  count?: number;
  originalCount?: number;
  submitting: boolean;
}

export default class CountEditDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      submitting: false,
    };
  }

  _increment = () => {
    this.setState(state => {
      return { count: (state.count || 0) + 1 };
    });
  };

  _decrement = () => {
    this.setState(state => {
      return { count: Math.max((state.count || 0) - 1, 0) };
    });
  };

  componentDidUpdate(prevProps: Props) {
    const {
      visible,
      count,
    } = this.props;
    if (visible && !prevProps.visible) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        count: count,
        originalCount: count,
      });
    }
  }

  _onCancelPress = () => {
    const {
      toggleVisible,
    } = this.props;
    toggleVisible();
  };

  _onDonePress = () => {
    const {
      onCountChange,
      toggleVisible,
    } = this.props;
    const {
      count,
    } = this.state;
    onCountChange && onCountChange(count || 0);
    toggleVisible();
  };

  render() {
    const {
      visible,
      title,
      viewRef,
    } = this.props;
    const {
      originalCount,
      count,
    } = this.state;

    const countChanged = count !== originalCount;
    const buttonColor = Platform.OS === 'ios' ? '#007ff9' : '#169689';
    // const height = 18 + Platform.select({ ios: 14, android: 22 }) * numberOfLines;
    return (
      <Dialog visible={visible} title={title} viewRef={viewRef}>
        <View style={styles.counterRow}>
          <View style={styles.row}>
            <Text style={[styles.label, styles.countText]}>
              { count || 0 }
            </Text>
            <PlusMinusButtons
              count={count || 0}
              onIncrement={this._increment}
              onDecrement={this._decrement}
              size={36}
              color="dark"
            />
          </View>
        </View>
        <DialogComponent.Button
          label={t`Cancel`}
          onPress={this._onCancelPress}
        />
        <DialogComponent.Button
          label={t`Done`}
          color={countChanged ? buttonColor : '#666666'}
          disabled={!countChanged}
          onPress={this._onDonePress}
        />
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    fontWeight: '900',
    width: 60,
  },
  label: Platform.select({
    ios: {
      fontSize: 13,
      color: 'black',
    },
    android: {
      fontSize: 16,
      color: '#33383D',
    },
  }),
  counterRow: {
    marginRight: Platform.OS === 'ios' ? 28 : 8,
    marginLeft: Platform.OS === 'ios' ? 28 : 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
});
