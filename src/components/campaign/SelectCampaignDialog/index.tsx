import React, { useCallback, useMemo, useContext } from 'react';
import { Navigation } from 'react-native-navigation';
import { ScrollView, StyleSheet } from 'react-native';
import { t } from 'ttag';

import {
  CampaignCycleCode, StandaloneId,
} from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import TabView from '@components/core/TabView';
import StandaloneTab from './StandaloneTab';
import CampaignTab from './CampaignTab';
import StyleContext from '@styles/StyleContext';
import ArkhamButton from '@components/core/ArkhamButton';

export type CampaignSelection = {
  type: 'campaign';
  code: CampaignCycleCode;
} | {
  type: 'standalone';
  id: StandaloneId;
}
export interface SelectCampagaignProps {
  selectionChanged: (selection: CampaignSelection, text: string, hasGuide: boolean) => void;
}

function SelectCampaignDialog({ selectionChanged, componentId }: SelectCampagaignProps & NavigationProps) {
  const { backgroundStyle } = useContext(StyleContext);
  const campaignChanged = useCallback((packCode: CampaignCycleCode, text: string, hasGuide: boolean) => {
    selectionChanged({ type: 'campaign', code: packCode }, text, hasGuide);
    Navigation.pop(componentId);
  }, [selectionChanged, componentId]);
  const standaloneChanged = useCallback((id: StandaloneId, text: string, hasGuide: boolean) => {
    selectionChanged({ type: 'standalone', id }, text, hasGuide);
    Navigation.pop(componentId);
  }, [selectionChanged, componentId]);

  const editCollection = useCallback(() => {
    Navigation.push(componentId, {
      component: {
        name: 'My.Collection',
      },
    });
  }, [componentId]);

  const tabs = useMemo(() => [
    {
      key: 'campaign',
      title: t`Campaigns`,
      node: (
        <ScrollView style={[styles.flex, backgroundStyle]}>
          <CampaignTab campaignChanged={campaignChanged} />
          <ArkhamButton
            icon="edit"
            onPress={editCollection}
            title={t`Edit Collection`}
          />
        </ScrollView>
      ),
    },
    {
      key: 'standalone',
      title: t`Standalones`,
      node: (
        <ScrollView style={[styles.flex, backgroundStyle]}>
          <StandaloneTab standaloneChanged={standaloneChanged} />
          <ArkhamButton
            icon="edit"
            onPress={editCollection}
            title={t`Edit Collection`}
          />
        </ScrollView>
      ),
    },
  ], [campaignChanged, standaloneChanged, editCollection, backgroundStyle]);

  return (
    <TabView tabs={tabs} />
  );
}

SelectCampaignDialog.options = () => {
  return {
    topBar: {
      title: {
        text: t`Select Campaign`,
      },
    },
  };
};

export default SelectCampaignDialog;


const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
