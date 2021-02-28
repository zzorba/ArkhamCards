import React, { useContext, useMemo, useState } from 'react';
import { flatMap, forEach, throttle } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation, Options } from 'react-native-navigation';
import { t } from 'ttag';

import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import { CUSTOM, Campaign, STANDALONE } from '@actions/types';
import CampaignList from './CampaignList';
import { campaignNames } from '@components/campaign/constants';
import { searchMatchesText } from '@components/core/searchHelpers';
import withFetchCardsGate from '@components/card/withFetchCardsGate';
import { iconsMap } from '@app/NavIcons';
import COLORS from '@styles/colors';
import space, { m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import ArkhamButton from '@components/core/ArkhamButton';
import { useNavigationButtonPressed } from '@components/core/hooks';
import { NavigationProps } from '@components/nav/types';
import { getStandaloneScenarios } from '@data/scenario';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useCampaigns } from '@data/remote/hooks';

function MyCampaignsView({ componentId }: NavigationProps) {
  const [search, setSearch] = useState('');
  const { lang } = useContext(LanguageContext);
  const standalonesById = useMemo(() => {
    const scenarios = getStandaloneScenarios(lang);
    const result: {
      [campaign: string]: {
        [scenario: string]: string;
      };
    } = {};
    forEach(scenarios, scenario => {
      if (!result[scenario.id.campaignId]) {
        result[scenario.id.campaignId] = {};
      }
      result[scenario.id.campaignId][scenario.id.scenarioId] = scenario.name;
    });
    return result;
  }, [lang]);
  const { typography } = useContext(StyleContext);
  const [campaigns, refreshing, refreshCampaigns] = useCampaigns();
  const showNewCampaignDialog = useMemo(() => {
    return throttle(() => {
      Navigation.push(componentId, {
        component: {
          name: 'Campaign.New',
          options: {
            topBar: {
              title: {
                text: t`New Campaign`,
              },
              backButton: {
                title: t`Cancel`,
              },
            },
          },
        },
      });
    });
  }, [componentId]);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'add') {
      showNewCampaignDialog();
    }
  }, componentId, [showNewCampaignDialog]);

  const filteredCampaigns: Campaign[] = useMemo(() => {
    return flatMap(campaigns, (campaign) => {
      const parts = [campaign.name];
      if (campaign.cycleCode === STANDALONE) {
        if (campaign.standaloneId) {
          parts.push(standalonesById[campaign.standaloneId.campaignId][campaign.standaloneId.scenarioId]);
        }
      } else if (campaign.cycleCode !== CUSTOM) {
        parts.push(campaignNames()[campaign.cycleCode]);
      }
      if (!searchMatchesText(search, parts)) {
        return [];
      }
      return campaign;
    });
  }, [campaigns, search, standalonesById]);

  const conditionalFooter = useMemo(() => {
    if (filteredCampaigns.length === 0) {
      if (search) {
        return (
          <View style={[styles.footer, space.paddingTopS]}>
            <Text style={[typography.text]}>
              { t`No matching campaigns for "${search}".` }
            </Text>
          </View>
        );
      }
      return (
        <View style={[styles.footer, space.paddingTopS]}>
          <Text style={[typography.text]}>
            { t`No campaigns yet.\n\nUse the + button to create a new one.\n\nYou can use this app to keep track of campaigns, including investigator trauma, the chaos bag, basic weaknesses, campaign notes and the experience values for all decks.` }
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.footer} />
    );
  }, [filteredCampaigns, search, typography]);
  const footer = useMemo(() => {
    return (
      <View>
        { conditionalFooter }
        <ArkhamButton
          icon="campaign"
          title={t`New Campaign`}
          onPress={showNewCampaignDialog}
        />
        <View style={styles.gutter} />
      </View>
    );
  }, [conditionalFooter, showNewCampaignDialog]);

  return (
    <CollapsibleSearchBox
      prompt={t`Search campaigns`}
      searchTerm={search}
      onSearchChange={setSearch}
    >
      { onScroll => (
        <CampaignList
          onScroll={onScroll}
          componentId={componentId}
          campaigns={filteredCampaigns}
          standalonesById={standalonesById}
          onRefresh={refreshCampaigns}
          refreshing={refreshing}
          footer={footer}
        />
      ) }
    </CollapsibleSearchBox>
  );
}

MyCampaignsView.options = (): Options => {
  return {
    topBar: {
      title: {
        text: t`Campaigns`,
      },
      rightButtons: [{
        icon: iconsMap.add,
        id: 'add',
        color: COLORS.M,
        accessibilityLabel: t`New Campaign`,
      }],
    },
  };
};

export default withFetchCardsGate<NavigationProps>(
  MyCampaignsView,
  { promptForUpdate: false },
);

const styles = StyleSheet.create({
  footer: {
    marginLeft: m,
    marginRight: m,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  gutter: {
    marginBottom: 60,
  },
});
