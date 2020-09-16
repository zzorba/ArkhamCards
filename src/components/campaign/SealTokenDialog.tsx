import React from 'react';
import { ScrollView,StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { flatMap, keys, map, range, sortBy } from 'lodash';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { NavigationProps } from '@components/nav/types';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import { iconsMap } from '@app/NavIcons';
import COLORS from '@styles/colors';
import { AppState, getChaosBagResults } from '@reducers';
import { CHAOS_TOKEN_ORDER, ChaosBag, ChaosTokenType } from '@app_constants';
import { ChaosBagResults } from '@actions/types';
import SealTokenButton from './SealTokenButton';

export interface SealTokenDialogProps {
  campaignId: number;
  chaosBag: ChaosBag;
}

interface ReduxProps {
  chaosBagResults: ChaosBagResults;
}

type Props = NavigationProps & SealTokenDialogProps & ReduxProps & DimensionsProps;

class SealTokenDialog extends React.Component<Props> {
  static options() {
    return {
      topBar: {
        title: {
          text: t`Choose Tokens to Seal`,
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

  _close = () => {
    Navigation.dismissModal(this.props.componentId);
  };

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

    const sealedTokens = chaosBagResults.sealedTokens;

    let currentToken: ChaosTokenType;
    let tokenCount = 1;

    return tokenParts.map((token, index) => {
      if (currentToken !== token) {
        currentToken = token;
        tokenCount = 1;
      } else {
        tokenCount += 1;
      }

      const id = `${token}_${tokenCount}`;
      let sealed = false;
      const sealedToken = sealedTokens.find(sealedToken => sealedToken.id === id);
      if (sealedToken) {
        sealed = true;
      }

      return (
        <SealTokenButton
          key={index}
          id={id}
          sealed={sealed}
          campaignId={campaignId}
          canDisable
          iconKey={token}
        />
      );
    });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.drawnTokenRow}>{ this.getAllChaosTokens() }</View>
        <BasicButton title={t`Done`} onPress={this._close} />
      </ScrollView>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & SealTokenDialogProps
): ReduxProps {
  return {
    chaosBagResults: getChaosBagResults(state, props.campaignId),
  };
}


export default connect<ReduxProps, unknown, NavigationProps & SealTokenDialogProps, AppState>(
  mapStateToProps
)(
  withDimensions(SealTokenDialog)
);

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
