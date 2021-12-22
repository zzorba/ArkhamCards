import React, { useContext, useMemo, useState } from 'react';
import { concat, filter, flatMap, forEach, partition, throttle } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation, Options } from 'react-native-navigation';
import { t } from 'ttag';

import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import { CUSTOM, STANDALONE } from '@actions/types';
import CampaignList from './CampaignList';
import { campaignNames } from '@components/campaign/constants';
import { searchMatchesText } from '@components/core/searchHelpers';
import withFetchCardsGate from '@components/card/withFetchCardsGate';
import { iconsMap } from '@app/NavIcons';
import COLORS from '@styles/colors';
import space, { m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import ArkhamButton from '@components/core/ArkhamButton';
import { useFlag, useNavigationButtonPressed } from '@components/core/hooks';
import { NavigationProps } from '@components/nav/types';
import { getStandaloneScenarios } from '@data/scenario';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useCampaigns } from '@data/hooks';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import withApolloGate from '@components/core/withApolloGate';
import ArkhamSwitch from '@components/core/ArkhamSwitch';


function SearchOptions({
  showArchived,
  toggleShowArchived,
}: {
  showArchived: boolean;
  toggleShowArchived: () => void;
}) {
  const { typography } = useContext(StyleContext);
  return (
    <View style={styles.searchOptions}>
      <View style={styles.row} key={2}>
        <Text style={[typography.small, styles.searchOption]}>
          { t`Show archived campaigns` }
        </Text>
        <ArkhamSwitch
          useGestureHandler
          value={showArchived}
          onValueChange={toggleShowArchived}
        />
      </View>
    </View>
  );
}

function MyCampaignsView({ componentId }: NavigationProps) {
  const [search, setSearch] = useState('');
  const { lang } = useContext(LanguageContext);
  const { fontScale } = useContext(StyleContext);
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
  const [showArchived, toggleShowArchived] = useFlag(false);
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

  const filteredCampaigns: MiniCampaignT[] = useMemo(() => {
    const [archived, unarchived] = partition(flatMap(campaigns, (campaign) => {
      const parts = [campaign.name];
      const cycleCode = campaign.cycleCode;
      if (cycleCode === STANDALONE) {
        const standaloneId = campaign.standaloneId;
        if (standaloneId) {
          parts.push(standalonesById[standaloneId.campaignId][standaloneId.scenarioId]);
        }
      } else if (cycleCode !== CUSTOM) {
        parts.push(campaignNames()[cycleCode] || '');
      }
      if (!searchMatchesText(search, parts)) {
        return [];
      }
      return campaign;
    }), c => !!c.archived);
    return concat(unarchived, archived);
  }, [campaigns, search, standalonesById]);

  const [realFilteredCampaigns, hiddenArchived] = useMemo(() => {
    const result = filter(filteredCampaigns, f => showArchived || !f.archived);
    return [result, result.length !== filteredCampaigns.length];
  }, [filteredCampaigns, showArchived]);

  const conditionalFooter = useMemo(() => {
    if (filteredCampaigns.length === 0) {
      if (search) {
        return (
          <View style={[styles.footer, space.paddingTopS]}>
            <Text style={[typography.text, typography.center]}>
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
  const buttons: React.ReactNode[] = useMemo(() => {
    const result: React.ReactNode[] = [];
    if (hiddenArchived) {
      result.push(
        <ArkhamButton
          key="archived"
          icon="expand"
          title={t`Show archived campaigns`}
          onPress={toggleShowArchived}
        />
      );
    }
    result.push(
      <ArkhamButton
        key="new"
        icon="campaign"
        title={t`New Campaign`}
        onPress={showNewCampaignDialog}
      />
    );
    return result;
  }, [hiddenArchived, toggleShowArchived, showNewCampaignDialog]);
  const footer = useMemo(() => {
    return (
      <View>
        { conditionalFooter }
        <View style={styles.gutter} />
      </View>
    );
  }, [conditionalFooter]);
  return (
    <CollapsibleSearchBox
      prompt={t`Search campaigns`}
      searchTerm={search}
      onSearchChange={setSearch}
      advancedOptions={{
        controls: <SearchOptions showArchived={showArchived} toggleShowArchived={toggleShowArchived} />,
        height: 20 + (fontScale * 20 + 8) + 12,
      }}
    >
      { onScroll => (
        <CampaignList
          onScroll={onScroll}
          componentId={componentId}
          campaigns={realFilteredCampaigns}
          standalonesById={standalonesById}
          onRefresh={refreshCampaigns}
          buttons={buttons}
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

export default withApolloGate(
  withFetchCardsGate<NavigationProps>(
    MyCampaignsView,
    { promptForUpdate: false },
  )
);

const styles = StyleSheet.create({
  footer: {
    marginLeft: m,
    marginRight: m,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gutter: {
    marginBottom: 60,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: xs,
    paddingBottom: xs,
    paddingLeft: s,
    paddingRight: s,
  },
  searchOptions: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
  },
  searchOption: {
    marginRight: 2,
  },
});
