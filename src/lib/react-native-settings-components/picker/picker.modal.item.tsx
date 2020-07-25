import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextStyle, ViewStyle,
} from 'react-native';
import PropTypes from 'prop-types';

const style = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  indicatorWrapper: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    height: 12,
    width: 12,
    borderWidth: 2,
    borderRadius: 6,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelWrapper: {
    paddingRight: 16,
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#e5e5e9',
  },
});

interface Props {
  onSelect: () => void;
  selected: boolean;
  label: string;
  isLast?: boolean;
  itemColor?: string;
  itemWrapperStyle?: ViewStyle;
  itemText?: TextStyle;
}
class PickerModalItem extends Component<Props> {
  static defaultProps = {
    isLast: false,
  };

  render() {
    const {
      onSelect, selected, label, isLast, itemColor, itemWrapperStyle, itemText,
    } = this.props;
    return (
      <React.Fragment>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={onSelect}
        >
          <View style={[style.itemWrapper, itemWrapperStyle]}>
            <View style={style.indicatorWrapper}>
              <View style={[style.indicator, { borderColor: itemColor || 'red', backgroundColor: selected ? (itemColor || 'red') : undefined }]} />
            </View>
            <View style={style.labelWrapper}>
              <Text style={[style.label, itemText || {}]}>
                {label}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {!isLast ? (
          <View style={style.separator} />
        ) : null}
      </React.Fragment>
    );
  }
}

export default PickerModalItem;
