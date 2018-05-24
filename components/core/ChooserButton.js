import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

export default class ChooserButton extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    selection: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      navigator,
      title,
      values,
      onChange,
      selection,
    } = this.props;
    navigator.push({
      screen: 'SearchFilters.Chooser',
      title: `Select ${title}`,
      passProps: {
        placeholder: `Search ${title}`,
        values,
        onChange,
        selection,
      },
    });
  }

  render() {
    const {
      title,
      selection,
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.container}>
          <Text style={styles.text} numberOfLines={1}>
            { `${title}: ${selection.length ? selection.join(', ') : 'All'}` }
          </Text>
          <View style={styles.icon}>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={30}
              color="rgb(0, 122,255)"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#bdbdbd',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 6,
  },
  text: {
    fontSize: 18,
    flex: 1,
  },
  icon: {
    width: 40,
  },
});
