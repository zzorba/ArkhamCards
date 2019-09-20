import React from 'react';
import { keys, values, shuffle } from 'lodash';
import { Button, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { iconsMap } from '../../../app/NavIcons';
import { NavigationProps } from '../../types';
import { ChaosBag, ChaosTokenType } from '../../../constants';
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
  chaosBag: ChaosBag;
  chaosBagResults: ChaosBagResults;
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
      chaosBag: Object.assign({}, props.chaosBag),
      chaosBagResults: {
        drawnTokens: [],
        sealedTokens: [],
        totalDrawnTokens: 0,
      },
    };

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    const { componentId } = this.props;
    if (buttonId === 'back' || buttonId === 'androidBack') {
      Navigation.pop(componentId);
    } else if (buttonId === 'edit') {
      this._showChaosBagDialog();
    }
  }

  _handleClearTokensPressed = () => {
    this.clearTokens();
  };

  _handleDrawTokenPressed = () => {
    const { chaosBagResults } = this.state;
    if (chaosBagResults.drawnTokens.length >= 1) {
      this.clearTokens();
    } else {
      this.drawToken();
    }
  };

  _handleAddAndDrawAgainPressed = () => {
    this.drawToken();
  };

  _handleSealTokenPressed = () => {
  };

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
  };

  getWeighedChaosBag = (list: any[], weight: any[]) => {
    const weighedList = [];

    const totalWeight = weight.reduce((prev, cur) => {
      return (prev && cur) ? (prev + cur) : 0;
    });

      for (let j = 0; j < multiples; j++) {
        weighedList.push(list[i]);
      }
    }

    return weighedList;
  }

  getRandomChaosToken = (chaosBag: ChaosBag) => {
    const list = keys(chaosBag);
    const weight = values(chaosBag);
    const weighedList = this.getWeighedChaosBag(list, weight);

    return shuffle(weighedList)[0];
  };

  drawToken = () => {
    const { chaosBag } = this.props;
    const { chaosBagResults } = this.state;

    const newIconKey = this.getRandomChaosToken(chaosBag);
    const drawnTokens = chaosBagResults.drawnTokens;

    if (newIconKey) {
      drawnTokens.push(newIconKey);
    }

    this.setState({
      chaosBagResults: {
        drawnTokens: drawnTokens,
        sealedTokens: chaosBagResults.sealedTokens,
        totalDrawnTokens: chaosBagResults.totalDrawnTokens + 1,
      },
    });
  }

  clearTokens = () => {
    const { chaosBagResults } = this.state;

    this.setState({
      chaosBagResults: {
        drawnTokens: [],
        sealedTokens: chaosBagResults.sealedTokens,
        totalDrawnTokens: chaosBagResults.totalDrawnTokens,
      },
    });
  }

  renderChaosToken = () => {
    const { chaosBagResults } = this.state;
    const iconKey = chaosBagResults.drawnTokens[chaosBagResults.drawnTokens.length - 1] || undefined;

    return (
      <TouchableOpacity onPress={this._handleDrawTokenPressed}>
        <ChaosToken iconKey={iconKey} />
      </TouchableOpacity>
    );
  }

  renderDrawnTokens() {
    const { chaosBagResults } = this.state;

    const drawnTokens = chaosBagResults.drawnTokens;

    if (drawnTokens.length > 1) {
      return drawnTokens.slice(0, drawnTokens.length - 1).map(function(token, index) {
        return (
          <ChaosToken key={index} iconKey={token} small />
        );
      });
    }

    return <Text style={[styles.drawTokenText, typography.text]}>{ t`Tap token to draw` }</Text>;
  }

  renderDrawButton = () => {
    const { chaosBagResults } = this.state;

    if (chaosBagResults.drawnTokens.length > 0) {
      return <Button title={t`Add and Draw Again`} onPress={this._handleAddAndDrawAgainPressed} />;
    }
  }

  renderClearButton = () => {
    const { chaosBagResults } = this.state;

    if (chaosBagResults.drawnTokens.length > 1) {
      return <Button title={t`Clear Tokens`} onPress={this._handleClearTokensPressed} />;
    }
  }

  render() {
    const { chaosBagResults } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <View style={styles.chaosTokenView}>
            { this.renderChaosToken() }
          </View>
          <View style={styles.drawButtonView}>
            { this.renderDrawButton() }
          </View>
        </View>
        <ScrollView style={styles.containerBottom}>
          <View style={styles.header}>
            <Text style={typography.text}>{ t`Drawn` }</Text>
            <Text style={typography.small}>{ t`Total` } ({ chaosBagResults.totalDrawnTokens })</Text>
          </View>
          <View style={styles.container}>
            <View style={styles.drawnTokenRow}>
              { this.renderDrawnTokens() }
            </View>
            <View>
              { this.renderClearButton() }
            </View>
          </View>
          <View style={styles.header}>
            <Text style={typography.text}>{ t`Sealed Tokens` }</Text>
          </View>
          <View style={styles.container}>
            <Button title={t`Seal Token`} onPress={this._handleSealTokenPressed} />
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
