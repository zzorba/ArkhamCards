import React from 'react';
import { map, filter, findIndex } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CheckListComponent from './CheckListComponent';
import CampaignGuideContext, { CampaignGuideContextType } from '../CampaignGuideContext';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';
import Card from '@data/Card';
import COLORS from '@styles/colors';

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
      <BasicButton
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
              color: COLORS.faction[investigator.factionCode()].background,
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
                    filter(
                      campaignInvestigators,
                      investigator => !campaignLog.isEliminated(investigator)
                    ) : scenarioInvestigators
                );
              } }
            </ScenarioStepContext.Consumer>
          );
        } }
      </CampaignGuideContext.Consumer>
    );
  }
}
