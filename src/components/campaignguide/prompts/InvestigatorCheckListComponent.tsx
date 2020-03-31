import React from 'react';
import { map, filter } from 'lodash';

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
  deckMode?: boolean;
  filter?: (investigatorDeck: InvestigatorDeck) => boolean;
}

export default class InvestigatorCheckListComponent extends React.Component<Props> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  render() {
    const { id, checkText, min, max, deckMode, defaultState } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ investigatorDecks }: ScenarioGuideContextType) => {
          return (
            <CheckListComponent
              id={id}
              checkText={checkText}
              defaultState={defaultState}
              items={map(
                filter(investigatorDecks, deck => !this.props.filter || this.props.filter(deck)),
                ({ investigator, deck }) => {
                  return {
                    code: investigator.code,
                    name: investigator.name,
                    value: deckMode ? deck.id : undefined,
                    tintColor: FACTION_LIGHT_GRADIENTS[investigator.factionCode()][0],
                  };
                })
              }
              min={min}
              max={max}
            />
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
