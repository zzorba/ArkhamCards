import React from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep, shuffle } from 'lodash';
import { EventSubscription, Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';

import { NavigationProps } from 'components/nav/types';
import { ChaosBag } from 'constants';
import { COLORS } from 'styles/colors';
import { ChaosBagResults } from 'actions/types';
import typography from 'styles/typography';
import { EditChaosBagProps } from '../EditChaosBagDialog';
import ChaosToken from '../ChaosToken';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { updateChaosBagResults } from '../actions';
import { AppState, getCampaign, getChaosBagResults } from 'reducers';
import { SealTokenDialogProps } from '../SealTokenDialog';
import SealTokenButton from '../SealTokenButton';
import { flattenChaosBag } from '../campaignUtil';

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
  updateChaosBagResults: (id: number, chaosBagResults: ChaosBagResults) => void;
}

interface State {
  isChaosBagEmpty: boolean;
}

type Props = NavigationProps &
  CampaignChaosBagProps &
  ReduxProps &
  ReduxActionProps &
  DimensionsProps;

class CampaignChaosBagView extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
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

  _handleSealTokensPressed = () => {
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
            options: {
              modalPresentationStyle: Platform.OS === 'ios' ?
                OptionsModalPresentationStyle.overFullScreen :
                OptionsModalPresentationStyle.overCurrentContext,
            },
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

  getRandomChaosToken(chaosBag: ChaosBag) {
    const weightedList = flattenChaosBag(chaosBag);

    this.setState({
      isChaosBagEmpty: weightedList.length <= 1,
    });

    return shuffle(weightedList)[0];
  }

  drawToken() {
    const {
      campaignId,
      chaosBag,
      chaosBagResults,
      updateChaosBagResults,
    } = this.props;

    const currentChaosBag = cloneDeep(chaosBag);
    const drawnTokens = [...chaosBagResults.drawnTokens];
    const sealedTokens = [...chaosBagResults.sealedTokens].map(token => token.icon);

    const drawnAndSealedTokens = drawnTokens.concat(sealedTokens);

    drawnAndSealedTokens.forEach(function(token) {
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

      updateChaosBagResults(campaignId, newChaosBagResults);
    } else {
      this.clearTokens();
    }
  }

  clearTokens() {
    const {
      campaignId,
      chaosBagResults,
      updateChaosBagResults,
    } = this.props;

    const newChaosBagResults: ChaosBagResults = {
      drawnTokens: [],
      sealedTokens: chaosBagResults.sealedTokens,
      totalDrawnTokens: chaosBagResults.totalDrawnTokens,
    };

    updateChaosBagResults(campaignId, newChaosBagResults);
  }

  renderChaosToken() {
    const {
      chaosBagResults,
      fontScale,
    } = this.props;

    const iconKey = chaosBagResults.drawnTokens[chaosBagResults.drawnTokens.length - 1] || undefined;

    return (
      <TouchableOpacity onPress={this._handleDrawTokenPressed}>
        <ChaosToken iconKey={iconKey} fontScale={fontScale} />
      </TouchableOpacity>
    );
  }

  renderDrawnTokens() {
    const {
      chaosBagResults,
      fontScale,
    } = this.props;

    const drawnTokens = chaosBagResults.drawnTokens;

    if (drawnTokens.length > 1) {
      return drawnTokens.slice(0, drawnTokens.length - 1).map(function(token, index) {
        return (
          <ChaosToken
            fontScale={fontScale}
            key={index}
            iconKey={token}
            small
          />
        );
      });
    }

    return <Text style={[styles.drawTokenText, typography.text]}>{ t`Tap token to draw` }</Text>;
  }

  renderSealedTokens() {
    const {
      campaignId,
      chaosBagResults,
      fontScale,
    } = this.props;

    const sealedTokens = chaosBagResults.sealedTokens;

    return sealedTokens.map(token => {
      return (
        <SealTokenButton
          key={token.id}
          campaignId={campaignId}
          sealed
          id={token.id}
          iconKey={token.icon}
          fontScale={fontScale}
        />
      );
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
      return <Button title={t`Set aside and draw another`} onPress={this._handleAddAndDrawAgainPressed} disabled={isChaosBagEmpty} />;
    }
  }

  renderClearButton() {
    const {
      chaosBagResults,
    } = this.props;

    if (chaosBagResults.drawnTokens.length > 1) {
      return (
        <View style={styles.buttonContainer}>
          <Button title={t`Clear Tokens`} onPress={this._handleClearTokensPressed} />
        </View>
      );
    }
    return null;
  }

  render() {
    const {
      chaosBagResults,
    } = this.props;

    return (
      <ScrollView style={styles.containerBottom}>
        <View style={styles.containerTop}>
          <View style={styles.chaosTokenView}>
            { this.renderChaosToken() }
          </View>
          <View style={styles.drawButtonView}>
            { this.renderDrawButton() }
          </View>
        </View>
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
          <View style={styles.buttonContainer}>
            <Button title={t`Seal Tokens`} onPress={this._handleSealTokensPressed} />
          </View>
        </View>
      </ScrollView>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & CampaignChaosBagProps
): ReduxProps {
  const campaign = getCampaign(state, props.campaignId);
  return {
    chaosBag: (campaign && campaign.chaosBag) || {},
    chaosBagResults: getChaosBagResults(state, props.campaignId),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    updateChaosBagResults,
  } as any, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, NavigationProps & CampaignChaosBagProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(
  withDimensions(CampaignChaosBagView)
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  drawButtonView: {
    flex: 1,
    minHeight: 60,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  buttonContainer: {
    padding: 8,
  },
});
