import React, { useContext, useMemo, useState, useLayoutEffect } from 'react';
import { concat, filter, flatMap, forEach, partition, throttle } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { t } from 'ttag';

import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import { CUSTOM, STANDALONE } from '@actions/types';
import CampaignList from './CampaignList';
import { campaignNames } from '@components/campaign/constants';
import { searchMatchesText } from '@components/core/searchHelpers';
import withFetchCardsGate from '@components/card/withFetchCardsGate';
import HeaderButton from '@components/core/HeaderButton';
import space, { m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import ArkhamButton from '@components/core/ArkhamButton';
import { useFlag } from '@components/core/hooks';
import { useStandaloneScenarios } from '@data/scenario';
import { useCampaigns } from '@data/hooks';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import withApolloGate from '@components/core/withApolloGate';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { SimpleChaosBagItem } from './GenericCampaignItem';

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
          value={showArchived}
          onValueChange={toggleShowArchived}
        />
      </View>
    </View>
  );
}

function MyCampaignsView() {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const { fontScale, colors } = useContext(StyleContext);
  const scenarios = useStandaloneScenarios();
  const standalonesById = useMemo(() => {
    const result: {
      [campaign: string]: {
        [scenario: string]: string | undefined;
      } | undefined;
    } = {};
    forEach(scenarios, scenario => {
      if (scenario.type === 'standalone') {
        if (!result[scenario.id.campaignId]) {
          result[scenario.id.campaignId] = {};
        }
        result[scenario.id.campaignId]![scenario.id.scenarioId] = scenario.name;
      }
    });
    return result;
  }, [scenarios]);
  const { typography } = useContext(StyleContext);
  const [campaigns, refreshing, refreshCampaigns] = useCampaigns();
  const [showArchived, toggleShowArchived] = useFlag(false);
  const showNewCampaignDialog = useMemo(() => {
    return throttle(() => {
      navigation.navigate('Campaign.New');
    });
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t`Campaigns`,
      headerRight: () => (
        <HeaderButton
          iconName="plus-button"
          onPress={showNewCampaignDialog}
          color={colors.M}
          accessibilityLabel={t`New Campaign`}
        />
      ),
    });
  }, [navigation, colors.M, showNewCampaignDialog]);

  const filteredCampaigns: MiniCampaignT[] = useMemo(() => {
    const [archived, unarchived] = partition(flatMap(campaigns, (campaign) => {
      const parts = [campaign.name];
      const cycleCode = campaign.cycleCode;
      if (cycleCode === STANDALONE) {
        const standaloneId = campaign.standaloneId;
        if (standaloneId) {
          const scenarioName = standalonesById[standaloneId.campaignId]?.[standaloneId.scenarioId];
          if (scenarioName) {
            parts.push(scenarioName);
          }
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

  const [conditionalFooter, footerHeight] = useMemo(() => {
    if (filteredCampaigns.length === 0) {
      if (search) {
        return [(
          <View key="none" style={[styles.footer, space.paddingTopM]}>
            <Text style={[typography.text, typography.center]}>
              { t`No matching campaigns for "${search}".` }
            </Text>
          </View>
        ), 64 * fontScale];
      }
      return [(
        <View key="none-create" style={[styles.footer, space.paddingTopM]}>
          <Text style={[typography.text]}>
            { t`No campaigns yet.\n\nUse the + button to create a new one.\n\nYou can use this app to keep track of campaigns, including investigator trauma, the chaos bag, basic weaknesses, campaign notes and the experience values for all decks.` }
          </Text>
        </View>
      ), 96 * fontScale];
    }
    return [(
      <View key="empty" style={styles.footer} />
    ), 0];
  }, [filteredCampaigns, search, fontScale, typography]);
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
    <View style={{ flex: 1 }}>
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
            campaigns={realFilteredCampaigns}
            standalonesById={standalonesById}
            onRefresh={refreshCampaigns}
            buttons={buttons}
            refreshing={refreshing}
            footer={footer}
            footerHeight={footerHeight}
            header={!search ? <SimpleChaosBagItem /> : undefined}
          />
        ) }
      </CollapsibleSearchBox>
    </View>
  );
}
export default withApolloGate(
  withFetchCardsGate(
    MyCampaignsView,
    { promptForUpdate: false },
  )
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
