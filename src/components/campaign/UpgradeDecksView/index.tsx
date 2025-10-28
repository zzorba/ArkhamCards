import React, { useCallback, useContext, useLayoutEffect, useRef } from 'react';
import { map } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { CampaignId, Deck, getDeckId, ScenarioResult } from '@actions/types';
import { getLangPreference } from '@reducers';
import { updateCampaignXp } from '@components/campaign/actions';
import UpgradeDecksList from './UpgradeDecksList';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useCampaignInvestigators } from '@data/hooks';
import { useDismissOnCampaignDeleted, useUpdateCampaignActions } from '@data/remote/campaigns';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { useAppDispatch } from '@app/store';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';
import { BasicStackParamList } from '@navigation/types';
import HeaderButton from '@components/core/HeaderButton';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import HeaderTitle from '@components/core/HeaderTitle';

export interface UpgradeDecksProps {
  id: CampaignId;
  // eslint-disable-next-line react/no-unused-prop-types
  scenarioResult: ScenarioResult;
}

const EMPTY_DECKS: LatestDeckT[] = [];

function UpgradeDecksView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Campaign.UpgradeDecks'>>();
  const navigation = useNavigation();
  const { id } = route.params;
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const dispatch = useAppDispatch();
  const campaign = useCampaign(id);
  useDismissOnCampaignDeleted(navigation, campaign);
  const [allInvestigators] = useCampaignInvestigators(campaign);
  const latestDecks = campaign?.latestDecks() ?? EMPTY_DECKS;
  const lang = useSelector(getLangPreference);
  const updateCampaignActions = useUpdateCampaignActions();
  const originalDeckUuids = useRef(new Set(map(latestDecks, deck => deck.id.uuid)));
  const close = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          iconName="close"
          onPress={close}
          accessibilityLabel={t`Close`}
          color={colors.M}
        />
      ),
    });
  }, [navigation, close, colors]);

  const updateInvestigatorXp = useCallback((investigator: CampaignInvestigator, xp: number) => {
    if (campaign) {
      const investigatorData = campaign.getInvestigatorData(investigator.code);
      const oldXp = investigatorData.availableXp || 0;
      dispatch(updateCampaignXp(
        updateCampaignActions,
        id,
        investigator.code,
        oldXp + xp,
        'availableXp'
      ));
    }
  }, [campaign, id, updateCampaignActions, dispatch]);

  const showDeckUpgradeDialog = useCallback((deck: Deck) => {
    navigation.navigate('Deck.Upgrade', {
      id: getDeckId(deck),
      campaignId: id,
      showNewDeck: false,
    });
  }, [navigation, id]);
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
        lang={lang}
        campaign={campaign}
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
function options<T extends BasicStackParamList>({ route }: { route: RouteProp<T, 'Campaign.UpgradeDecks'> }): NativeStackNavigationOptions {
  return {
    headerTitle: () => <HeaderTitle title={route.params?.scenarioResult.scenario ?? t`Scenario results`} subtitle={t`Update investigator decks`} />,
    headerBackTitle: t`Cancel`,
  };
};

UpgradeDecksView.options = options;
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
