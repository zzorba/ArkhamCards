import React, { useCallback, useContext, useMemo } from 'react';
import { map } from 'lodash';
import { msgid, ngettext } from 'ttag';

import { XpCountStep } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import ChoiceListItemComponent from '@components/campaignguide/prompts/ChoiceListComponent/ChoiceListItemComponent';
import Card, { CardsMap } from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import CampaignGuideContext from '../CampaignGuideContext';
import { Deck } from '@actions/types';
import { parseBasicDeck } from '@lib/parseDeck';

interface Props {
  step: XpCountStep;
  campaignLog: GuidedCampaignLog;
}

function SpentDeckXpComponent({ deck, campaignLog, previousDeck, playerCards, children }: {
  deck: Deck;
  campaignLog: GuidedCampaignLog;
  previousDeck: Deck;
  playerCards: CardsMap;
  children: (xp: number) => JSX.Element | null;
}) {
  const parsedDeck = useMemo(() => parseBasicDeck(deck, playerCards, previousDeck), [deck, playerCards, previousDeck]);
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
  const { latestDecks, playerCards, spentXp } = useContext(CampaignGuideContext);

  const deck = latestDecks[investigator.code];
  const earnedXp = campaignLog.earnedXp(investigator.code);
  if (deck) {
    if (!deck.previousDeck) {
      return children(earnedXp);
    }
    return (
      <SpentDeckXpComponent
        deck={deck.deck}
        campaignLog={campaignLog}
        playerCards={playerCards}
        previousDeck={deck.previousDeck}
      >
        { children }
      </SpentDeckXpComponent>
    );
  }
  return children(earnedXp + campaignLog.totalXp(investigator.code) - (spentXp[investigator.code] || 0));
}

function onChoiceChange() {
  // intentionally empty.
}

export default function XpCountComponent({ step, campaignLog }: Props) {
  const { colors } = useContext(StyleContext);
  const specialString = useCallback((investigator: Card) => {
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
  }, [step, campaignLog]);
  return (
    <>
      { map(campaignLog.investigators(false), (investigator, idx) => {
        const resupplyPointsString = specialString(investigator);
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
                onChoiceChange={onChoiceChange}
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
