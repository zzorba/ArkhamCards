import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DialogComponent from 'react-native-dialog';

import L from '../../app/i18n';
import Dialog from './Dialog';
import PlusMinusButtons from './PlusMinusButtons';

export default class CountEditDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    count: PropTypes.number,
    viewRef: PropTypes.object,
    onCountChange: PropTypes.func,
    toggleVisible: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      originalCount: null,
      submitting: false,
    };

    this._onCountChange = this.onCountChange.bind(this);
    this._onDonePress = this.onDonePress.bind(this);
    this._onCancelPress = this.onCancelPress.bind(this);
  }

  onCountChange(value) {
    this.setState({
      count: value,
    });
  }

  componentDidUpdate(prevProps) {
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

  onCancelPress() {
    const {
      toggleVisible,
    } = this.props;
    toggleVisible();
  }

  onDonePress() {
    const {
      onCountChange,
      toggleVisible,
    } = this.props;
    const {
      count,
    } = this.state;
    onCountChange && onCountChange(count);
    toggleVisible();
  }

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
              count={count}
              onChange={this._onCountChange}
              size={36}
              dark
            />
          </View>
        </View>
        <DialogComponent.Button
          label={L('Cancel')}
          onPress={this._onCancelPress}
        />
        <DialogComponent.Button
          label={L('Done')}
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
