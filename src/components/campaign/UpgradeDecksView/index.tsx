import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { flatMap, map } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { CampaignId, Deck, getDeckId, ScenarioResult } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import Card from '@data/types/Card';
import { getAllDecks, getDeck, getLangPreference } from '@reducers';
import { iconsMap } from '@app/NavIcons';
import COLORS from '@styles/colors';
import { updateCampaignXp } from '@components/campaign/actions';
import UpgradeDecksList from './UpgradeDecksList';
import { UpgradeDeckProps } from '@components/deck/DeckUpgradeDialog';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCampaignDetails, useInvestigatorCards, useNavigationButtonPressed } from '@components/core/hooks';
import { useCampaign } from '@data/remote/hooks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useUpdateCampaignActions } from '@data/remote/campaigns';

export interface UpgradeDecksProps {
  id: CampaignId;
  scenarioResult: ScenarioResult;
}

function UpgradeDecksView({ componentId, id }: UpgradeDecksProps & NavigationProps) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const dispatch = useDispatch();
  const investigators = useInvestigatorCards();
  const campaign = useCampaign(id);
  const [latestDeckIds, allInvestigators] = useCampaignDetails(campaign, investigators);
  const lang = useSelector(getLangPreference);
  const decks = useSelector(getAllDecks);
  const updateCampaignActions = useUpdateCampaignActions();
  const originalDeckUuids = useRef(new Set(map(latestDeckIds, id => id.uuid)));
  const close = useCallback(() => {
    Navigation.dismissModal(componentId);
  }, [componentId]);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'close') {
      close();
    }
  }, componentId, [close]);

  const updateInvestigatorXp = useCallback((investigator: Card, xp: number) => {
    if (campaign) {
      const investigatorData = campaign.investigatorData?.[investigator.code] || {};
      const oldXp = investigatorData.availableXp || 0;
      dispatch(updateCampaignXp(
        user,
        updateCampaignActions,
        id,
        investigator.code,
        oldXp + xp,
        'availableXp'
      ));
    }
  }, [campaign, id, user, updateCampaignActions, dispatch]);

  const showDeckUpgradeDialog = useCallback((deck: Deck, investigator?: Card) => {
    const backgroundColor = colors.faction[investigator ? investigator.factionCode() : 'neutral'].background;
    Navigation.push<UpgradeDeckProps>(componentId, {
      component: {
        name: 'Deck.Upgrade',
        passProps: {
          id: getDeckId(deck),
          campaignId: id,
          showNewDeck: false,
        },
        options: {
          statusBar: {
            style: 'light',
            backgroundColor,
          },
          topBar: {
            title: {
              text: t`Upgrade`,
              color: 'white',
            },
            subtitle: {
              text: investigator ? investigator.name : '',
              color: 'white',
            },
            background: {
              color: backgroundColor,
            },
          },
        },
      },
    });
  }, [componentId, id, colors]);
  const latestDecks = useMemo(() => flatMap(latestDeckIds, deckId => getDeck(decks, deckId) || []), [decks, latestDeckIds]);

  if (!campaign) {
    return null;
  }
  return (
    <ScrollView contentContainerStyle={[styles.container, backgroundStyle]}>
      <View style={space.marginS}>
        <Text style={typography.small}>
          { t`By upgrading a deck, you can track XP and story card upgrades as your campaign develops.\n\nPrevious versions of your deck will still be accessible.` }
        </Text>
      </View>
      <UpgradeDecksList
        componentId={componentId}
        lang={lang}
        investigatorData={campaign.investigatorData}
        allInvestigators={allInvestigators}
        decks={latestDecks}
        originalDeckUuids={originalDeckUuids.current}
        showDeckUpgradeDialog={showDeckUpgradeDialog}
        updateInvestigatorXp={updateInvestigatorXp}
      />
      <BasicButton title={t`Done`} onPress={close} />
      <View style={styles.footer} />
    </ScrollView>
  );
}

UpgradeDecksView.options = (passProps: UpgradeDecksProps) => {
  return {
    topBar: {
      title: {
        text: passProps.scenarioResult.scenario,
      },
      subtitle: {
        text: t`Update investigator decks`,
      },
      leftButtons: [{
        icon: iconsMap.close,
        id: 'close',
        color: COLORS.M,
        accessibilityLabel: t`Cancel`,
      }],
    },
  };
};
export default UpgradeDecksView;

const styles = StyleSheet.create({
  container: {
    paddingTop: s,
    paddingBottom: s,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  footer: {
    height: 100,
  },
});
