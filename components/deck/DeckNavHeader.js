import React from 'react';
import PropTypes from 'prop-types';
const {
  Platform,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} = require('react-native');
import { Button } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import AppIcon from '../../assets/AppIcon';
import { COLORS } from '../../styles/colors';

export default class DeckNavHeader extends React.Component {
  static propTypes = {
    navigator: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._backPressed = this.backPressed.bind(this);
  }

  backPressed(){
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._backPressed}>
          <View style={styles.row}>
            <View style={styles.backArrow}>
              <AppIcon name="arrow_back" size={24} color={COLORS.lightBlue} />
            </View>
            <Text style={styles.backButton}>
              Back
            </Text>
          </View>
        </TouchableOpacity>
        { /*
        <Button
          textStyle={styles.backButtonText}
          buttonStyle={[styles.button, styles.cancelEditsButton]}
          onPress={this._backPressed}
          text="Cancel"
        />
        <Button
          textStyle={styles.backButtonText}
          buttonStyle={[styles.button, styles.saveEditsButton]}
          onPress={this._backPressed}
          text="Save"
        />*/ }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 8,
  },
  icon: {
    width: 28,
    height: 28,
  },
  row: {
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backArrow: {
    width: 18,
  },
  backButton: {
    marginLeft: 4,
    color: COLORS.lightBlue,
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '700',
  },
  text: {
    marginLeft: 2,
    color: '#000000',
  },
  backButtonText: {
    color: '#212121',
  },
  button: {
    marginLeft: 8,
    height: 32,
    borderRadius: 4,
  },
  cancelEditsButton: {
    backgroundColor: COLORS.red,
    borderColor: 'transparent',
    borderWidth: 0,
  },
  saveEditsButton: {
    backgroundColor: COLORS.green,
    borderColor: 'transparent',
    borderWidth: 0,
  },
});
