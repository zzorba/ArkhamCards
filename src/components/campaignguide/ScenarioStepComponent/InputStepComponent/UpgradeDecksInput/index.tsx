import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { find, map } from 'lodash';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import withStyles, { StylesProps } from '@components/core/withStyles';
import BasicButton from '@components/core/BasicButton';
import UpgradeDeckRow from './UpgradeDeckRow';
import { Deck, Slots } from '@actions/types';
import InvestigatorRow from '@components/core/InvestigatorRow';
import ScenarioStepContext, { ScenarioStepContextType } from '@components/campaignguide/ScenarioStepContext';
import Card from '@data/Card';
import { LatestDecks } from '@data/scenario';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { saveDeckUpgrade, saveDeckChanges, DeckChanges } from '@components/deck/actions';
import { AppState } from '@reducers';
import typography from '@styles/typography';
import { m, s, xs } from '@styles/space';
import COLORS from '@styles/colors';

interface ReduxActionProps {
  saveDeckChanges: (deck: Deck, changes: DeckChanges) => Promise<Deck>;
  saveDeckUpgrade: (deck: Deck, xp: number, exileCounts: Slots) => Promise<Deck>;
}

interface OwnProps {
  componentId: string;
  fontScale: number;
  id: string;
  latestDecks: LatestDecks;
  campaignState: CampaignStateHelper;
}

type Props = OwnProps & ReduxActionProps & StylesProps;

interface State {
  unsavedEdits: {
    [code: string]: boolean | undefined;
  };
}
class UpgradeDecksInput extends React.Component<Props, State> {
  static contextType = ScenarioStepContext;
  context!: ScenarioStepContextType;

  state: State = {
    unsavedEdits: {},
  };

  _setUnsavedEdits = (code: string, edits: boolean) => {
    this.setState({
      unsavedEdits: {
        ...this.state.unsavedEdits,
        [code]: edits,
      },
    });
  };

  proceedMessage(): string | undefined {
    const {
      id,
      latestDecks,
    } = this.props;
    const { unsavedEdits } = this.state;
    const {
      scenarioInvestigators,
      scenarioState,
      campaignLog,
    } = this.context;
    const unsavedDeck = find(
      scenarioInvestigators,
      investigator => {
        if (campaignLog.isEliminated(investigator)) {
          return false;
        }
        const choiceId = UpgradeDeckRow.choiceId(id, investigator);
        if (scenarioState.numberChoices(choiceId) !== undefined) {
          // Already saved
          return false;
        }
        if (latestDecks[investigator.code]) {
          return true;
        }
        return false;
      });
    if (unsavedDeck) {
      return t`It looks like one or more deck upgrades are unsaved. If you would like the app to track spent experience as you make deck changes, please go back and press 'Save deck upgrade' on each investigator before proceeding to the next scenario.\n\nOnce an upgrade has been saved, you can edit the deck as normal and the app will properly track the experience cost for any changes you make (the original versions of the deck can still be viewed from the deck's menu).`;
    }

    const unsavedNonDeck = find(
      scenarioInvestigators,
      investigator => {
        if (campaignLog.isEliminated(investigator)) {
          return false;
        }
        const choiceId = UpgradeDeckRow.choiceId(id, investigator);
        if (scenarioState.numberChoices(choiceId) !== undefined) {
          // Already saved
          return false;
        }
        if (latestDecks[investigator.code]) {
          return false;
        }
        return !!unsavedEdits[investigator.code];
      });
    if (unsavedNonDeck) {
      return t`It looks like you edited the experience or trauma for an investigator, but have not saved it yet. Please go back and select ‘Save adjustments’ to ensure your changes are saved.`;
    }
    return undefined;
  }

  _actuallySave = () => {

    const { id } = this.props;
    const { scenarioState } = this.context;
    scenarioState.setDecision(id, true);
  }

  _save = () => {
    const warningMessage = this.proceedMessage();
    if (warningMessage) {
      Alert.alert(
        t`Proceed without saving`,
        warningMessage,
        [{
          text: t`Cancel`,
          style: 'cancel',
        }, {
          text: t`Proceed anyway`,
          style: 'destructive',
          onPress: this._actuallySave,
        }]
      );
    } else {
      this._actuallySave();
    }
  };

  renderContent(
    scenarioInvestigators: Card[],
    campaignLog: GuidedCampaignLog,
    scenarioState: ScenarioStateHelper
  ) {
    const {
      componentId,
      id,
      saveDeckChanges,
      saveDeckUpgrade,
      fontScale,
      latestDecks,
      campaignState,
      gameFont,
    } = this.props;
    const hasDecision = scenarioState.decision(id) !== undefined;
    return (
      <View>
        <View style={styles.header}>
          <Text style={[typography.bigGameFont, { fontFamily: gameFont }, typography.right]}>
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
                fontScale={fontScale}
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
              setUnsavedEdits={this._setUnsavedEdits}
              editable={!hasDecision}
            />
          );
        }) }
        { !hasDecision && (
          <BasicButton
            title={t`Proceed`}
            onPress={this._save}
          />
        ) }
      </View>
    );
  }

  render() {
    return (
      <ScenarioStepContext.Consumer>
        { ({ scenarioInvestigators, campaignLog, scenarioState }: ScenarioStepContextType) => (
          this.renderContent(scenarioInvestigators, campaignLog, scenarioState)
        ) }
      </ScenarioStepContext.Consumer>
    );
  }
}


/* eslint-disable @typescript-eslint/ban-types */
function mapStateToProps(): {} {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    saveDeckChanges,
    saveDeckUpgrade,
  } as any, dispatch);
}

/* eslint-disable @typescript-eslint/ban-types */
export default connect<{}, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(
  withStyles(UpgradeDecksInput)
);

const styles = StyleSheet.create({
  header: {
    paddingRight: m,
    paddingBottom: xs,
    paddingTop: s + m,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
});
