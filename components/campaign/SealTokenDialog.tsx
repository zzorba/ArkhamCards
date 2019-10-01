import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { flatMap, keys, map, range, sortBy } from 'lodash';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { NavigationProps } from '../types';
import { updateCampaign } from './actions';
import { iconsMap } from '../../app/NavIcons';
import { COLORS } from '../../styles/colors';
import { AppState, getCampaign } from '../../reducers';
import { CHAOS_TOKEN_ORDER, ChaosBag, ChaosTokenType } from '../../constants';
import { Campaign, ChaosBagResults, NEW_CHAOS_BAG_RESULTS } from '../../actions/types';
import SealTokenButton from './SealTokenButton';

const uuidv4 = require('uuid/v4');

export interface SealTokenDialogProps {
  campaignId: number;
}

interface ReduxProps {
  chaosBag: ChaosBag;
  chaosBagResults: ChaosBagResults;
}

interface ReduxActionProps {
  updateCampaign: (id: number, chaosBagResults: Partial<Campaign>) => void;
}

type Props = NavigationProps & SealTokenDialogProps & ReduxProps & ReduxActionProps;

class SealTokenDialog extends React.Component<Props> {
  static options() {
    return {
      topBar: {
        title: {
          text: t`Choose a Token`,
        },
        leftButtons: [{
          icon: iconsMap.close,
          id: 'close',
          color: COLORS.navButton,
          testID: t`Cancel`,
        }],
      },
    };
  }

  _navEventListener: EventSubscription;

  constructor(props: Props) {
    super(props);

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    const {
      componentId,
    } = this.props;
    if (buttonId === 'close') {
      Navigation.dismissModal(componentId);
    }
  }

  getAllChaosTokens() {
    const {
      campaignId,
      chaosBag,
      chaosBagResults,
    } = this.props;

    const unsortedTokens: ChaosTokenType[] = keys(chaosBag) as ChaosTokenType[];
    const tokens: ChaosTokenType[] = sortBy<ChaosTokenType>(
      unsortedTokens,
      token => CHAOS_TOKEN_ORDER[token]);
    const tokenParts = flatMap(tokens,
      token => map(range(0, chaosBag[token]), () => token));

    const sealedTokens: ChaosBag = {};
    chaosBagResults.sealedTokens.forEach(token => {
      sealedTokens[token.icon] = (sealedTokens[token.icon] || 0) + 1;
    });

    return tokenParts.map((token, index) => {
      let sealed = false;
      const count = sealedTokens[token] || 0;
      if (count > 0) {
        sealed = true;
        sealedTokens[token] = count - 1;
      }

      const id = uuidv4();
      return <SealTokenButton key={index} id={id} sealed={sealed} campaignId={campaignId} canDisable iconKey={token} />;
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.drawnTokenRow}>{ this.getAllChaosTokens() }</View>
      </View>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & SealTokenDialogProps
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

export default connect<ReduxProps, ReduxActionProps, NavigationProps & SealTokenDialogProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SealTokenDialog);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 15,
  },
  drawnTokenRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    minHeight: 89,
  },
});
