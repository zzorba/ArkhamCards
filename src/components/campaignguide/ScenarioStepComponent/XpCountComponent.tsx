import React, { useContext } from 'react';
import { map } from 'lodash';
import { msgid, ngettext } from 'ttag';

import { XpCountStep } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import ChoiceListItemComponent from '@components/campaignguide/prompts/ChoiceListComponent/ChoiceListItemComponent';
import Card, { CardsMap } from '@data/Card';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import CampaignGuideContext from '../CampaignGuideContext';
import { Deck } from '@actions/types';
import { useSelector } from 'react-redux';
import { getDeck } from '@reducers';
import { parseBasicDeck } from '@lib/parseDeck';

interface Props {
  step: XpCountStep;
  campaignLog: GuidedCampaignLog;
}

function SpentDeckXpComponent({ deck, campaignLog, previousDeckId, playerCards, children }: {
  deck: Deck;
  campaignLog: GuidedCampaignLog;
  previousDeckId: number;
  playerCards: CardsMap;
  children: (xp: number) => JSX.Element | null;
}) {
  const previousDeck = useSelector(getDeck(previousDeckId)) || undefined;
  const parsedDeck = parseBasicDeck(
    deck,
    playerCards,
    previousDeck
  );
  const earnedXp = campaignLog.earnedXp(deck.investigator_code);
  if (!parsedDeck) {
    return children(earnedXp);
  }
  const { changes } = parsedDeck;
  const availableXp = (deck.xp || 0) + (deck.xp_adjustment || 0) - (changes?.spentXp || 0) + earnedXp;
  return children(availableXp);
}

function SpentXpComponent({ investigator, campaignLog, children }: {
  investigator: Card;
  campaignLog: GuidedCampaignLog;
  children: (xp: number) => JSX.Element | null;
}) {
  const { latestDecks, playerCards, adjustedInvestigatorData } = useContext(CampaignGuideContext);

  const deck = latestDecks[investigator.code];
  const earnedXp = campaignLog.earnedXp(investigator.code);
  if (deck) {
    if (!deck.previous_deck) {
      return children(earnedXp);
    }
    return (
      <SpentDeckXpComponent
        deck={deck}
        campaignLog={campaignLog}
        playerCards={playerCards}
        previousDeckId={deck.previous_deck}
      >
        { children }
      </SpentDeckXpComponent>
    );
  }
  const adjustedData = adjustedInvestigatorData[investigator.code];
  return children(earnedXp + campaignLog.totalXp(investigator.code) - (adjustedData ? adjustedData.spentXp || 0 : 0));
}

export default class XpCountComponent extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _onChoiceChange = () => {
    // intentionally empty.
  };

  specialString(investigator: Card) {
    const { step, campaignLog } = this.props;
    const count = campaignLog.specialXp(investigator.code, step.special_xp);
    switch (step.special_xp) {
      case 'resupply_points':
        return ngettext(msgid`${count} resupply`,
          `${count} resupply`,
          count);
      case 'supply_points':
        return ngettext(msgid`${count} supply point`,
          `${count} supply points`,
          count);
    }
  }
  render() {
    const { campaignLog } = this.props;
    const { colors } = this.context;
    return (
      <>
        { map(campaignLog.investigators(false), (investigator, idx) => {
          const resupplyPointsString = this.specialString(investigator);
          return (
            <SpentXpComponent investigator={investigator} campaignLog={campaignLog}>
              { (xp: number) => (
                <ChoiceListItemComponent
                  key={investigator.code}
                  code={investigator.code}
                  name={investigator.name}
                  color={colors.faction[investigator.factionCode()].background}
                  choices={[{
                    text: ngettext(
                      msgid`${xp} general / ${resupplyPointsString} XP`,
                      `${xp} general / ${resupplyPointsString} XP`,
                      xp
                    ),
                  }]}
                  onChoiceChange={this._onChoiceChange}
                  choice={0}
                  editable={false}
                  optional={false}
                  firstItem={idx === 0}
                />
              ) }
            </SpentXpComponent>
          );
        })}
      </>
    );
  }
}
