import React from 'react';
import { map } from 'lodash';
import {
  Platform,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import { t } from 'ttag';
import DialogOption from './DialogOption';
import withDimensions, { DimensionsProps } from './withDimensions';
import typography from 'styles/typography';

interface OwnProps {
  componentId: string;
  options: string[];
  selectedOption?: string;
  onSelectionChanged: (selection: string) => void;
  header: string;
  description?: string;
  noCapitalize?: boolean;
}
type Props = OwnProps & DimensionsProps;

class DialogPicker extends React.Component<Props> {
  _onPress = (option: string) => {
    const {
      componentId,
      onSelectionChanged,
    } = this.props;
    onSelectionChanged(option);
    Navigation.dismissOverlay(componentId);
  };

  _hide = () => {
    Navigation.dismissOverlay(this.props.componentId);
  };

  renderOptions() {
    const {
      options,
      selectedOption,
      noCapitalize,
      fontScale,
    } = this.props;
    return map(options, option => (
      <DialogOption
        key={option}
        fontScale={fontScale}
        text={option}
        onPress={this._onPress}
        selected={option === selectedOption}
        noCapitalize={noCapitalize}
      />
    ));
  }

  render() {
    const {
      header,
      description,
      height,
      width,
      fontScale,
    } = this.props;

    return (
      <View style={[styles.wrapper, { width, height }]}>
        <TouchableOpacity style={styles.background} onPress={this._hide}>
          <View style={styles.background} />
        </TouchableOpacity>
        <View style={styles.container}>
          <View style={[
            styles.header,
          ]}>
            <Text style={styles.headerText}>
              { header }:
            </Text>
            { !!description && (
              <Text style={[typography.small, styles.descriptionText]}>
                { description }
              </Text>
            ) }
          </View>

          <ScrollView
            style={styles.scrollOptions}
            overScrollMode="never"
            scrollIndicatorInsets={{ right: -10 }}
          >
            { this.renderOptions() }
          </ScrollView>
          <View style={[styles.cancel, { height: 55 * fontScale }]}>
            <TouchableOpacity onPress={this._hide}>
              <Text style={styles.cancelText}>{ t`Cancel` }</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default withDimensions(DialogPicker);

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 10,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    borderRadius: Platform.OS === 'ios' ? 25 : 0,
    borderWidth: 1,
    borderColor: '#dedede',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  header: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '700',
    paddingBottom: 4,
  },
  descriptionText: {
    textAlign: 'center',
    marginLeft: 8,
    marginRight: 8,
  },
  cancel: {
    width: '100%',
  },
  cancelText: {
    color: 'rgb(0,122,255)',
    textAlign: 'center',
    lineHeight: 50,
    fontSize: 23,
    fontWeight: '700',
  },
  scrollOptions: {
    maxHeight: 50 * 6 + 25,
  },
});
