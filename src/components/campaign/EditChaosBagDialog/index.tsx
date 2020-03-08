import React from 'react';
import { find, map, sortBy, throttle } from 'lodash';
import {
  Alert,
  BackHandler,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation, EventSubscription } from 'react-native-navigation';

import { t } from 'ttag';
import { iconsMap } from 'app/NavIcons';
import { NavigationProps } from 'components/nav/types';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import ChaosTokenRow from './ChaosTokenRow';
import {
  CHAOS_TOKENS,
  CHAOS_BAG_TOKEN_COUNTS,
  CHAOS_TOKEN_ORDER,
  ChaosBag,
  ChaosTokenType,
} from 'constants';
import typography from 'styles/typography';
import { COLORS } from 'styles/colors';

export interface EditChaosBagProps {
  chaosBag: ChaosBag;
  updateChaosBag: (chaosBag: ChaosBag) => void;
  trackDeltas?: boolean;
}

interface State {
  chaosBag: ChaosBag;
  visible: boolean;
  hasPendingEdits: boolean;
}

type Props = EditChaosBagProps & NavigationProps & DimensionsProps;

class EditChaosBagDialog extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
        leftButtons: [
          Platform.OS === 'ios' ? {
            systemItem: 'cancel',
            text: t`Cancel`,
            id: 'back',
            color: COLORS.navButton,
            testID: t`Cancel`,
          } : {
            icon: iconsMap['arrow-left'],
            id: 'androidBack',
            color: COLORS.navButton,
            testID: t`Back`,
          },
        ],
        rightButtons: [{
          systemItem: 'save',
          text: t`Save`,
          id: 'save',
          showAsAction: 'ifRoom',
          color: COLORS.navButton,
          testID: t`Save`,
        }],
      },
    };
  }

  _navEventListener?: EventSubscription;
  _saveChanges!: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      chaosBag: Object.assign({}, props.chaosBag),
      visible: true,
      hasPendingEdits: false,
    };

    this._saveChanges = throttle(this.saveChanges.bind(this), 200);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    this._navEventListener && this._navEventListener.remove();
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

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'save') {
      this._saveChanges();
    } else if (buttonId === 'back' || buttonId === 'androidBack') {
      this._handleBackPress();
    }
  }

  _handleBackPress = () => {
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
        t`Save changes?`,
        t`Looks like you have made some changes that have not been saved.`,
        [{
          text: t`Save Changes`,
          onPress: () => {
            this._saveChanges();
          },
        }, {
          text: t`Discard Changes`,
          style: 'destructive',
          onPress: () => {
            Navigation.pop(componentId);
          },
        }, {
          text: t`Cancel`,
          style: 'cancel',
        }],
      );
    } else {
      Navigation.pop(componentId);
    }
    return true;
  };

  saveChanges() {
    this.props.updateChaosBag(this.state.chaosBag);
    Navigation.pop(this.props.componentId);
  }

  _mutateCount = (id: ChaosTokenType, mutate: (count: number) => number) => {
    this.setState((state: State) => {
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
        hasPendingEdits: !!find(
          CHAOS_TOKENS,
          key => (chaosBag[key] || 0) !== (newChaosBag[key] || 0)),
      };
    });
  };

  render() {
    const {
      trackDeltas,
      fontScale,
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
        { map(sortBy(CHAOS_TOKENS, x => CHAOS_TOKEN_ORDER[x]),
          id => {
            const originalCount = trackDeltas ? ogChaosBag[id] : chaosBag[id];
            return (
              <ChaosTokenRow
                key={id}
                fontScale={fontScale}
                id={id}
                originalCount={originalCount || 0}
                count={chaosBag[id] || 0}
                limit={CHAOS_BAG_TOKEN_COUNTS[id] || 0}
                mutateCount={this._mutateCount}
              />
            );
          }) }
      </ScrollView>
    );
  }
}

export default withDimensions<EditChaosBagProps & NavigationProps>(
  EditChaosBagDialog
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
});
