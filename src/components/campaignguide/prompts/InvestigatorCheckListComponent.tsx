import React from 'react';
import { map, filter, findIndex } from 'lodash';

import CheckListComponent from './CheckListComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import { InvestigatorDeck } from 'data/scenario';
import { FACTION_LIGHT_GRADIENTS } from 'constants';

interface Props {
  id: string;
  checkText: string;
  defaultState?: boolean;
  min: number;
  max: number;
  allowNewDecks?: boolean;
  investigators?: string[];
  filter?: (investigatorDeck: InvestigatorDeck) => boolean;
}

export default class InvestigatorCheckListComponent extends React.Component<Props> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  _filterInvestigator = (investigator: InvestigatorDeck): boolean => {
    const { investigators, filter } = this.props;
    if (investigators) {
      return findIndex(
        investigators,
        code => code === investigator.investigator.code
      ) !== -1;
    }
    if (filter) {
      return filter(investigator);
    }
    return true;
  };

  render() {
    const {
      id,
      checkText,
      min,
      max,
      allowNewDecks,
      defaultState,
    } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ investigatorDecks }: ScenarioGuideContextType) => {
          const investigators = filter(investigatorDecks, this._filterInvestigator);
          return (
            <CheckListComponent
              id={id}
              checkText={checkText}
              defaultState={defaultState}
              items={map(
                investigators,
                ({ investigator, deck }) => {
                  return {
                    code: investigator.code,
                    name: investigator.name,
                    value: allowNewDecks ? deck.id : undefined,
                    tintColor: FACTION_LIGHT_GRADIENTS[investigator.factionCode()][0],
                  };
                })
              }
              fixedMin={allowNewDecks}
              min={min}
              max={max}
            />
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
