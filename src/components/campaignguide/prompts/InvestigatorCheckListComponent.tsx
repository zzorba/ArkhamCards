import React from 'react';
import { Button } from 'react-native';
import { map, filter, findIndex } from 'lodash';
import { t } from 'ttag';

import CheckListComponent from './CheckListComponent';
import CampaignGuideContext, { CampaignGuideContextType } from '../CampaignGuideContext';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';
import Card from 'data/Card';
import { FACTION_LIGHT_GRADIENTS } from 'constants';

interface Props {
  id: string;
  choiceId: string;
  checkText: string;
  defaultState?: boolean;
  min: number;
  max: number;
  allowNewDecks?: boolean;
  investigators?: string[];
  filter?: (investigator: Card) => boolean;
}

export default class InvestigatorCheckListComponent extends React.Component<Props> {
  static contextType = CampaignGuideContext;
  context!: CampaignGuideContextType;

  _showAddDeckDialog = () => {
    this.context.campaignState.showChooseDeck();
  };

  _filterInvestigator = (investigator: Card): boolean => {
    const { investigators, filter } = this.props;
    if (investigators) {
      return findIndex(
        investigators,
        code => code === investigator.code
      ) !== -1;
    }
    if (filter) {
      return filter(investigator);
    }
    return true;
  };

  addDeckButton() {
    const {
      allowNewDecks,
    } = this.props;
    if (!allowNewDecks) {
      return null;
    }
    return (
      <Button
        onPress={this._showAddDeckDialog}
        title={t`Add new investigator`}
      />
    );
  }

  renderContent(allInvestigators: Card[]) {
    const {
      id,
      choiceId,
      checkText,
      min,
      max,
      allowNewDecks,
      defaultState,
    } = this.props;
    const investigators = filter(allInvestigators, this._filterInvestigator);
    return (
      <CheckListComponent
        id={id}
        choiceId={choiceId}
        checkText={checkText}
        defaultState={defaultState}
        items={map(
          investigators,
          investigator => {
            return {
              code: investigator.code,
              name: investigator.name,
              tintColor: FACTION_LIGHT_GRADIENTS[investigator.factionCode()][0],
            };
          })
        }
        button={this.addDeckButton()}
        fixedMin={allowNewDecks}
        min={min}
        max={max}
      />
    );
  }

  render() {
    const { allowNewDecks } = this.props;
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignInvestigators }: CampaignGuideContextType) => {
          return (
            <ScenarioStepContext.Consumer>
              { ({ scenarioInvestigators, campaignLog }: ScenarioStepContextType) => {
                return this.renderContent(
                  allowNewDecks ?
                    filter(campaignInvestigators,
                      investigator => !investigator.eliminated(campaignLog.traumaAndCardData(investigator.code))) :
                    scenarioInvestigators);
              } }
            </ScenarioStepContext.Consumer>
          );
        } }
      </CampaignGuideContext.Consumer>
    );
  }
}
