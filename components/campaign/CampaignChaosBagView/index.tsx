import React from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep, keys, values, shuffle } from 'lodash';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { iconsMap } from '../../../app/NavIcons';
import { NavigationProps } from '../../types';
import { ChaosBag } from '../../../constants';
import { COLORS } from '../../../styles/colors';
import { Campaign, ChaosBagResults, NEW_CHAOS_BAG_RESULTS } from '../../../actions/types';
import typography from '../../../styles/typography';
import { EditChaosBagProps } from '../EditChaosBagDialog';
import ChaosToken from '../ChaosToken';
import { updateCampaign } from '../actions';
import { AppState, getCampaign } from '../../../reducers';
import { SealTokenDialogProps } from '../SealTokenDialog';
import SealTokenButton from '../SealTokenButton';

export interface CampaignChaosBagProps {
  componentId: string;
  campaignId: number;
  updateChaosBag: (chaosBag: ChaosBag) => void;
  trackDeltas?: boolean;
}

interface ReduxProps {
  chaosBag: ChaosBag;
  chaosBagResults: ChaosBagResults;
}

interface ReduxActionProps {
  updateCampaign: (id: number, chaosBagResults: Partial<Campaign>) => void;
}

interface State {
  isChaosBagEmpty: boolean;
}

type Props = NavigationProps & CampaignChaosBagProps & ReduxProps & ReduxActionProps;

class CampaignChaosBagView extends React.Component<Props, State> {
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
      isChaosBagEmpty: false,
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
    const {
      chaosBagResults,
    } = this.props;

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
    const {
      campaignId,
    } = this.props;
    const passProps: SealTokenDialogProps = {
      campaignId: campaignId,
    };
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Dialog.SealToken',
            passProps,
          },
        }],
      },
    });
  };

  _showChaosBagDialog = () => {
    const {
      componentId,
      chaosBag,
      updateChaosBag,
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

  getWeighedChaosBag(list: any[], weight: any[]) {
    const weighedList = [];

    for (let i = 0; i < weight.length; i++) {
      const multiples = weight[i];

      for (let j = 0; j < multiples; j++) {
        weighedList.push(list[i]);
      }
    }

    return weighedList;
  }

  getRandomChaosToken(chaosBag: ChaosBag) {
    const list = keys(chaosBag);
    const weight = values(chaosBag);
    const weighedList = this.getWeighedChaosBag(list, weight);

    this.setState({
      isChaosBagEmpty: weighedList.length <= 1,
    });

    return shuffle(weighedList)[0];
  }

  drawToken() {
    const {
      campaignId,
      chaosBag,
      chaosBagResults,
      updateCampaign,
    } = this.props;

    const currentChaosBag = cloneDeep(chaosBag);
    const drawnTokens = [...chaosBagResults.drawnTokens];

    drawnTokens.forEach(function(token) {
      const currentCount = currentChaosBag[token];
      if (currentCount) {
        currentChaosBag[token] = currentCount - 1;
      }
    });

    const newIconKey = this.getRandomChaosToken(currentChaosBag);

    if (newIconKey) {
      drawnTokens.push(newIconKey);

      const newChaosBagResults = {
        drawnTokens: drawnTokens,
        sealedTokens: chaosBagResults.sealedTokens,
        totalDrawnTokens: chaosBagResults.totalDrawnTokens + 1,
      };

      updateCampaign(campaignId, { chaosBagResults: newChaosBagResults });
    } else {
      this.clearTokens();
    }
  }

  clearTokens() {
    const {
      campaignId,
      chaosBagResults,
      updateCampaign,
    } = this.props;

    const newChaosBagResults = {
      drawnTokens: [],
      sealedTokens: chaosBagResults.sealedTokens,
      totalDrawnTokens: chaosBagResults.totalDrawnTokens,
    };

    updateCampaign(campaignId, { chaosBagResults: newChaosBagResults });
  }

  renderChaosToken() {
    const {
      chaosBagResults,
    } = this.props;

    const iconKey = chaosBagResults.drawnTokens[chaosBagResults.drawnTokens.length - 1] || undefined;

    return (
      <TouchableOpacity onPress={this._handleDrawTokenPressed}>
        <ChaosToken iconKey={iconKey} />
      </TouchableOpacity>
    );
  }

  renderDrawnTokens() {
    const {
      chaosBagResults,
    } = this.props;

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

  renderSealedTokens() {
    const {
      campaignId,
      chaosBagResults,
    } = this.props;

    const sealedTokens = chaosBagResults.sealedTokens;

    return sealedTokens.map(token => {
      return <SealTokenButton key={token.id} campaignId={campaignId} sealed id={token.id} iconKey={token.icon} />;
    });
  }

  renderDrawButton() {
    const {
      chaosBagResults,
    } = this.props;

    const {
      isChaosBagEmpty,
    } = this.state;

    if (chaosBagResults.drawnTokens.length > 0) {
      return <Button title={t`Add and Draw Again`} onPress={this._handleAddAndDrawAgainPressed} disabled={isChaosBagEmpty} />;
    }
  }

  renderClearButton() {
    const {
      chaosBagResults,
    } = this.props;

    if (chaosBagResults.drawnTokens.length > 1) {
      return <Button title={t`Clear Tokens`} onPress={this._handleClearTokensPressed} />;
    }
  }

  render() {
    const {
      chaosBagResults,
    } = this.props;

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
            { chaosBagResults.sealedTokens.length > 0 && <View style={styles.drawnTokenRow}>
              { this.renderSealedTokens() }
            </View> }
            <Button title={t`Seal Token`} onPress={this._handleSealTokenPressed} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & CampaignChaosBagProps
): ReduxProps {
  const campaign = getCampaign(state, props.campaignId);
  return {
    chaosBag: campaign ? campaign.chaosBag : {},
    chaosBagResults: (campaign && campaign.chaosBagResults) || NEW_CHAOS_BAG_RESULTS,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    updateCampaign,
  } as any, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, NavigationProps & CampaignChaosBagProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(CampaignChaosBagView);

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
