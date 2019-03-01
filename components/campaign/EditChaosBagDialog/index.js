import React from 'react';
import PropTypes from 'prop-types';
import { find, keys, map, sortBy, throttle } from 'lodash';
import {
  Alert,
  BackHandler,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import L from '../../../app/i18n';
import { iconsMap } from '../../../app/NavIcons';
import ChaosTokenRow from './ChaosTokenRow';
import { CHAOS_BAG_TOKEN_COUNTS, CHAOS_TOKEN_ORDER } from '../../../constants';
import typography from '../../../styles/typography';
import { COLORS } from '../../../styles/colors';

export default class EditChaosBagDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    chaosBag: PropTypes.object.isRequired,
    updateChaosBag: PropTypes.func.isRequired,
    trackDeltas: PropTypes.bool,
  };

  static get options() {
    return {
      topBar: {
        leftButtons: [
          Platform.OS === 'ios' ? {
            systemItem: 'cancel',
            text: L('Cancel'),
            id: 'back',
            color: COLORS.navButton,
          } : {
            icon: iconsMap['arrow-left'],
            id: 'androidBack',
            color: COLORS.navButton,
          },
        ],
        rightButtons: [{
          systemItem: 'save',
          text: L('Save'),
          id: 'save',
          showAsAction: 'ifRoom',
          color: COLORS.navButton,
        }],
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      chaosBag: Object.assign({}, props.chaosBag),
      visible: true,
    };

    this._mutateCount = this.mutateCount.bind(this);
    this._saveChanges = throttle(this.saveChanges.bind(this), 200);

    this._handleBackPress = this.handleBackPress.bind(this);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    this._navEventListener.remove();
  }

  componentDidAppear() {
    this.setState({
      visible: true,
    });
  }

  componentDidDisappear() {
    this.setState({
      visible: false,
    });
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'save') {
      this._saveChanges();
    } else if (buttonId === 'back' || buttonId === 'androidBack') {
      this.handleBackPress();
    }
  }

  handleBackPress() {
    const {
      componentId,
    } = this.props;
    const {
      visible,
      hasPendingEdits,
    } = this.state;
    if (!visible) {
      return false;
    }
    if (hasPendingEdits) {
      Alert.alert(
        L('Save changes?'),
        L('Looks like you have made some changes that have not been saved.'),
        [{
          text: L('Save Changes'),
          onPress: () => {
            this._saveChanges();
          },
        }, {
          text: L('Discard Changes'),
          style: 'destructive',
          onPress: () => {
            Navigation.pop(componentId);
          },
        }, {
          text: L('Cancel'),
          style: 'cancel',
        }],
      );
    } else {
      Navigation.pop(componentId);
    }
    return true;
  }

  saveChanges() {
    this.props.updateChaosBag(this.state.chaosBag);
    Navigation.pop(this.props.componentId);
  }

  mutateCount(id, mutate) {
    this.setState(state => {
      const {
        chaosBag,
      } = this.props;
      const newChaosBag = Object.assign(
        {},
        state.chaosBag,
        { [id]: mutate(state.chaosBag[id] || 0) }
      );
      return {
        chaosBag: newChaosBag,
        hasPendingEdits: find(
          keys(chaosBag),
          key => chaosBag[key] !== newChaosBag[key]),
      };
    });
  }

  render() {
    const {
      trackDeltas,
    } = this.props;
    const {
      chaosBag,
    } = this.state;
    const ogChaosBag = this.props.chaosBag;
    return (
      <ScrollView>
        <View style={styles.row}>
          <Text style={[typography.bigLabel, typography.bold]}>In Bag</Text>
        </View>
        { map(sortBy(keys(CHAOS_BAG_TOKEN_COUNTS), x => CHAOS_TOKEN_ORDER[x]),
          id => {
            const originalCount = trackDeltas ? ogChaosBag[id] : chaosBag[id];
            return (
              <ChaosTokenRow
                key={id}
                id={id}
                originalCount={originalCount || 0}
                count={chaosBag[id] || 0}
                limit={CHAOS_BAG_TOKEN_COUNTS[id]}
                mutateCount={this._mutateCount}
              />
            );
          }) }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
});
