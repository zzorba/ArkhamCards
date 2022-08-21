import React, { useCallback, useContext, useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
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
import space, { m, s } from '@styles/space';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import { useLatestDeckCards } from '@components/core/hooks';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  step: XpCountStep;
  campaignLog: GuidedCampaignLog;
}

function SpentDeckXpComponent({ deck, campaignLog, previousDeck, playerCards, children }: {
  deck: Deck;
  campaignLog: GuidedCampaignLog;
  previousDeck: Deck;
  playerCards?: CardsMap;
  children: (xp: number) => JSX.Element | null;
}) {
  const { listSeperator } = useContext(LanguageContext);
  const parsedDeck = useMemo(
    () => playerCards ? parseBasicDeck(deck, playerCards, listSeperator, previousDeck) : undefined,
    [deck, playerCards, previousDeck, listSeperator]);
  const earnedXp = campaignLog.earnedXp(deck.investigator_code);
  if (!parsedDeck || !playerCards) {
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
  const { latestDecks, spentXp } = useContext(CampaignGuideContext);
  const deck = latestDecks[investigator.code];
  const earnedXp = campaignLog.earnedXp(investigator.code);
  const [playerCards] = useLatestDeckCards(deck);
  if (deck) {
    if (!deck.previousDeck) {
      return children(earnedXp);
    }
    return (
      <SpentDeckXpComponent
        deck={deck.deck}
        playerCards={playerCards}
        campaignLog={campaignLog}
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
  const { colors, typography, width } = useContext(StyleContext);
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
      { !!step.title && (
        <View style={styles.titleWrapper}>
          <Text style={[
            typography.bigGameFont,
            { color: colors.darkText },
            space.paddingTopL,
          ]}>
            { step.title }
          </Text>
        </View>
      ) }
      { !!step.text && (
        <SetupStepWrapper bulletType={step.bullet_type}>
          <CampaignGuideTextComponent text={step.text} />
        </SetupStepWrapper>
      )}
      { map(campaignLog.investigators(false), (investigator, idx) => {
        const resupplyPointsString = specialString(investigator);
        return (
          <View style={space.paddingSideS}>
            <SpentXpComponent investigator={investigator} campaignLog={campaignLog}>
              { (xp: number) => (
                <ChoiceListItemComponent
                  key={investigator.code}
                  investigator={investigator}
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
                  width={width - s * 2}
                  firstItem={idx === 0}
                />
              ) }
            </SpentXpComponent>
          </View>
        );
      })}
    </>
  );
}


const styles = StyleSheet.create({
  titleWrapper: {
    marginLeft: m,
    marginRight: m + s,
  },
});
