import React from 'react';
import { TouchableHighlight } from 'react-native';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { updateChaosBagResults } from './actions';
import ChaosToken from './ChaosToken';
import { ChaosBagResults } from 'actions/types';
import { AppState, getChaosBagResults } from 'reducers';
import { ChaosTokenType } from 'constants';

interface OwnProps {
  campaignId: number;
  fontScale: number;
  id: string;
  iconKey: ChaosTokenType;
  sealed?: boolean;
  canDisable?: boolean;
}

interface ReduxProps {
  chaosBagResults: ChaosBagResults;
}

interface ReduxActionProps {
  updateChaosBagResults: (id: number, chaosBagResults: ChaosBagResults) => void;
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

class SealTokenButton extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    sealed: false,
    canDisable: false,
  };

  _toggleSealToken = () => {
    const {
      campaignId,
      chaosBagResults,
      id,
      updateChaosBagResults,
      iconKey,
      sealed,
    } = this.props;

    let newSealedTokens = [...chaosBagResults.sealedTokens];

    if (sealed) {
      newSealedTokens = newSealedTokens.filter(token => token.id !== id);
    } else {
      const token = { id: id, icon: iconKey };
      newSealedTokens.push(token);
    }

    const newChaosBagResults = {
      drawnTokens: chaosBagResults.drawnTokens,
      sealedTokens: newSealedTokens,
      totalDrawnTokens: chaosBagResults.totalDrawnTokens,
    };

    updateChaosBagResults(campaignId, newChaosBagResults);
  }

  render() {
    const {
      iconKey,
      sealed,
      canDisable,
      fontScale,
    } = this.props;
    return (
      <TouchableHighlight style={sealed && canDisable && { opacity: 0.2 }} onPress={this._toggleSealToken} underlayColor="transparent">
        <ChaosToken iconKey={iconKey} fontScale={fontScale} small />
      </TouchableHighlight>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: OwnProps
): ReduxProps {
  return {
    chaosBagResults: getChaosBagResults(state, props.campaignId),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    updateChaosBagResults,
  } as any, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SealTokenButton);
