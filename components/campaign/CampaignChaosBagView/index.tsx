import React from 'react';
import { keys, values } from 'lodash';
import { BackHandler, Button, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EventSubscription, Navigation } from 'react-native-navigation';

import { t } from 'ttag';
import { iconsMap } from '../../../app/NavIcons';
import { NavigationProps } from '../../types';
import { CHAOS_TOKENS, ChaosBag, ChaosTokenType } from '../../../constants';
import { COLORS } from '../../../styles/colors';
import { ChaosBagResults } from '../../../actions/types';
import typography from '../../../styles/typography';
import { EditChaosBagProps } from '../EditChaosBagDialog';
import ChaosToken from '../ChaosToken';

export interface CampaignChaosBagProps {
    chaosBag: ChaosBag;
    chaosBagResults: ChaosBagResults;
    updateChaosBag: (chaosBag: ChaosBag) => void;
    trackDeltas?: boolean;
}

interface State {
    chaosBagResults: ChaosBagResults;
    visible: boolean;
    iconKey?: ChaosTokenType;
}

type Props = CampaignChaosBagProps & NavigationProps;

// TODO: need to change it to pull chaosBag from redux state (pass the campaignId, and fetch campaign + get it from redux)
export default class CampaignChaosBagView extends React.Component<Props, State> {
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
          text: t`Edit`,
          id: 'edit',
          showAsAction: 'ifRoom',
          color: COLORS.navButton,
          testID: t`Edit`,
        }],
      },
    };
  }

  _navEventListener?: EventSubscription;

  constructor(props: Props) {
    super(props);

    this.state = {
      chaosBagResults: {
        currentToken: undefined,
        drawnTokens: [],
        total: 0,
      },
      visible: true,
    };

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
    if (buttonId === 'back' || buttonId === 'androidBack') {
      this._handleBackPress();
    } else if (buttonId === 'edit') {
      this._showChaosBagDialog();
    }
  }

  _handleDrawTokenPressed = () => {
    this._drawToken();
  }

  _handleSealTokenPressed = () => {

  }

  _handleBackPress = () => {
    const {
      componentId,
    } = this.props;
    const {
      visible,
    } = this.state;
    if (!visible) {
      return false;
    }
    Navigation.pop(componentId);
    return true;
  }

  _showChaosBagDialog = () => {
    const {
      componentId,
      updateChaosBag,
      chaosBag,
    } = this.props;

    Navigation.push<EditChaosBagProps>(componentId, {
      component: {
        name: 'Dialog.EditChaosBag',
        passProps: {
          chaosBag,
          updateChaosBag: updateChaosBag,
          trackDeltas: true,
        },
        options: {
          topBar: {
            title: {
              text: t`Chaos Bag`,
            },
            backButton: {
              title: t`Cancel`,
            },
          },
        },
      },
    });
  }

  _getRandomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  }

  _getRandomChaosToken = (chaosBag: ChaosBag) => {
    const list = keys(chaosBag);
    const weight = values(chaosBag);

    const totalWeight = weight.reduce((prev, cur) => {
      return (prev && cur) ? (prev + cur) : 0;
    });

    if (totalWeight) {
      const random_num = this._getRandomNumber(0, totalWeight);
      let weight_sum = 0;
      const length = list.length;
      for (let i = 0; i < length; i++) {
        const item = weight[i];
        if (item) {
          weight_sum += item;
          weight_sum = +weight_sum.toFixed(2);
        }

        if (random_num <= weight_sum) {
          const tokenName = list[i];
          let drawnToken = null;
          CHAOS_TOKENS.forEach(token => {
            if (token === tokenName) {
              drawnToken = token;
            }
          });

          if (drawnToken) {
            return drawnToken;
          }
        }
      }
    }
  }

  _drawToken = (refresh = false) => {
    const { chaosBagResults } = this.state;
    const { chaosBag } = this.props;

    if (!chaosBagResults.currentToken || refresh) {
      const newIconKey = this._getRandomChaosToken(chaosBag);
      this.setState({
        chaosBagResults: {
          currentToken: newIconKey,
          drawnTokens: chaosBagResults.drawnTokens,
          total: chaosBagResults.total + 1,
        },
      });
    } else {
      this.setState({
        chaosBagResults: {
          currentToken: undefined,
          drawnTokens: [],
          total: chaosBagResults.total,
        },
      });
    }
  }

  _renderChaosToken = (iconKey?: ChaosTokenType) => {
    return (
      <TouchableOpacity onPress={this._handleDrawTokenPressed}>
        <ChaosToken iconKey={iconKey} />
      </TouchableOpacity>
    );
  }

  _addTokenAndDraw = () => {
    const {
      chaosBagResults,
    } = this.state;

    const drawnTokens = chaosBagResults.drawnTokens;
    if (chaosBagResults.currentToken) {
      drawnTokens.push(chaosBagResults.currentToken);
    }

    this.setState({
      chaosBagResults: {
        currentToken: chaosBagResults.currentToken,
        drawnTokens: drawnTokens,
        total: chaosBagResults.total,
      },
    });
    this._drawToken(true);
  }

  _clearTokens = () => {
    const { chaosBagResults } = this.state;

    this.setState({
      chaosBagResults: {
        currentToken: undefined,
        drawnTokens: [],
        total: chaosBagResults.total,
      },
    });
  }

  _renderDrawnTokens() {
    const { chaosBagResults } = this.state;

    const drawnTokens = chaosBagResults.drawnTokens;

    if (drawnTokens.length > 0) {
      return drawnTokens.map(function(token, index) {
        return (
          <ChaosToken key={index} iconKey={token} small />
        );
      });
    }

    return <Text style={[styles.drawTokenText, typography.text]}>Tap token to draw</Text>;
  }

  _renderDrawButton = () => {
    const { chaosBagResults } = this.state;

    if (chaosBagResults.currentToken || chaosBagResults.drawnTokens.length > 0) {
      return <Button title="Add and Draw Again" onPress={this._addTokenAndDraw} />;
    }
  }

  _renderClearButton = () => {
    const { chaosBagResults } = this.state;

    if (chaosBagResults.drawnTokens.length > 0) {
      return <Button title="Clear Tokens" onPress={this._clearTokens} />;
    }
  }

  render() {
    const { chaosBagResults } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <View style={styles.chaosTokenView}>
            { this._renderChaosToken(chaosBagResults.currentToken) }
          </View>
          <View style={styles.drawButtonView}>
            { this._renderDrawButton() }
          </View>
        </View>
        <ScrollView style={styles.containerBottom}>
          <View style={styles.header}>
            <Text style={typography.text}>Drawn</Text>
            <Text style={typography.small}>Total ({ chaosBagResults.total })</Text>
          </View>
          <View style={styles.container}>
            <View style={styles.drawnTokenRow}>
              { this._renderDrawnTokens() }
            </View>
            <View>
              { this._renderClearButton() }
            </View>
          </View>
          <View style={styles.header}>
            <Text style={typography.text}>Sealed Tokens</Text>
          </View>
          <View>
            <Button title="Seal Token" onPress={this._handleSealTokenPressed} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  drawButtonView: {
    flex: 1,
  },
  chaosTokenView: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
    backgroundColor: COLORS.gray,
    height: 40,
  },
  containerTop: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 8,
  },
  containerBottom: {
    backgroundColor: COLORS.white,
    flex: 1,
    flexDirection: 'column',
  },
  drawnTokenRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    minHeight: 89,
  },
  drawTokenText: {
    flex: 1,
    textAlign: 'center',
  },
});
