import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { map } from 'lodash';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import BasicButton from 'components/core/BasicButton';
import UpgradeDeckRow from './UpgradeDeckRow';
import { Deck, Slots } from 'actions/types';
import InvestigatorRow from 'components/core/InvestigatorRow';
import CampaignGuideContext, { CampaignGuideContextType } from 'components/campaignguide/CampaignGuideContext';
import ScenarioStepContext, { ScenarioStepContextType } from 'components/campaignguide/ScenarioStepContext';
import Card from 'data/Card';
import { LatestDecks } from 'data/scenario';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import CampaignStateHelper from 'data/scenario/CampaignStateHelper';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import { saveDeckUpgrade, saveDeckChanges, DeckChanges } from 'components/deck/actions';
import { AppState } from 'reducers';
import typography from 'styles/typography';
import { m, s, xs } from 'styles/space';

interface ReduxActionProps {
  saveDeckChanges: (deck: Deck, changes: DeckChanges) => Promise<Deck>;
  saveDeckUpgrade: (deck: Deck, xp: number, exileCounts: Slots) => Promise<Deck>;
}

interface OwnProps {
  componentId: string;
  fontScale: number;
  id: string;
}

type Props = OwnProps & ReduxActionProps;

class UpgradeDecksInput extends React.Component<Props> {
  static contextType = ScenarioStepContext;
  context!: ScenarioStepContextType;

  _save = () => {
    const { id } = this.props;
    this.context.scenarioState.setDecision(id, true);
  };

  renderContent(
    scenarioInvestigators: Card[],
    latestDecks: LatestDecks,
    campaignLog: GuidedCampaignLog,
    campaignState: CampaignStateHelper,
    scenarioState: ScenarioStateHelper
  ) {
    const {
      componentId,
      id,
      saveDeckChanges,
      saveDeckUpgrade,
      fontScale,
    } = this.props;
    const hasDecision = scenarioState.decision(id) !== undefined;
    return (
      <View>
        <View style={styles.header}>
          <Text style={[typography.bigGameFont, typography.right]}>
            { t`Update decks with scenario results` }
          </Text>
        </View>
        { map(scenarioInvestigators, investigator => {
          if (campaignLog.isEliminated(investigator)) {
            return (
              <InvestigatorRow
                key={investigator.code}
                investigator={investigator}
                description={investigator.traumaString(campaignLog.traumaAndCardData(investigator.code))}
                eliminated
              />
            );
          }
          return (
            <UpgradeDeckRow
              key={investigator.code}
              id={id}
              fontScale={fontScale}
              componentId={componentId}
              saveDeckChanges={saveDeckChanges}
              saveDeckUpgrade={saveDeckUpgrade}
              campaignLog={campaignLog}
              campaignState={campaignState}
              scenarioState={scenarioState}
              investigator={investigator}
              deck={latestDecks[investigator.code]}
              editable={!hasDecision}
            />
          );
        }) }
        { !hasDecision && (
          <BasicButton title={t`Proceed`} onPress={this._save} />
        ) }
      </View>
    );
  }

  render() {
    return (
      <CampaignGuideContext.Consumer>
        { ({ latestDecks, campaignState }: CampaignGuideContextType) => (
          <ScenarioStepContext.Consumer>
            { ({ scenarioInvestigators, campaignLog, scenarioState }: ScenarioStepContextType) => (
              this.renderContent(scenarioInvestigators, latestDecks, campaignLog, campaignState, scenarioState)
            ) }
          </ScenarioStepContext.Consumer>
        ) }
      </CampaignGuideContext.Consumer>
    );
  }
}


function mapStateToProps(): {} {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    saveDeckChanges,
    saveDeckUpgrade,
  } as any, dispatch);
}

export default connect<{}, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(
  UpgradeDecksInput
);

const styles = StyleSheet.create({
  header: {
    paddingRight: m,
    paddingBottom: xs,
    paddingTop: s + m,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
  },
});
