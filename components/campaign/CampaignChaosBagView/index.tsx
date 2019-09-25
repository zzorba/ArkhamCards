import React from 'react';
import { keys, values, shuffle } from 'lodash';
import { Button, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { t } from 'ttag';

import { iconsMap } from '../../../app/NavIcons';
import { NavigationProps } from '../../types';
import { ChaosBag, ChaosTokenType } from '../../../constants';
import { COLORS } from '../../../styles/colors';
import { Campaign, ChaosBagResults } from '../../../actions/types';
import typography from '../../../styles/typography';
import { EditChaosBagProps } from '../EditChaosBagDialog';
import ChaosToken from '../ChaosToken';
import { updateCampaign } from '../actions';
import { connect } from 'react-redux';
import { AppState, getCampaign } from '../../../reducers';

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

type Props = NavigationProps & CampaignChaosBagProps & ReduxProps & ReduxActionProps;

class CampaignChaosBagView extends React.Component<Props> {
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
    const { chaosBagResults } = this.props;
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

  getWeighedChaosBag = (list: any[], weight: any[]) => {
    const weighedList = [];

    for (let i = 0; i < weight.length; i++) {
      const multiples = weight[i];

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
    const { campaignId, chaosBag, chaosBagResults } = this.props;

    const newIconKey = this.getRandomChaosToken(chaosBag);
    const drawnTokens = chaosBagResults.drawnTokens;

    if (newIconKey) {
      drawnTokens.push(newIconKey);
    }

    const newChaosBagResults = {
      drawnTokens: drawnTokens,
      sealedTokens: chaosBagResults.sealedTokens,
      totalDrawnTokens: chaosBagResults.totalDrawnTokens + 1,
    };

    updateCampaign(campaignId, { chaosBagResults: newChaosBagResults });
  }

  // _mutateCount = (id: ChaosTokenType, mutate: (count: number) => number) => {
  //   this.setState((state: State) => {
  //     const newChaosBag = Object.assign(
  //       {},
  //       state.chaosBag,
  //       { [id]: mutate(state.chaosBag[id] || 0) }
  //     );
  //     return {
  //       chaosBag: newChaosBag,
  //     };
  //   });
  // };

  clearTokens = () => {
    const { campaignId, chaosBagResults } = this.props;

    const newChaosBagResults = {
      drawnTokens: [],
      sealedTokens: chaosBagResults.sealedTokens,
      totalDrawnTokens: chaosBagResults.totalDrawnTokens,
    };

    updateCampaign(campaignId, { chaosBagResults: newChaosBagResults });
  }

  renderChaosToken = () => {
    const { chaosBagResults } = this.props;
    const iconKey = chaosBagResults.drawnTokens[chaosBagResults.drawnTokens.length - 1] || undefined;

    return (
      <TouchableOpacity onPress={this._handleDrawTokenPressed}>
        <ChaosToken iconKey={iconKey} />
      </TouchableOpacity>
    );
  }

  renderDrawnTokens() {
    const { chaosBagResults } = this.props;

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
    const { chaosBagResults } = this.props;

    if (chaosBagResults.drawnTokens.length > 0) {
      return <Button title={t`Add and Draw Again`} onPress={this._handleAddAndDrawAgainPressed} />;
    }
  }

  renderClearButton = () => {
    const { chaosBagResults } = this.props;

    if (chaosBagResults.drawnTokens.length > 1) {
      return <Button title={t`Clear Tokens`} onPress={this._handleClearTokensPressed} />;
    }
  }

  render() {
    const { chaosBagResults } = this.props;

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

const EMPTY_CHAOS_BAG = {
  drawnTokens: [],
  sealedTokens: [],
  totalDrawnTokens: 0,
};

function mapStateToProps(
  state: AppState,
  props: NavigationProps & CampaignChaosBagProps
): ReduxProps {
  const campaign = getCampaign(state, props.campaignId);
  return {
    chaosBag: campaign ? campaign.chaosBag : {},
    chaosBagResults: campaign ? campaign.chaosBagResults : EMPTY_CHAOS_BAG,
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
